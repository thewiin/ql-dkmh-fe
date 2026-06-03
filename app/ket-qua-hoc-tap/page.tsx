"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BookOpen,
  GraduationCap,
  Download,
  FileText,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

import AuthService from "@/services/auth.service"
import KetQuaHocTapService from "@/services/ketQuaHocTap.service"

// GPA data by semester
const gpaHistory = [
  { semester: "HK1 2021", gpa: 3.2, credits: 18 },
  { semester: "HK2 2021", gpa: 3.4, credits: 19 },
  { semester: "HK1 2022", gpa: 3.5, credits: 18 },
  { semester: "HK2 2022", gpa: 3.65, credits: 20 },
  { semester: "HK1 2023", gpa: 3.8, credits: 18 },
  { semester: "HK2 2023", gpa: 3.85, credits: 15 },
]

// Grade distribution data
const gradeDistribution = [
  { grade: "A", count: 12, color: "#22c55e" },
  { grade: "B+", count: 8, color: "#3b82f6" },
  { grade: "B", count: 6, color: "#6366f1" },
  { grade: "C+", count: 4, color: "#f59e0b" },
  { grade: "C", count: 2, color: "#ef4444" },
]

// Skills radar data
const skillsData = [
  { skill: "Lập trình", value: 85, fullMark: 100 },
  { skill: "Toán học", value: 78, fullMark: 100 },
  { skill: "Cơ sở dữ liệu", value: 90, fullMark: 100 },
  { skill: "Mạng MT", value: 72, fullMark: 100 },
  { skill: "AI/ML", value: 80, fullMark: 100 },
  { skill: "Web Dev", value: 88, fullMark: 100 },
]

// Initial course results data removed, will be fetched from API
interface CourseResult {
  id: string;
  name: string;
  credits: number;
  midterm: number | null;
  final: number | null;
  average: number | null;
  letterGrade: string | null;
  status: string;
  semester: string;
}

// Semesters for filter
const semesters = [
  { value: "all", label: "Tất cả học kỳ" },
  { value: "HK1 2024", label: "Học kỳ 1 - 2024" },
  { value: "HK2 2023", label: "Học kỳ 2 - 2023" },
  { value: "HK1 2023", label: "Học kỳ 1 - 2023" },
  { value: "HK2 2022", label: "Học kỳ 2 - 2022" },
  { value: "HK1 2022", label: "Học kỳ 1 - 2022" },
  { value: "HK2 2021", label: "Học kỳ 2 - 2021" },
  { value: "HK1 2021", label: "Học kỳ 1 - 2021" },
]

// Credits by category
const creditsByCategory = [
  { category: "Đại cương", completed: 30, required: 30 },
  { category: "Cơ sở ngành", completed: 24, required: 24 },
  { category: "Chuyên ngành", completed: 36, required: 45 },
  { category: "Tự chọn", completed: 12, required: 15 },
  { category: "Thực tập/Đồ án", completed: 6, required: 12 },
]

export default function AcademicResultsPage() {
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [courseResults, setCourseResults] = useState<CourseResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const profile = await AuthService.getProfile()
        if (profile.maSinhVien) {
          const results = await KetQuaHocTapService.getKetQuaHocTap(profile.maSinhVien)
          const mappedResults = results.map(item => {
            let letterGrade = null;
            if (item.diem !== null) {
              if (item.diem >= 8.5) letterGrade = "A";
              else if (item.diem >= 8.0) letterGrade = "B+";
              else if (item.diem >= 7.0) letterGrade = "B";
              else if (item.diem >= 6.5) letterGrade = "C+";
              else if (item.diem >= 5.5) letterGrade = "C";
              else if (item.diem >= 5.0) letterGrade = "D+";
              else if (item.diem >= 4.0) letterGrade = "D";
              else letterGrade = "F";
            }
            
            let status = "in_progress";
            if (item.trangThai === "QuaMon") status = "passed";
            if (item.trangThai === "RotMon") status = "failed";
            
            return {
              id: item.maMH,
              name: item.tenMH,
              credits: 3, // Default since API doesn't provide
              midterm: item.diem,
              final: item.diem,
              average: item.diem,
              letterGrade,
              status,
              semester: "HK2 2024", // Default since API doesn't provide
            };
          });
          setCourseResults(mappedResults)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredCourses =
    selectedSemester === "all"
      ? courseResults
      : courseResults.filter((c) => c.semester === selectedSemester)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Đạt
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Không đạt
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <Clock className="mr-1 h-3 w-3" />
            Đang học
          </Badge>
        )
      default:
        return null
    }
  }

  const getGradeBadge = (grade: string | null) => {
    if (!grade) return <span className="text-muted-foreground">--</span>
    const colors: Record<string, string> = {
      A: "bg-emerald-100 text-emerald-700",
      "B+": "bg-blue-100 text-blue-700",
      B: "bg-indigo-100 text-indigo-700",
      "C+": "bg-amber-100 text-amber-700",
      C: "bg-orange-100 text-orange-700",
      D: "bg-red-100 text-red-700",
      F: "bg-red-200 text-red-800",
    }
    return (
      <Badge className={`${colors[grade] || "bg-muted"} hover:${colors[grade]}`}>
        {grade}
      </Badge>
    )
  }

  const totalCreditsCompleted = courseResults
    .filter((c) => c.status === "passed")
    .reduce((sum, c) => sum + c.credits, 0)

  const totalCreditsRequired = 126

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCreditsForGPA = 0;
    
    courseResults.forEach(c => {
      if (c.status === "passed" || c.status === "failed") {
        let point = 0;
        if (c.letterGrade === "A") point = 4.0;
        else if (c.letterGrade === "B+") point = 3.5;
        else if (c.letterGrade === "B") point = 3.0;
        else if (c.letterGrade === "C+") point = 2.5;
        else if (c.letterGrade === "C") point = 2.0;
        else if (c.letterGrade === "D+") point = 1.5;
        else if (c.letterGrade === "D") point = 1.0;
        else point = 0;
        
        totalPoints += point * c.credits;
        totalCreditsForGPA += c.credits;
      }
    });
    
    return totalCreditsForGPA === 0 ? "0.00" : (totalPoints / totalCreditsForGPA).toFixed(2);
  };
  
  const currentGPA = calculateGPA();

  const dynamicGradeDistribution = [
    { grade: "A", count: courseResults.filter(c => c.letterGrade === "A").length, color: "#22c55e" },
    { grade: "B+", count: courseResults.filter(c => c.letterGrade === "B+").length, color: "#3b82f6" },
    { grade: "B", count: courseResults.filter(c => c.letterGrade === "B").length, color: "#6366f1" },
    { grade: "C+", count: courseResults.filter(c => c.letterGrade === "C+").length, color: "#f59e0b" },
    { grade: "C", count: courseResults.filter(c => c.letterGrade === "C").length, color: "#ef4444" },
    { grade: "F", count: courseResults.filter(c => c.letterGrade === "F").length, color: "#b91c1c" },
  ].filter(g => g.count > 0);

  const displayGradeDistribution = dynamicGradeDistribution.length > 0 ? dynamicGradeDistribution : gradeDistribution;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activePage="ket-qua" />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">Đang tải dữ liệu kết quả học tập...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activePage="ket-qua" />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <Card className="border-0 shadow-sm max-w-md">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Lỗi</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Thử lại</Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="student">
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="ket-qua" />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Kết quả học tập
              </h1>
              <p className="text-muted-foreground">
                Theo dõi điểm số và tiến độ học tập của bạn
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Xem bảng điểm
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4" />
                Tải bảng điểm
              </Button>
            </div>
          </div>

          {/* GPA Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Cumulative GPA */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      GPA tích lũy
                    </p>
                    <p className="text-3xl font-bold text-foreground">{currentGPA}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">
                        +0.05 so với HK trước
                      </span>
                    </div>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Award className="h-7 w-7 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credits Completed */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Tín chỉ tích lũy
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {totalCreditsCompleted}
                      <span className="text-lg text-muted-foreground font-normal">
                        /{totalCreditsRequired}
                      </span>
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Còn {totalCreditsRequired - totalCreditsCompleted} tín
                        chỉ
                      </span>
                    </div>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Semester GPA */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      GPA học kỳ này
                    </p>
                    <p className="text-3xl font-bold text-foreground">{currentGPA}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-amber-600" />
                      <span className="text-xs text-amber-600">
                        Đang cập nhật
                      </span>
                    </div>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Ranking */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Xếp loại học lực
                    </p>
                    <p className="text-3xl font-bold text-foreground">Giỏi</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs text-muted-foreground">
                        Top 15% khóa
                      </span>
                    </div>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* GPA Progress Chart */}
            <Card className="border-0 shadow-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Biểu đồ GPA theo học kỳ
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Theo dõi sự tiến bộ qua từng học kỳ
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Xu hướng tăng
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gpaHistory}>
                      <defs>
                        <linearGradient
                          id="gpaGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="semester"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 4]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [
                          value.toFixed(2),
                          "GPA",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="gpa"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#gpaGradient)"
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution Pie Chart */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Phân bổ điểm số</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tổng hợp điểm chữ các môn
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayGradeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="count"
                        label={({ grade, count }) => `${grade}: ${count}`}
                        labelLine={false}
                      >
                        {displayGradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => {
                          const item = displayGradeDistribution.find(
                            (g) => g.count === entry.payload?.value
                          )
                          return item?.grade || value
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Credits Progress by Category */}
            <Card className="border-0 shadow-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Tiến độ tín chỉ theo loại
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Hoàn thành{" "}
                  {Math.round(
                    (totalCreditsCompleted / totalCreditsRequired) * 100
                  )}
                  % chương trình đào tạo
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creditsByCategory} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        dataKey="category"
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="completed"
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                        name="Đã hoàn thành"
                      />
                      <Bar
                        dataKey="required"
                        fill="hsl(var(--muted))"
                        radius={[0, 4, 4, 0]}
                        name="Yêu cầu"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Skills Radar */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Năng lực chuyên môn</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Đánh giá theo lĩnh vực
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillsData}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fontSize: 10 }}
                      />
                      <Radar
                        name="Điểm"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transcript Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Bảng điểm chi tiết</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Kết quả học tập theo từng môn học
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Chọn học kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem.value} value={sem.value}>
                          {sem.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Mã môn</TableHead>
                      <TableHead className="font-semibold">Tên môn học</TableHead>
                      <TableHead className="font-semibold text-center">
                        Tín chỉ
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Giữa kỳ
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Cuối kỳ
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Trung bình
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Điểm chữ
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold">Học kỳ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow
                        key={course.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium text-primary">
                          {course.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {course.name}
                            {course.status === "in_progress" && (
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {course.credits}
                        </TableCell>
                        <TableCell className="text-center">
                          {course.midterm !== null ? (
                            <span
                              className={
                                course.midterm >= 8
                                  ? "text-emerald-600 font-medium"
                                  : course.midterm >= 6.5
                                    ? "text-foreground"
                                    : "text-red-600"
                              }
                            >
                              {course.midterm.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {course.final !== null ? (
                            <span
                              className={
                                course.final >= 8
                                  ? "text-emerald-600 font-medium"
                                  : course.final >= 6.5
                                    ? "text-foreground"
                                    : "text-red-600"
                              }
                            >
                              {course.final.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {course.average !== null ? (
                            <span className="font-semibold">
                              {course.average.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {getGradeBadge(course.letterGrade)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(course.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {course.semester}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Footer */}
              <div className="mt-4 flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-muted-foreground">
                      Đạt:{" "}
                      {courseResults.filter((c) => c.status === "passed").length}{" "}
                      môn
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-muted-foreground">
                      Đang học:{" "}
                      {
                        courseResults.filter((c) => c.status === "in_progress")
                          .length
                      }{" "}
                      môn
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm text-muted-foreground">
                      Không đạt:{" "}
                      {courseResults.filter((c) => c.status === "failed").length}{" "}
                      môn
                    </span>
                  </div>
                </div>
                <Button variant="ghost" className="gap-1 text-primary">
                  Xem tất cả
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
