import api from "../lib/api";
import { ChiTietLichHoc, LopHocPhan, LopHocPhanApi, CanMergeLopHocPhanResponse, MergeLopHocPhanRequest, MergeLopHocPhanResponse } from "../types";

const LopHocPhanService = {
  getAllLopHocPhan: async (): Promise<LopHocPhanApi[]> => {
    try {
      const response = await api.get<LopHocPhanApi[]>("/lophocphan");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLopHocPhanById: async (id: string): Promise<LopHocPhanApi> => {
    try {
      const response = await api.get<LopHocPhanApi>(`/lophocphan/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createLopHocPhan: async (
    lopHocPhanData: Omit<LopHocPhan, "maLopHocPhan" | "soLuongHienTai">
  ): Promise<LopHocPhanApi> => {
    try {
      const response = await api.post<LopHocPhanApi>("/lophocphan", lopHocPhanData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateLopHocPhan: async (
    id: string,
    lopHocPhanData: Partial<LopHocPhan>
  ): Promise<LopHocPhanApi> => {
    try {
      const response = await api.put<LopHocPhanApi>(`/lophocphan/${id}`, lopHocPhanData);
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

  getLopHocPhanByMonHoc: async (maMonHoc: string): Promise<LopHocPhanApi[]> => {
    try {
      const response = await api.get<LopHocPhanApi[]>(`/lophocphan/monhoc/${maMonHoc}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLopHocPhanAvailable: async (
    namHoc?: string,
    hocKy?: number
  ): Promise<LopHocPhanApi[]> => {
    try {
      const response = await api.get<LopHocPhanApi[]>("/lophocphan/available", {
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

  getCanMergeLopHocPhan: async (
    maLopHocPhanTarget: string
  ): Promise<CanMergeLopHocPhanResponse[]> => {
    try {
      const response = await api.get<CanMergeLopHocPhanResponse[]>(
        `/lophocphan/can-merge`,
        {
          params: { maLopHocPhanTarget },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  mergeLopHocPhan: async (
    mergeRequest: MergeLopHocPhanRequest
  ): Promise<MergeLopHocPhanResponse> => {
    try {
      const response = await api.post<MergeLopHocPhanResponse>(
        `/lophocphan/merge`,
        mergeRequest
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default LopHocPhanService;
