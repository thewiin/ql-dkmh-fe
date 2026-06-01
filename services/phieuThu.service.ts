import api from "../lib/api";
import { PhieuThu } from "../types";

const PhieuThuService = {
  getAllPhieuThu: async (): Promise<PhieuThu[]> => {
    try {
      const response = await api.get<PhieuThu[]>("/phieuthu");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPhieuThuById: async (id: string): Promise<PhieuThu> => {
    try {
      const response = await api.get<PhieuThu>(`/phieuthu/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPhieuThu: async (phieuThuData: Omit<PhieuThu, "maPhieuThu" | "ngayThu">): Promise<PhieuThu> => {
    try {
      const response = await api.post<PhieuThu>("/phieuthu", phieuThuData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePhieuThu: async (id: string, phieuThuData: Partial<PhieuThu>): Promise<PhieuThu> => {
    try {
      const response = await api.put<PhieuThu>(`/phieuthu/${id}`, phieuThuData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePhieuThu: async (id: string): Promise<void> => {
    try {
      await api.delete(`/phieuthu/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getPhieuThuBySinhVien: async (maSinhVien: string): Promise<PhieuThu[]> => {
    try {
      const response = await api.get<PhieuThu[]>(`/phieuthu/sinhvien/${maSinhVien}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default PhieuThuService;
