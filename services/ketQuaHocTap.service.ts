import api from "../lib/axios";

export interface KetQuaHocTapDTO {
  maSV: string;
  ho: string;
  ten: string;
  maMH: string;
  tenMH: string;
  diem: number | null;
  trangThai: string;
}

const KetQuaHocTapService = {
  getKetQuaHocTap: async (studentId: string): Promise<KetQuaHocTapDTO[]> => {
    try {
      const response = await api.get<KetQuaHocTapDTO[]>(`/ketquahoctap/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default KetQuaHocTapService;
