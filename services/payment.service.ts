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

  getTuitionSummary: async (maSinhVien?: string): Promise<TuitionSummaryViewModel> => {
    try {
      if (!maSinhVien) throw new Error("Mã sinh viên is required");
      const response = await api.get<any[]>(`/phieuthu/${maSinhVien}`);
      const phieuThus = response.data || [];
      
      let totalTuition = 0;
      let paidAmount = 0;

      phieuThus.forEach(pt => {
        totalTuition += pt.tongTien || 0;
        if (pt.trangThaiThanhToan === 1) {
          paidAmount += pt.tongTien || 0;
        }
      });

      const remainingBalance = totalTuition - paidAmount;
      let status: "paid" | "partial" | "unpaid" | "overdue" = "unpaid";
      if (totalTuition > 0) {
        if (paidAmount === totalTuition) status = "paid";
        else if (paidAmount > 0) status = "partial";
      } else {
        status = "paid";
      }

      // Keep mock breakdown for UI
      const courseTuition = [
        { id: 1, code: "CS101", name: "Cơ sở dữ liệu", credits: 3, pricePerCredit: 450000, total: 1350000, status: "paid" },
        { id: 2, code: "CS102", name: "Lập trình web", credits: 3, pricePerCredit: 450000, total: 1350000, status: "paid" }
      ];
      
      const otherFees = [
        { id: 1, name: "Bảo hiểm y tế", amount: 750000, status: "paid" },
        { id: 2, name: "Phí thư viện", amount: 150000, status: "paid" }
      ];

      return {
        totalTuition: totalTuition > 0 ? totalTuition : 4050000, // mock fallback if no bills
        paidAmount: totalTuition > 0 ? paidAmount : 4050000,
        remainingBalance: totalTuition > 0 ? remainingBalance : 0,
        dueDate: "30/06/2024",
        semester: "Học kỳ 2 - 2023-2024",
        status: totalTuition > 0 ? status : "paid",
        courseTuition,
        otherFees,
      };
    } catch (error) {
      throw error;
    }
  },

  getTuitionHistory: async (maSinhVien: string): Promise<PaymentHistoryItem[]> => {
    try {
      const response = await api.get<any[]>(`/phieuthu/${maSinhVien}`);
      const phieuThus = response.data || [];
      
      return phieuThus
        .filter(pt => pt.trangThaiThanhToan === 1)
        .map((pt) => ({
          id: pt.maPhieuThu,
          date: new Date(pt.ngayLap).toLocaleDateString('vi-VN'),
          amount: pt.tongTien,
          method: "Chuyển khoản",
          status: "success",
          reference: `PT-${pt.maPhieuThu.toString().padStart(6, '0')}`
        }));
    } catch (error) {
      throw error;
    }
  },
};

export default PaymentService;
