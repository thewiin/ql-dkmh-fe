export interface SinhVien {
  maSinhVien: string;
  hoTen: string;
  ngaySinh: Date;
  gioiTinh: boolean;
  diaChi: string;
  email: string;
  soDienThoai: string;
  maLop: string; // Assuming a class ID
}

export interface MonHoc {
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
}

export interface LopHocPhan {
  maLopHocPhan: string;
  maMonHoc: string;
  namHoc: string;
  hocKy: number;
  soLuongToiDa: number;
  soLuongHienTai: number;
  trangThai: string; // e.g., "Open", "Closed"
}

export interface ChiTietLichHoc {
  maChiTietLichHoc: string;
  maLopHocPhan: string;
  phongHoc: string;
  thoiGianBatDau: Date;
  thoiGianKetThuc: Date;
  thuTrongTuan: number; // 2 for Monday, 3 for Tuesday, etc.
}

export interface DangKy {
  maDangKy: string;
  maSinhVien: string;
  maLopHocPhan: string;
  ngayDangKy: Date;
  trangThai: string; // e.g., "Registered", "Cancelled"
}

export interface PhieuThu {
  maPhieuThu: string;
  maSinhVien: string;
  maLopHocPhan?: string; // Optional if payment is not tied to a specific class
  soTien: number;
  ngayThu: Date;
  noiDung: string;
}

export interface Diem {
  maDiem: string;
  maSinhVien: string;
  maLopHocPhan: string;
  diemChuyenCan?: number;
  diemGiuaKy?: number;
  diemCuoiKy?: number;
  diemTongKet?: number;
  trangThai?: string; // e.g., "Passed", "Failed"
}

export interface LoginRequest {
  tenDangNhap: string;
  matKhau: string;
}

export interface LoginResponse {
  token: string;
  vaiTro: string; // e.g., "Admin", "SinhVien"
  maSinhVien?: string;
  tenNguoiDung: string;
}

export interface UserProfile {
  maSinhVien?: string;
  hoTen: string;
  email: string;
  vaiTro: string;
}

export interface DashboardStats {
  tongSinhVien: number;
  tongLopHocPhan: number;
  tongMonHoc: number;
  tongDangKy: number;
  tongDoanhThu: number;
  tiLeDangKyTheoLop: {
    maLopHocPhan: string;
    tiLe: number;
    soLuongHienTai: number;
    soLuongToiDa: number;
  }[];
}
