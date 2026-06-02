import api from "../lib/api";
import {
  PaymentHistoryItem,
  SinhVienMe,
  TuitionStatusViewModel,
  TuitionSummaryViewModel,
} from "../types";

const PaymentService = {
  getTuitionStatus: async (): Promise<TuitionStatusViewModel> => {
    const response = await api.get<SinhVienMe>("/auth/me");

    if (response.data.trangThaiHocPhi) {
      return {
        status: "locked",
        isBlocked: true,
        message:
          "Tài khoản đang bị khóa do chưa thanh toán học phí. Vui lòng nộp học phí trước khi đăng ký môn.",
      };
    }

    return {
      status: "paid",
      isBlocked: false,
      message: "",
    };
  },

  getTuitionSummary: async (): Promise<TuitionSummaryViewModel> => {
    try {
      const response = await api.get<TuitionSummaryViewModel>("/hocphi/summary");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTuitionHistory: async (maSinhVien: string): Promise<PaymentHistoryItem[]> => {
    try {
      const response = await api.get<PaymentHistoryItem[]>(`/hocphi/history/${maSinhVien}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default PaymentService;
