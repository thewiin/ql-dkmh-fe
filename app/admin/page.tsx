"use client"

import { useEffect, useState } from "react"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserPlus,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Bell,
  Settings,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  LineChart,
  Line,
} from "recharts"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import DashboardService from "@/services/dashboard.service"

// Stats data
const statsCards = [
  {
    title: "Tổng sinh viên",
    value: "12,458",
    change: "+256",
    changePercent: "+2.1%",
    trend: "up",
    icon: Users,
    color: "bg-blue-500",
    description: "Học kỳ này",
  },
  {
    title: "Lớp học phần mở",
    value: "486",
    change: "+32",
    changePercent: "+7.0%",
    trend: "up",
    icon: BookOpen,
    color: "bg-emerald-500",
    description: "Đang hoạt động",
  },
  {
    title: "Doanh thu học phí",
    value: "45.2 tỷ",
    change: "+3.8 tỷ",
    changePercent: "+9.2%",
    trend: "up",
    icon: DollarSign,
    color: "bg-amber-500",
    description: "Tổng thu học kỳ",
  },
  {
    title: "Đăng ký môn học",
    value: "38,942",
    change: "-1,245",
    changePercent: "-3.1%",
    trend: "down",
    icon: GraduationCap,
    color: "bg-violet-500",
    description: "Lượt đăng ký",
  },
]

// Registration trend data
const registrationTrendData = [
  { date: "01/01", registrations: 1200, cancellations: 45 },
  { date: "02/01", registrations: 2100, cancellations: 78 },
  { date: "03/01", registrations: 3400, cancellations: 120 },
  { date: "04/01", registrations: 5200, cancellations: 180 },
  { date: "05/01", registrations: 7800, cancellations: 210 },
  { date: "06/01", registrations: 9500, cancellations: 245 },
  { date: "07/01", registrations: 11200, cancellations: 280 },
  { date: "08/01", registrations: 15600, cancellations: 320 },
  { date: "09/01", registrations: 22400, cancellations: 380 },
  { date: "10/01", registrations: 28900, cancellations: 420 },
  { date: "11/01", registrations: 34200, cancellations: 450 },
  { date: "12/01", registrations: 38942, cancellations: 486 },
]

// Revenue data
const revenueData = [
  { month: "T1", revenue: 8.2, target: 7.5 },
  { month: "T2", revenue: 6.5, target: 7.0 },
  { month: "T3", revenue: 4.2, target: 5.0 },
  { month: "T4", revenue: 3.8, target: 4.0 },
  { month: "T5", revenue: 2.1, target: 2.5 },
  { month: "T6", revenue: 1.5, target: 2.0 },
  { month: "T7", revenue: 3.2, target: 3.0 },
  { month: "T8", revenue: 5.8, target: 5.5 },
  { month: "T9", revenue: 7.4, target: 7.0 },
  { month: "T10", revenue: 2.5, target: 3.0 },
]

// Department distribution
const departmentData = [
  { name: "CNTT", students: 3245, color: "#3b82f6" },
  { name: "Kinh tế", students: 2890, color: "#10b981" },
  { name: "Ngoại ngữ", students: 1856, color: "#f59e0b" },
  { name: "Điện - ĐT", students: 1645, color: "#8b5cf6" },
  { name: "Cơ khí", students: 1420, color: "#ef4444" },
  { name: "Xây dựng", students: 1402, color: "#06b6d4" },
]

// Recent registrations
const recentRegistrations = [
  {
    id: "SV2024001",
    name: "Nguyễn Văn An",
    course: "CS101 - Lập trình Web",
    time: "2 phút trước",
    status: "success",
  },
  {
    id: "SV2024156",
    name: "Trần Thị Bình",
    course: "BA201 - Quản trị học",
    time: "5 phút trước",
    status: "success",
  },
  {
    id: "SV2024089",
    name: "Lê Hoàng Cường",
    course: "EE301 - Điện tử số",
    time: "8 phút trước",
    status: "pending",
  },
  {
    id: "SV2024234",
    name: "Phạm Minh Đức",
    course: "ME201 - Cơ học vật liệu",
    time: "12 phút trước",
    status: "success",
  },
  {
    id: "SV2024178",
    name: "Hoàng Thị Em",
    course: "CS201 - Cơ sở dữ liệu",
    time: "15 phút trước",
    status: "failed",
  },
]

// Popular courses
const popularCourses = [
  { code: "CS101", name: "Lập trình Web", registered: 245, capacity: 250, percent: 98 },
  { code: "BA201", name: "Quản trị học", registered: 198, capacity: 200, percent: 99 },
  { code: "EN101", name: "Tiếng Anh cơ bản", registered: 312, capacity: 350, percent: 89 },
  { code: "CS201", name: "Cơ sở dữ liệu", registered: 186, capacity: 200, percent: 93 },
  { code: "MA101", name: "Giải tích 1", registered: 420, capacity: 500, percent: 84 },
]

// Recent activities
const recentActivities = [
  {
    type: "registration",
    icon: UserPlus,
    title: "Sinh viên mới đăng ký",
    description: "Nguyễn Văn An đăng ký môn Lập trình Web",
    time: "2 phút trước",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    type: "payment",
    icon: DollarSign,
    title: "Thanh toán học phí",
    description: "Trần Thị Bình thanh toán 15,000,000đ",
    time: "10 phút trước",
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
  {
    type: "class",
    icon: BookOpen,
    title: "Lớp học mới mở",
    description: "CS301 - Trí tuệ nhân tạo (Nhóm 2)",
    time: "30 phút trước",
    color: "text-violet-500",
    bgColor: "bg-violet-100",
  },
  {
    type: "alert",
    icon: AlertCircle,
    title: "Cảnh báo hệ thống",
    description: "Lớp BA201 đã đạt 99% sức chứa",
    time: "1 giờ trước",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  {
    type: "cancel",
    icon: XCircle,
    title: "Hủy đăng ký",
    description: "Lê Văn Cường hủy môn Vật lý đại cương",
    time: "2 giờ trước",
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
]

// Payment status data
const paymentStatusData = [
  { status: "Đã thanh toán", value: 8245, color: "#10b981" },
  { status: "Chưa thanh toán", value: 2890, color: "#ef4444" },
  { status: "Thanh toán một phần", value: 1323, color: "#f59e0b" },
]

interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalClasses: number;
  totalRegistrations: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await DashboardService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading admin stats:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Create dynamic stats cards with API data
  const dynamicStatsCards = [
    {
      title: "Tổng sinh viên",
      value: stats?.totalStudents ? new Intl.NumberFormat("vi-VN").format(stats.totalStudents) : "—",
      change: "+256",
      changePercent: "+2.1%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
      description: "Học kỳ này",
    },
    {
      title: "Lớp học phần mở",
      value: stats?.totalClasses ? new Intl.NumberFormat("vi-VN").format(stats.totalClasses) : "—",
      change: "+32",
      changePercent: "+7.0%",
      trend: "up",
      icon: BookOpen,
      color: "bg-emerald-500",
      description: "Đang hoạt động",
    },
    {
      title: "Tổng môn học",
      value: stats?.totalCourses ? new Intl.NumberFormat("vi-VN").format(stats.totalCourses) : "—",
      change: "+3.8 tỷ",
      changePercent: "+9.2%",
      trend: "up",
      icon: DollarSign,
      color: "bg-amber-500",
      description: "Tổng môn học",
    },
    {
      title: "Đăng ký môn học",
      value: stats?.totalRegistrations ? new Intl.NumberFormat("vi-VN").format(stats.totalRegistrations) : "—",
      change: "-1,245",
      changePercent: "-3.1%",
      trend: "down",
      icon: GraduationCap,
      color: "bg-violet-500",
      description: "Lượt đăng ký",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Tổng quan hệ thống đăng ký môn học - Học kỳ 2/2024
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards - Loading State */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {loading ? (
              // Loading skeletons
              dynamicStatsCards.map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Stats cards with data
              dynamicStatsCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          <div className="flex items-center gap-1 mt-2">
                            {stat.trend === "up" ? (
                              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                              }`}
                            >
                              {stat.changePercent}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({stat.change})
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                          </p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Registration Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Xu hướng đăng ký môn học
                  </CardTitle>
                  <CardDescription>
                    Số lượt đăng ký và hủy theo ngày
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      12 ngày qua
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>7 ngày qua</DropdownMenuItem>
                    <DropdownMenuItem>12 ngày qua</DropdownMenuItem>
                    <DropdownMenuItem>30 ngày qua</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationTrendData}>
                      <defs>
                        <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="registrations"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorReg)"
                        name="Đăng ký"
                      />
                      <Line
                        type="monotone"
                        dataKey="cancellations"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        name="Hủy"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Phân bố theo khoa
                </CardTitle>
                <CardDescription>Số lượng sinh viên đăng ký</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="students"
                        nameKey="name"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          new Intl.NumberFormat("vi-VN").format(value)
                        }
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Revenue & Popular Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Doanh thu học phí
                  </CardTitle>
                  <CardDescription>So sánh thực tế và mục tiêu (tỷ VNĐ)</CardDescription>
                </div>
                <Badge variant="secondary" className="font-normal">
                  Năm 2024
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value} tỷ`, ""]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="Thực tế"
                      />
                      <Bar
                        dataKey="target"
                        fill="#e5e7eb"
                        radius={[4, 4, 0, 0]}
                        name="Mục tiêu"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Tình trạng thanh toán
                </CardTitle>
                <CardDescription>Phân bố trạng thái học phí</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="status"
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          new Intl.NumberFormat("vi-VN").format(value)
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {paymentStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.status}</span>
                      </div>
                      <span className="font-medium">
                        {new Intl.NumberFormat("vi-VN").format(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third Row - Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Registrations Table */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Đăng ký gần đây
                  </CardTitle>
                  <CardDescription>Hoạt động đăng ký mới nhất</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã SV</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRegistrations.map((reg, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{reg.id}</TableCell>
                        <TableCell>{reg.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {reg.course}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {reg.time}
                        </TableCell>
                        <TableCell>
                          {reg.status === "success" && (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Thành công
                            </Badge>
                          )}
                          {reg.status === "pending" && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              <Clock className="h-3 w-3 mr-1" />
                              Đang xử lý
                            </Badge>
                          )}
                          {reg.status === "failed" && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                              <XCircle className="h-3 w-3 mr-1" />
                              Thất bại
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                              <DropdownMenuItem>Hủy đăng ký</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Hoạt động gần đây
                </CardTitle>
                <CardDescription>Cập nhật real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fourth Row - Popular Courses */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">
                  Môn học phổ biến
                </CardTitle>
                <CardDescription>Top 5 môn học có lượt đăng ký cao nhất</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Quản lý lớp học
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã môn</TableHead>
                    <TableHead>Tên môn học</TableHead>
                    <TableHead>Đã đăng ký</TableHead>
                    <TableHead>Sức chứa</TableHead>
                    <TableHead>Tỷ lệ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularCourses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.registered}</TableCell>
                      <TableCell>{course.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={course.percent}
                            className="w-20 h-2"
                          />
                          <span className="text-sm text-muted-foreground">
                            {course.percent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.percent >= 95 ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            Gần đầy
                          </Badge>
                        ) : course.percent >= 80 ? (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            Đang đầy
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            Còn chỗ
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
