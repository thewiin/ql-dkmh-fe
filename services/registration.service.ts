import PaymentService from "./payment.service";
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

  detectScheduleConflicts,
  formatConflictMessage,
  timeToMinutes,
};

export default RegistrationService;
