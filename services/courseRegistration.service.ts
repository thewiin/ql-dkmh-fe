import api from "../lib/api";
import LopHocPhanService from "./lopHocPhan.service";
import {
  CourseRegistrationItem,
  LopHocPhanApi,
  MonHocApi,
} from "../types";

function findMonHoc(
  maMH: string,
  monHocList: MonHocApi[]
): MonHocApi | undefined {
  return monHocList.find((mh) => mh.maMH === maMH);
}

function mapLopHocPhanToCourse(
  lhp: LopHocPhanApi,
  monHocList: MonHocApi[]
): CourseRegistrationItem {
  const mon = findMonHoc(lhp.maMH, monHocList);
  const remainingSeats = Math.max(lhp.siSoToiDa - lhp.siSoHienTai, 0);

  return {
    id: lhp.maLHP,
    code: lhp.maMH,
    name: mon?.tenMH ?? lhp.maMH,
    instructor: "—",
    credits: mon?.soTinChi ?? 0,
    totalSeats: lhp.siSoToiDa,
    remainingSeats,
    schedule: lhp.thu
      ? [
          {
            day: lhp.thu,
            startTime: "—",
            endTime: "—",
            room: "—",
          },
        ]
      : [],
    department: mon?.khoa ?? "",
  };
}

function parseSemesterFilter(value: string): {
  namHoc?: string;
  hocKy?: number;
} {
  const [year, hocKyRaw] = value.split("-");
  if (!year || !hocKyRaw) return {};
  const hocKy = Number(hocKyRaw);
  return Number.isNaN(hocKy) ? {} : { namHoc: year, hocKy };
}

function matchesSemester(
  lhp: LopHocPhanApi,
  namHoc?: string,
  hocKy?: number
): boolean {
  if (hocKy !== undefined && lhp.hocKy !== hocKy) return false;
  if (namHoc !== undefined && !lhp.namHoc.includes(namHoc)) return false;
  return true;
}

const CourseRegistrationService = {
  getOpenCourses: async (
    semester?: string
  ): Promise<CourseRegistrationItem[]> => {
    const { namHoc, hocKy } = semester ? parseSemesterFilter(semester) : {};

    const [lhpList, monHocRes] = await Promise.all([
      LopHocPhanService.getAllLopHocPhan(),
      api.get<MonHocApi[]>("/monhoc"),
    ]);

    const monHocList = monHocRes.data;
    const filtered = lhpList.filter((lhp) =>
      matchesSemester(lhp, namHoc, hocKy)
    );

    return filtered.map((lhp) => mapLopHocPhanToCourse(lhp, monHocList));
  },
};

export default CourseRegistrationService;
