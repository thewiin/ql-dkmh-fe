import api from "../lib/api";
import { LopHocPhan, ChiTietLichHoc } from "../types";

const LopHocPhanService = {
  getAllLopHocPhan: async (): Promise<LopHocPhan[]> => {
    try {
      const response = await api.get<LopHocPhan[]>("/lophocphan");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLopHocPhanById: async (id: string): Promise<LopHocPhan> => {
    try {
      const response = await api.get<LopHocPhan>(`/lophocphan/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createLopHocPhan: async (lopHocPhanData: Omit<LopHocPhan, "maLopHocPhan" | "soLuongHienTai">): Promise<LopHocPhan> => {
    try {
      const response = await api.post<LopHocPhan>("/lophocphan", lopHocPhanData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateLopHocPhan: async (id: string, lopHocPhanData: Partial<LopHocPhan>): Promise<LopHocPhan> => {
    try {
      const response = await api.put<LopHocPhan>(`/lophocphan/${id}`, lopHocPhanData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteLopHocPhan: async (id: string): Promise<void> => {
    try {
      await api.delete(`/lophocphan/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getLopHocPhanByMonHoc: async (maMonHoc: string): Promise<LopHocPhan[]> => {
    try {
      const response = await api.get<LopHocPhan[]>(`/lophocphan/monhoc/${maMonHoc}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLopHocPhanAvailable: async (namHoc?: string, hocKy?: number): Promise<LopHocPhan[]> => {
    try {
      const response = await api.get<LopHocPhan[]>("/lophocphan/available", {
        params: { namHoc, hocKy },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getChiTietLichHoc: async (id: string): Promise<ChiTietLichHoc[]> => {
    try {
      const response = await api.get<ChiTietLichHoc[]>(`/lophocphan/${id}/lichhoc`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default LopHocPhanService;
