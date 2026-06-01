import api from "../lib/api";
import { SinhVien, Diem, DangKy, PhieuThu } from "../types";

const SinhVienService = {
  getAllSinhVien: async (): Promise<SinhVien[]> => {
    try {
      const response = await api.get<SinhVien[]>("/sinhvien");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSinhVienById: async (id: string): Promise<SinhVien> => {
    try {
      const response = await api.get<SinhVien>(`/sinhvien/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSinhVien: async (sinhVienData: Omit<SinhVien, "maSinhVien">): Promise<SinhVien> => {
    try {
      const response = await api.post<SinhVien>("/sinhvien", sinhVienData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSinhVien: async (id: string, sinhVienData: Partial<SinhVien>): Promise<SinhVien> => {
    try {
      const response = await api.put<SinhVien>(`/sinhvien/${id}`, sinhVienData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSinhVien: async (id: string): Promise<void> => {
    try {
      await api.delete(`/sinhvien/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getDiemBySinhVien: async (id: string): Promise<Diem[]> => {
    try {
      const response = await api.get<Diem[]>(`/sinhvien/${id}/diem`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDangKyBySinhVien: async (id: string): Promise<DangKy[]> => {
    try {
      const response = await api.get<DangKy[]>(`/sinhvien/${id}/dangky`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPhieuThuBySinhVien: async (id: string): Promise<PhieuThu[]> => {
    try {
      const response = await api.get<PhieuThu[]>(`/sinhvien/${id}/phieuthu`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default SinhVienService;
