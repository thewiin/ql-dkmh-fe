import api from "../lib/api";
import { SinhVienMe, TuitionStatusViewModel } from "../types";

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
};

export default PaymentService;
