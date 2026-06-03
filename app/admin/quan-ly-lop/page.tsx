"use client"

import { useMemo, useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MergeClassDialog } from "@/components/admin/merge-class-dialog"
import { ClassFormDialog } from "@/components/admin/class-form-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Lock,
  Unlock,
  UserPlus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
   Download,
   Upload,
   Copy,
   GitMerge,
 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"
import LopHocPhanService from "@/services/lopHocPhan.service"
import type { LopHocPhanApi, MonHocApi } from "@/types"

interface ClassSection {
  id: string
  courseCode: string
  courseName: string
  section: string
  instructor: string | null
  instructorId: string | null
  schedule: string
  room: string
  capacity: number
  enrolled: number
  waitlist: number
  status: "open" | "closed" | "locked" | "cancelled"
  semester: string
  department: string
  credits: number
}

const instructors = [
  { id: "GV001", name: "TS. Nguyễn Văn A", department: "CNTT" },
  { id: "GV002", name: "ThS. Trần Thị B", department: "CNTT" },
  { id: "GV003", name: "PGS.TS. Lê Văn C", department: "CNTT" },
  { id: "GV004", name: "TS. Phạm Văn D", department: "Toán" },
  { id: "GV005", name: "PGS.TS. Hoàng Văn E", department: "CNTT" },
  { id: "GV006", name: "ThS. Ngô Thị F", department: "Ngoại ngữ" },
  { id: "GV007", name: "TS. Vũ Văn G", department: "CNTT" },
  { id: "GV008", name: "TS. Đỗ Văn H", department: "CNTT" },
]

// Mock initialClasses removed.

export default function ClassManagementPage() {
  const [classes, setClasses] = useState<ClassSection[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [selectedClass, setSelectedClass] = useState<ClassSection | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<string>("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [defaultMergeSourceClassId, setDefaultMergeSourceClassId] = useState<string>("")
  const [defaultMergeTargetClassId, setDefaultMergeTargetClassId] = useState<string>("")
  const [mergeCandidates, setMergeCandidates] = useState<LopHocPhanApi[]>([])
  const [isMergeLoading, setIsMergeLoading] = useState(false)
  
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingApiClass, setEditingApiClass] = useState<LopHocPhanApi | null>(null)
  const [apiClasses, setApiClasses] = useState<LopHocPhanApi[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || cls.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage)
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = {
    total: classes.length,
    open: classes.filter((c) => c.status === "open").length,
    closed: classes.filter((c) => c.status === "closed").length,
    locked: classes.filter((c) => c.status === "locked").length,
    noInstructor: classes.filter((c) => !c.instructor).length,
    totalEnrolled: classes.reduce((sum, c) => sum + c.enrolled, 0),
    totalCapacity: classes.reduce((sum, c) => sum + c.capacity, 0),
    totalWaitlist: classes.reduce((sum, c) => sum + c.waitlist, 0),
  }

  const getStatusBadge = (status: ClassSection["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Đang mở</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Đã đóng</Badge>
      case "locked":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Đã khóa</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Đã hủy</Badge>
    }
  }

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100
    if (percentage >= 100) return "bg-red-500"
    if (percentage >= 80) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const toggleLock = (classId: string) => {
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id === classId) {
          if (cls.status === "locked") {
            return { ...cls, status: "open" }
          } else if (cls.status === "open" || cls.status === "closed") {
            return { ...cls, status: "locked" }
          }
        }
        return cls
      })
    )
  }

  const assignInstructor = () => {
    if (!selectedClass || !selectedInstructor) return
    const instructor = instructors.find((i) => i.id === selectedInstructor)
    if (!instructor) return

    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === selectedClass.id
          ? { ...cls, instructor: instructor.name, instructorId: instructor.id }
          : cls
      )
    )
    setAssignDialogOpen(false)
    setSelectedInstructor("")
    setSelectedClass(null)
  }

  const duplicateClass = (cls: ClassSection) => {
    const newSection = String(Number(cls.section) + 1).padStart(2, "0")
    const newClass: ClassSection = {
      ...cls,
      id: String(Date.now()),
      section: newSection,
      enrolled: 0,
      waitlist: 0,
      status: "open",
    }
    setClasses((prev) => [...prev, newClass])
  }

  const deleteClass = async () => {
    if (!selectedClass) return
    try {
      await LopHocPhanService.deleteLopHocPhan(selectedClass.id)
      await refreshClasses()
      setDeleteDialogOpen(false)
      setSelectedClass(null)
    } catch (error) {
      console.error("Lỗi khi xóa lớp học phần:", error)
      alert("Đã xảy ra lỗi khi xóa lớp học phần.")
    }
  }

  const refreshClasses = async () => {
    setIsRefreshing(true)
    try {
      const [apiClassesData, monHocRes] = await Promise.all([
        LopHocPhanService.getAllLopHocPhan(),
        api.get<MonHocApi[]>("/monhoc")
      ])
      const monHocList = monHocRes.data
      setApiClasses(apiClassesData)
      setClasses(apiClassesData.map(item => {
        const mon = monHocList.find(m => m.maMH === item.maMH)
        return {
          id: item.maLHP,
          courseCode: item.maMH,
          courseName: mon?.tenMH ?? item.maMH,
          section: "01",
          instructor: "—",
          instructorId: "—",
          schedule: item.thu && item.soTiet ? `Thứ ${item.thu} | ${item.soTiet} tiết` : "—",
          room: "—",
          capacity: item.siSoToiDa,
          enrolled: item.siSoHienTai,
          waitlist: 0,
          status: (item.trangThai === "open" || item.trangThai === "closed" || item.trangThai === "locked") ? item.trangThai as any : "cancelled",
          semester: `HK${item.hocKy} ${item.namHoc}`,
          department: mon?.khoa ?? "—",
          credits: mon?.soTinChi ?? 0,
        }
      }))
    } catch (error) {
      console.error("Lỗi khi tải danh sách lớp:", error)
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshClasses()
  }, [])

  const openMergeDialog = async (targetClassId: string) => {
    setIsMergeLoading(true)
    setDefaultMergeSourceClassId("")
    setDefaultMergeTargetClassId(targetClassId)
    try {
      const candidates = await LopHocPhanService.getCanMergeLopHocPhan(targetClassId)
      setMergeCandidates(candidates)
      setDefaultMergeSourceClassId(candidates[0]?.maLHP ?? "")
      setMergeDialogOpen(true)
    } catch (error) {
      console.error("Không thể tải danh sách lớp có thể gộp:", error)
      window.alert("Không thể tải danh sách lớp có thể gộp.")
    } finally {
      setIsMergeLoading(false)
    }
  }

  const handleMergeClass = async (sourceClassId: string, targetClassId: string) => {
    await LopHocPhanService.mergeLopHocPhan({
      maLopHocPhanToMerge: [sourceClassId],
      maLopHocPhanTarget: targetClassId,
    })
    await refreshClasses()
  }

  const mergeDialogClasses = useMemo(
    () => {
      const target = classes.find((item) => item.id === defaultMergeTargetClassId)
      const targetOption = target
        ? [
            {
              id: target.id,
              name: `${target.courseCode} - ${target.id}`,
              currentStudents: target.enrolled,
              maxCapacity: target.capacity,
            },
          ]
        : []
      const candidateOptions = mergeCandidates.map((cls) => ({
        id: cls.maLHP,
        name: `${cls.maMH} - ${cls.maLHP}`,
        currentStudents: cls.siSoHienTai,
        maxCapacity: cls.siSoToiDa,
      }))
      const allOptions = [...targetOption, ...candidateOptions]
      return allOptions.filter(
        (item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index
      )
    },
    [classes, defaultMergeTargetClassId, mergeCandidates]
  )

  return (
    <ProtectedRoute requiredRole="admin">
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Quản lý lớp học phần</h1>
                <p className="text-muted-foreground">
                  Quản lý các lớp học phần, phân công giảng viên và theo dõi đăng ký
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="bg-primary" onClick={() => {
                  setEditingApiClass(null)
                  setFormDialogOpen(true)
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm lớp mới
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tổng lớp</p>
                      <p className="text-xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Đang mở</p>
                      <p className="text-xl font-bold text-emerald-600">{stats.open}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Đã đóng</p>
                      <p className="text-xl font-bold text-red-600">{stats.closed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Lock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Đã khóa</p>
                      <p className="text-xl font-bold text-amber-600">{stats.locked}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Chưa có GV</p>
                      <p className="text-xl font-bold text-orange-600">{stats.noInstructor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Đã đăng ký</p>
                      <p className="text-xl font-bold text-blue-600">{stats.totalEnrolled}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <Users className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sức chứa</p>
                      <p className="text-xl font-bold text-indigo-600">{stats.totalCapacity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Chờ đăng ký</p>
                      <p className="text-xl font-bold text-purple-600">{stats.totalWaitlist}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo mã môn, tên môn, giảng viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="open">Đang mở</SelectItem>
                        <SelectItem value="closed">Đã đóng</SelectItem>
                        <SelectItem value="locked">Đã khóa</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Khoa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả khoa</SelectItem>
                        <SelectItem value="Công nghệ thông tin">Công nghệ thông tin</SelectItem>
                        <SelectItem value="Toán học">Toán học</SelectItem>
                        <SelectItem value="Vật lý">Vật lý</SelectItem>
                        <SelectItem value="Ngoại ngữ">Ngoại ngữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={refreshClasses} disabled={isRefreshing}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Class Table */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Danh sách lớp học phần</CardTitle>
                <CardDescription>
                  Hiển thị {filteredClasses.length} / {classes.length} lớp
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                  </div>
                ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Mã lớp</TableHead>
                        <TableHead className="font-semibold">Tên môn học</TableHead>
                        <TableHead className="font-semibold">Giảng viên</TableHead>
                        <TableHead className="font-semibold">Lịch học</TableHead>
                        <TableHead className="font-semibold">Phòng</TableHead>
                        <TableHead className="font-semibold">Sĩ số</TableHead>
                        <TableHead className="font-semibold">Chờ</TableHead>
                        <TableHead className="font-semibold">Trạng thái</TableHead>
                        <TableHead className="font-semibold text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedClasses.map((cls) => (
                        <TableRow
                          key={cls.id}
                          className={cls.status === "cancelled" ? "opacity-50" : ""}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{cls.courseCode}</p>
                              <p className="text-xs text-muted-foreground">Nhóm {cls.section}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{cls.courseName}</p>
                              <p className="text-xs text-muted-foreground">
                                {cls.credits} tín chỉ | {cls.department}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {cls.instructor ? (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                                  {cls.instructor.split(" ").pop()?.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm">{cls.instructor}</p>
                                  <p className="text-xs text-muted-foreground">{cls.instructorId}</p>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                onClick={() => {
                                  setSelectedClass(cls)
                                  setAssignDialogOpen(true)
                                }}
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                Phân công
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{cls.schedule}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{cls.room}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 min-w-[120px]">
                              <div className="flex items-center justify-between text-sm">
                                <span>
                                  {cls.enrolled}/{cls.capacity}
                                </span>
                                <span className="text-muted-foreground">
                                  {Math.round((cls.enrolled / cls.capacity) * 100)}%
                                </span>
                              </div>
                              <Progress
                                value={(cls.enrolled / cls.capacity) * 100}
                                className={`h-2 ${getCapacityColor(cls.enrolled, cls.capacity)}`}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {cls.waitlist > 0 ? (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                +{cls.waitlist}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(cls.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {cls.status !== "cancelled" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => toggleLock(cls.id)}
                                  title={cls.status === "locked" ? "Mở khóa" : "Khóa lớp"}
                                >
                                  {cls.status === "locked" ? (
                                    <Unlock className="h-4 w-4 text-amber-600" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const apiItem = apiClasses.find(a => a.maLHP === cls.id) || null
                                      setEditingApiClass(apiItem)
                                      setFormDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedClass(cls)
                                      setAssignDialogOpen(true)
                                    }}
                                  >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Phân công GV
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => duplicateClass(cls)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                     Nhân bản lớp
                                   </DropdownMenuItem>
                                   <DropdownMenuItem
                                     onClick={() => {
                                       void openMergeDialog(cls.id)
                                     }}
                                     disabled={isMergeLoading}
                                   >
                                     <GitMerge className="h-4 w-4 mr-2" />
                                     Gộp lớp
                                   </DropdownMenuItem>
                                   <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedClass(cls)
                                      setDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa lớp
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && !isLoading && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị {filteredClasses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredClasses.length)} của {filteredClasses.length} kết quả
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      Trước
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Assign Instructor Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phân công giảng viên</DialogTitle>
            <DialogDescription>
              Chọn giảng viên cho lớp {selectedClass?.courseCode} - Nhóm {selectedClass?.section}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Môn học</label>
              <Input value={selectedClass?.courseName || ""} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giảng viên</label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giảng viên" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      <div className="flex items-center gap-2">
                        <span>{instructor.name}</span>
                        <span className="text-muted-foreground">({instructor.department})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={assignInstructor} disabled={!selectedInstructor}>
              Phân công
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa lớp</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa lớp {selectedClass?.courseCode} - Nhóm{" "}
              {selectedClass?.section}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={deleteClass}>
              Xóa lớp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MergeClassDialog
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
        classes={mergeDialogClasses}
        defaultSourceClassId={defaultMergeSourceClassId}
        defaultTargetClassId={defaultMergeTargetClassId}
        lockTargetClass
        onMerge={handleMergeClass}
      />

      <ClassFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={refreshClasses}
        editingClass={editingApiClass}
      />
    </div>
    </ProtectedRoute>
  )
}
