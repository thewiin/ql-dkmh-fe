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

/** DTO khớp ASP.NET Core — GET /auth/me */
export interface SinhVienMe {
  maSv: string;
  ho: string;
  ten: string;
  ngaySinh: string;
  khoa: string;
  trangThaiHocPhi: boolean;
}

/** DTO khớp ASP.NET Core — GET /dangky/sinhvien/{maSv} */
export interface DangKyMonHocResponse {
  maDK: number;
  maSV: string;
  maLHP: string;
  thoiGianDK: string;
  hocPhiTamTinh: number;
  trangThaiDK: number;
}

/** DTO khớp ASP.NET Core — GET /monhoc */
export interface MonHocApi {
  maMH: string;
  tenMH: string;
  soTinChi: number;
  khoa: string;
}

/** DTO khớp ASP.NET Core — GET /lophocphan */
export interface LopHocPhanApi {
  maLHP: string;
  maMH: string;
  hocKy: number;
  namHoc: string;
  siSoToiDa: number;
  siSoHienTai: number;
  trangThai: string;
  soTiet?: number | null;
  thu?: number | null;
}

export interface CourseScheduleSlot {
  day: number;
  startTime: string;
  endTime: string;
  room: string;
}

/** View model cho bảng đăng ký môn học */
export interface CourseRegistrationItem {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  totalSeats: number;
  remainingSeats: number;
  schedule: CourseScheduleSlot[];
  department: string;
  prerequisite?: string;
}

export interface RegisteredCourseItem extends CourseRegistrationItem {
  registeredAt: Date;
  registrationId?: string;
}

export type TuitionStatus = "paid" | "unpaid" | "locked";

export interface TuitionStatusViewModel {
  status: TuitionStatus;
  isBlocked: boolean;
  message: string;
}

export interface TuitionValidationResult {
  canRegister: boolean;
  status: TuitionStatus;
  message: string;
}

export interface StatsCardViewModel {
  label: string;
  value: string;
  subtext: string;
}

export interface GpaChartPoint {
  semester: string;
  gpa: number;
}

export interface GpaChartViewModel {
  history: GpaChartPoint[];
  progressPercent: number;
  completedCredits: number;
  totalCredits: number;
}

export interface ScheduleItemViewModel {
  subject: string;
  day: string;
  time: string;
  room: string;
  dayColor: string;
}

export interface DashboardNotificationViewModel {
  title: string;
  time: string;
  type: "info" | "warning" | "success";
  dotColor: string;
}

export interface TuitionSummaryViewModel {
  totalTuition: number;
  paidAmount: number;
  remainingBalance: number;
  dueDate: string;
  semester: string;
  status: "paid" | "partial" | "unpaid" | "overdue";
  courseTuition: TuitionCourseItem[];
  otherFees: TuitionFeeItem[];
}

export interface TuitionCourseItem {
  id: number;
  code: string;
  name: string;
  credits: number;
  pricePerCredit: number;
  total: number;
  status: string;
}

export interface TuitionFeeItem {
  id: number;
  name: string;
  amount: number;
  status: string;
}

export interface PaymentHistoryItem {
  id: number;
  date: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
}

export interface InvoiceItem {
  id: number;
  number: string;
  date: string;
  amount: number;
  semester: string;
  status: string;
}

/** DTO khớp ASP.NET Core — GET /api/lophocphan/can-merge */
export interface CanMergeLopHocPhanResponse extends LopHocPhanApi {}

/** DTO khớp ASP.NET Core — POST /api/lophocphan/merge */
export interface MergeLopHocPhanRequest {
  maLopHocPhanToMerge: string[];
  maLopHocPhanTarget: string; // The class into which others will be merged
}

export interface MergeLopHocPhanResponse {
  message: string;
  mergedLopHocPhanId?: string; // Optional: ID of the resulting merged class
}
