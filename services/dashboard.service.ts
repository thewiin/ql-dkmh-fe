import api from "../lib/api";
import {
  DangKyMonHocResponse,
  DashboardNotificationViewModel,
  GpaChartViewModel,
  MonHocApi,
  ScheduleItemViewModel,
  SinhVienMe,
  StatsCardViewModel,
  StudentDashboardResponse,
  AdminDashboardResponse,
} from "../types";

const MA_SINH_VIEN_KEY = "ma_sinh_vien";
const CREDIT_GOAL = 120;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Vừa xong";
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function findMonHocForLhp(
  maLHP: string,
  monHocList: MonHocApi[]
): MonHocApi | undefined {
  return monHocList.find(
    (mh) =>
      maLHP === mh.maMH ||
      maLHP.startsWith(mh.maMH) ||
      maLHP.includes(mh.maMH)
  );
}

function sumCredits(
  registrations: DangKyMonHocResponse[],
  monHocList: MonHocApi[],
  activeOnly: boolean
): number {
  const filtered = activeOnly
    ? registrations.filter((dk) => dk.trangThaiDK === 1)
    : registrations;

  return filtered.reduce((sum, dk) => {
    const mon = findMonHocForLhp(dk.maLHP, monHocList);
    return sum + (mon?.soTinChi ?? 0);
  }, 0);
}

async function resolveMaSv(): Promise<string> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(MA_SINH_VIEN_KEY);
    if (cached) return cached;
  }

  const response = await api.get<SinhVienMe>("/auth/me");
  if (typeof window !== "undefined") {
    localStorage.setItem(MA_SINH_VIEN_KEY, response.data.maSv);
  }
  return response.data.maSv;
}

async function fetchStudentContext(): Promise<{
  me: SinhVienMe;
  registrations: DangKyMonHocResponse[];
  monHocList: MonHocApi[];
}> {
  const maSv = await resolveMaSv();
  const [meRes, dangKyRes, monHocRes] = await Promise.all([
    api.get<SinhVienMe>("/auth/me"),
    api.get<DangKyMonHocResponse[]>(`/dangky/sinhvien/${maSv}`),
    api.get<MonHocApi[]>("/monhoc"),
  ]);

  return {
    me: meRes.data,
    registrations: dangKyRes.data,
    monHocList: monHocRes.data,
  };
}

const DashboardService = {
  // Admin Dashboard APIs
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    try {
      const response = await api.get<AdminDashboardResponse>("/dashboard/admin");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      throw error;
    }
  },

  getCurrentStudentId: async (): Promise<string> => {
    return await resolveMaSv();
  },

  getStudentDashboard: async (id: string): Promise<StudentDashboardResponse> => {
    const response = await api.get<StudentDashboardResponse>(`/dashboard/student/${id}`);
    return response.data;
  },

  getStatsCards: async (): Promise<StatsCardViewModel[]> => {
    const { me, registrations, monHocList } = await fetchStudentContext();
    const active = registrations.filter((dk) => dk.trangThaiDK === 1);
    const registeredCredits = sumCredits(registrations, monHocList, true);
    const accumulatedCredits = sumCredits(registrations, monHocList, false);
    const tuitionDue = active.reduce((sum, dk) => sum + dk.hocPhiTamTinh, 0);
    const remainingCredits = Math.max(CREDIT_GOAL - accumulatedCredits, 0);
    const hocKyLabel =
      active.length > 0 ? "Theo đăng ký hiện tại" : "Chưa có môn đăng ký";

    return [
      {
        label: "Tín chỉ đã đăng ký",
        value: String(registeredCredits),
        subtext: hocKyLabel,
      },
      {
        label: "GPA hiện tại",
        value: "—",
        subtext: "Chưa có API điểm trên hệ thống",
      },
      {
        label: "Học phí còn nợ",
        value: me.trangThaiHocPhi ? formatCurrency(tuitionDue) : "0đ",
        subtext: me.trangThaiHocPhi
          ? "Tài khoản đang bị khóa học phí"
          : "Đã thanh toán đủ",
      },
      {
        label: "Tín chỉ tích lũy",
        value: String(accumulatedCredits),
        subtext:
          remainingCredits > 0
            ? `Còn ${remainingCredits} tín chỉ`
            : "Đã đủ chương trình",
      },
    ];
  },

  getGpaChart: async (): Promise<GpaChartViewModel | null> => {
    const { registrations, monHocList } = await fetchStudentContext();
    const accumulatedCredits = sumCredits(registrations, monHocList, false);

    if (accumulatedCredits === 0) {
      return null;
    }

    const progressPercent = Math.min(
      Math.round((accumulatedCredits / CREDIT_GOAL) * 100),
      100
    );

    return {
      history: [],
      progressPercent,
      completedCredits: accumulatedCredits,
      totalCredits: CREDIT_GOAL,
    };
  },

  getWeeklySchedule: async (): Promise<ScheduleItemViewModel[]> => {
    return [];
  },

  getNotifications: async (): Promise<DashboardNotificationViewModel[]> => {
    const { me, registrations } = await fetchStudentContext();
    const notifications: DashboardNotificationViewModel[] = [];

    if (me.trangThaiHocPhi) {
      notifications.push({
        title: "Nhắc nhở nộp học phí",
        time: "Hôm nay",
        type: "warning",
        dotColor: "bg-amber-500",
      });
    } else {
      notifications.push({
        title: "Học phí đã được xác nhận",
        time: "Gần đây",
        type: "success",
        dotColor: "bg-green-500",
      });
    }

    const recentActive = registrations
      .filter((dk) => dk.trangThaiDK === 1)
      .sort(
        (a, b) =>
          new Date(b.thoiGianDK).getTime() - new Date(a.thoiGianDK).getTime()
      )
      .slice(0, 5);

    for (const dk of recentActive) {
      notifications.push({
        title: `Đăng ký lớp học phần ${dk.maLHP}`,
        time: formatRelativeTime(dk.thoiGianDK),
        type: "info",
        dotColor: "bg-blue-500",
      });
    }

    return notifications;
  },

  /** @deprecated Dùng getNotifications — giữ alias cho tương thích */
  getRecentRegistrations: async (
    limit: number = 5
  ): Promise<DangKyMonHocResponse[]> => {
    const maSv = await resolveMaSv();
    const response = await api.get<DangKyMonHocResponse[]>(
      `/dangky/sinhvien/${maSv}`
    );
    return response.data
      .filter((dk) => dk.trangThaiDK === 1)
      .sort(
        (a, b) =>
          new Date(b.thoiGianDK).getTime() - new Date(a.thoiGianDK).getTime()
      )
      .slice(0, limit);
  },
};

export default DashboardService;
