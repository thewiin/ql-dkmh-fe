import api from "../lib/api";
import { DashboardStats, DangKy, PhieuThu } from "../types";

const DashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>("/dashboard/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRecentRegistrations: async (limit: number = 5): Promise<DangKy[]> => {
    try {
      const response = await api.get<DangKy[]>("/dashboard/recent-registrations", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRecentPhieuThu: async (limit: number = 5): Promise<PhieuThu[]> => {
    try {
      const response = await api.get<PhieuThu[]>("/dashboard/recent-receipts", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default DashboardService;
