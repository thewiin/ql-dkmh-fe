import api from "../lib/api";
import { DangKy } from "../types";

const DangKyService = {
  getAllDangKy: async (): Promise<DangKy[]> => {
    try {
      const response = await api.get<DangKy[]>("/dangky");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDangKyById: async (id: string): Promise<DangKy> => {
    try {
      const response = await api.get<DangKy>(`/dangky/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDangKy: async (dangKyData: Omit<DangKy, "maDangKy" | "ngayDangKy" | "trangThai">): Promise<DangKy> => {
    try {
      const response = await api.post<DangKy>("/dangky", dangKyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDangKy: async (id: string, dangKyData: Partial<DangKy>): Promise<DangKy> => {
    try {
      const response = await api.put<DangKy>(`/dangky/${id}`, dangKyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDangKy: async (id: string): Promise<void> => {
    try {
      await api.delete(`/dangky/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getDangKyBySinhVien: async (maSinhVien: string): Promise<DangKy[]> => {
    try {
      const response = await api.get<DangKy[]>(`/dangky/sinhvien/${maSinhVien}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default DangKyService;
