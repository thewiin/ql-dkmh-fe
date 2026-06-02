import PaymentService from "./payment.service";
import SinhVienService from "./sinhVien.service";
import LopHocPhanService from "./lopHocPhan.service";
import type { TuitionValidationResult, CourseScheduleSlot, CourseRegistrationItem, RegisteredCourseItem } from "../types";

export interface ScheduleConflict {
  conflictingCourse: RegisteredCourseItem;
  conflictingSchedules: Array<{
    day: number;
    registeredTime: string;
    newTime: string;
  }>;
}

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/** Chuyển đổi thời gian "HH:MM" thành số phút từ đầu ngày */
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/** Kiểm tra xem hai khoảng thời gian có trùng lặp không */
const hasTimeOverlap = (
  newStart: number,
  newEnd: number,
  regStart: number,
  regEnd: number
): boolean => {
  return newStart < regEnd && newEnd > regStart;
};

/** Phát hiện xung đột lịch học chi tiết */
const detectScheduleConflicts = (
  newCourse: CourseRegistrationItem,
  registeredCourses: RegisteredCourseItem[]
): ScheduleConflict[] => {
  const conflicts: ScheduleConflict[] = [];

  for (const registered of registeredCourses) {
    const conflictingSchedules: ScheduleConflict["conflictingSchedules"] = [];

    // Kiểm tra từng cặp lịch học
    for (const newSchedule of newCourse.schedule) {
      for (const regSchedule of registered.schedule) {
        // Kiểm tra cùng ngày
        if (newSchedule.day === regSchedule.day) {
          const newStart = timeToMinutes(newSchedule.startTime);
          const newEnd = timeToMinutes(newSchedule.endTime);
          const regStart = timeToMinutes(regSchedule.startTime);
          const regEnd = timeToMinutes(regSchedule.endTime);

          // Kiểm tra xung đột thời gian
          if (hasTimeOverlap(newStart, newEnd, regStart, regEnd)) {
            conflictingSchedules.push({
              day: newSchedule.day,
              registeredTime: `${regSchedule.startTime}-${regSchedule.endTime}`,
              newTime: `${newSchedule.startTime}-${newSchedule.endTime}`,
            });
          }
        }
      }
    }

    // Nếu có xung đột, thêm vào danh sách
    if (conflictingSchedules.length > 0) {
      conflicts.push({
        conflictingCourse: registered,
        conflictingSchedules,
      });
    }
  }

  return conflicts;
};

/** Format thông báo xung đột lịch học */
const formatConflictMessage = (conflicts: ScheduleConflict[]): string => {
  if (conflicts.length === 0) return "";

  const messages = conflicts.map((conflict) => {
    const scheduleDetails = conflict.conflictingSchedules
      .map((s) => `${dayNames[s.day]} ${s.registeredTime}`)
      .join(", ");
    return `${conflict.conflictingCourse.name} (${scheduleDetails})`;
  });

  return `Trùng lịch với: ${messages.join("; ")}`;
};

interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateCourseName?: string;
}

interface SeatsCheckResult {
  hasSeats: boolean;
  remainingSeats: number;
}

interface SubmitRegistrationRequest {
  maSV: string;
  maLHP: string;
}

type RegistrationWorkflowStep =
  | "tuition"
  | "duplicate"
  | "prerequisite"
  | "conflict"
  | "seat"
  | "submit"
  | "error_map";

interface WorkflowValidationContext {
  maSV: string;
  courses: RegisteredCourseItem[];
  completedCourseCodes?: string[];
}

interface WorkflowErrorMap {
  tuition: string[];
  duplicate: string[];
  prerequisite: string[];
  conflict: string[];
  seat: string[];
  submit: string[];
}

interface RegistrationWorkflowResult {
  success: boolean;
  step: RegistrationWorkflowStep;
  message: string;
  errorMap: WorkflowErrorMap;
  submittedCourseIds: string[];
  failedCourseIds: string[];
}

const RegistrationService = {
  validateTuition: async (): Promise<TuitionValidationResult> => {
    const tuition = await PaymentService.getTuitionStatus();

    return {
      canRegister: !tuition.isBlocked,
      status: tuition.status,
      message: tuition.message,
    };
  },

  /** Kiểm tra môn học đã được đăng ký */
  checkDuplicate: (course: CourseRegistrationItem | { id: string; name: string }, registeredCourses: any[]): DuplicateCheckResult => {
    const isDuplicate = registeredCourses.some((c) => c.id === course.id);
    return {
      isDuplicate,
      duplicateCourseName: isDuplicate ? course.name : undefined,
    };
  },

  /** Kiểm tra còn chỗ trống */
  checkRemainingSeats: (course: CourseRegistrationItem): SeatsCheckResult => {
    const hasSeats = course.remainingSeats > 0;
    return {
      hasSeats,
      remainingSeats: course.remainingSeats,
    };
  },

  /** Submit đăng ký toàn bộ danh sách môn học */
  submitRegistration: async (
    registeredCourses: any[],
    maSV: string
  ): Promise<{ success: boolean; message: string; failedCourses?: string[] }> => {
    if (!registeredCourses || registeredCourses.length === 0) {
      return {
        success: false,
        message: "Vui lòng chọn ít nhất một môn học để đăng ký",
      };
    }

    try {
      const requests = registeredCourses.map((course) => ({
        maSV,
        maLHP: course.id,
      }));

      // Call API endpoint POST /dangky/batch hoặc tương tự
      // Nếu backend không hỗ trợ batch, gọi từng cái một
      const responses = await Promise.allSettled(
        requests.map((req, idx) =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"}/dangky`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("jwt_token") || "" : ""}`,
            },
            body: JSON.stringify(req),
          }).then((res) => {
            if (!res.ok) throw new Error(`Failed to register ${registeredCourses[idx].code || req.maLHP}`);
            return res.json();
          })
        )
      );

      const failedCourses: string[] = [];
      responses.forEach((result, idx) => {
        if (result.status === "rejected") {
          failedCourses.push(requests[idx].maLHP);
        }
      });

      if (failedCourses.length > 0) {
        return {
          success: false,
          message: `Đăng ký thất bại cho ${failedCourses.length} môn học`,
          failedCourses,
        };
      }

      return {
        success: true,
        message: `Đã đăng ký thành công ${registeredCourses.length} môn học`,
      };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi khi đăng ký: " + (error instanceof Error ? error.message : "Vui lòng thử lại"),
      };
    }
  },

  executeRegistrationWorkflow: async ({
    maSV,
    courses,
    completedCourseCodes = [],
  }: WorkflowValidationContext): Promise<RegistrationWorkflowResult> => {
    const errorMap: WorkflowErrorMap = {
      tuition: [],
      duplicate: [],
      prerequisite: [],
      conflict: [],
      seat: [],
      submit: [],
    };

    if (!maSV) {
      errorMap.submit.push("Không thể lấy thông tin sinh viên. Vui lòng đăng nhập lại.");
      return {
        success: false,
        step: "error_map",
        message: errorMap.submit[0],
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: [],
      };
    }

    if (!courses || courses.length === 0) {
      errorMap.submit.push("Vui lòng chọn ít nhất một môn học để đăng ký.");
      return {
        success: false,
        step: "error_map",
        message: errorMap.submit[0],
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: [],
      };
    }

    const tuition = await RegistrationService.validateTuition();
    if (!tuition.canRegister) {
      errorMap.tuition.push(tuition.message || "Bạn không thể đăng ký môn học lúc này.");
      return {
        success: false,
        step: "tuition",
        message: errorMap.tuition[0],
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: courses.map((course) => course.id),
      };
    }

    const seenCourseIds = new Set<string>();
    courses.forEach((course) => {
      if (seenCourseIds.has(course.id)) {
        errorMap.duplicate.push(`Môn "${course.name}" đang bị trùng trong danh sách đăng ký.`);
      }
      seenCourseIds.add(course.id);
    });
    if (errorMap.duplicate.length > 0) {
      return {
        success: false,
        step: "duplicate",
        message: errorMap.duplicate[0],
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: courses.map((course) => course.id),
      };
    }

    courses.forEach((course) => {
      if (!course.prerequisite) return;
      if (!completedCourseCodes.includes(course.prerequisite)) {
        errorMap.prerequisite.push(
          `Môn "${course.name}" yêu cầu học trước môn ${course.prerequisite}.`
        );
      }
    });
    if (errorMap.prerequisite.length > 0) {
      return {
        success: false,
        step: "prerequisite",
        message: errorMap.prerequisite[0],
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: courses.map((course) => course.id),
      };
    }

    for (let i = 0; i < courses.length; i += 1) {
      const current = courses[i];
      const compareTargets = courses.slice(0, i).map((course) => ({
        ...course,
        registeredAt: course.registeredAt,
      }));
      const conflicts = detectScheduleConflicts(current, compareTargets);
      if (conflicts.length > 0) {
        errorMap.conflict.push(
          `Môn "${current.name}" ${formatConflictMessage(conflicts).replace("Trùng lịch với: ", "trùng lịch với ")}`
        );
      }
    }
    if (errorMap.conflict.length > 0) {
      return {
        success: false,
        step: "conflict",
        message: errorMap.conflict[0],
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: courses.map((course) => course.id),
      };
    }

    courses.forEach((course) => {
      if (course.remainingSeats <= 0) {
        errorMap.seat.push(`Môn "${course.name}" đã hết chỗ.`);
      }
    });
    if (errorMap.seat.length > 0) {
      return {
        success: false,
        step: "seat",
        message: errorMap.seat[0],
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: courses.map((course) => course.id),
      };
    }

    const submitResult = await RegistrationService.submitRegistration(courses, maSV);
    if (!submitResult.success) {
      errorMap.submit.push(submitResult.message);
      return {
        success: false,
        step: "submit",
        message: submitResult.message,
        errorMap,
        submittedCourseIds: [],
        failedCourseIds: submitResult.failedCourses ?? courses.map((course) => course.id),
      };
    }

    return {
      success: true,
      step: "submit",
      message: submitResult.message,
      errorMap,
      submittedCourseIds: courses.map((course) => course.id),
      failedCourseIds: [],
    };
  },

  getCompletedCourseCodesFromBackend: async (maSV: string): Promise<string[]> => {
    if (!maSV) return [];

    const [diemList, lopHocPhanList] = await Promise.all([
      SinhVienService.getDiemBySinhVien(maSV),
      LopHocPhanService.getAllLopHocPhan(),
    ]);

    const lopHocPhanToMonHocMap = new Map(
      lopHocPhanList.map((lhp) => [lhp.maLHP, lhp.maMH])
    );

    const passedCourseCodes = new Set<string>();
    diemList.forEach((diem) => {
      const isPassed =
        (typeof diem.diemTongKet === "number" && diem.diemTongKet >= 5) ||
        diem.trangThai?.toLowerCase() === "passed";

      if (!isPassed) return;

      const maMonHoc = lopHocPhanToMonHocMap.get(diem.maLopHocPhan);
      if (maMonHoc) {
        passedCourseCodes.add(maMonHoc);
      }
    });

    return [...passedCourseCodes];
  },

  detectScheduleConflicts,
  formatConflictMessage,
  timeToMinutes,
};

export default RegistrationService;
