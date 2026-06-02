"use client"

import { useState } from "react"
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
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Printer,
  MapPin,
  User,
  Monitor,
  Building,
} from "lucide-react"
import { cn } from "@/lib/utils"

const days = [
  { id: "mon", label: "Thứ 2", shortLabel: "T2" },
  { id: "tue", label: "Thứ 3", shortLabel: "T3" },
  { id: "wed", label: "Thứ 4", shortLabel: "T4" },
  { id: "thu", label: "Thứ 5", shortLabel: "T5" },
  { id: "fri", label: "Thứ 6", shortLabel: "T6" },
  { id: "sat", label: "Thứ 7", shortLabel: "T7" },
  { id: "sun", label: "CN", shortLabel: "CN" },
]

const timeSlots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

interface CourseBlock {
  id: string
  name: string
  code: string
  instructor: string
  room: string
  day: string
  startTime: string
  endTime: string
  color: string
  isOnline: boolean
}

const scheduleData: CourseBlock[] = [
  {
    id: "1",
    name: "Lập trình Web",
    code: "CS301",
    instructor: "TS. Nguyễn Văn B",
    room: "A101",
    day: "mon",
    startTime: "07:00",
    endTime: "09:30",
    color: "bg-blue-500",
    isOnline: false,
  },
  {
    id: "2",
    name: "Cơ sở dữ liệu",
    code: "CS302",
    instructor: "ThS. Trần Thị C",
    room: "B203",
    day: "tue",
    startTime: "13:00",
    endTime: "15:30",
    color: "bg-emerald-500",
    isOnline: false,
  },
  {
    id: "3",
    name: "Mạng máy tính",
    code: "CS303",
    instructor: "PGS.TS. Lê Văn D",
    room: "C305",
    day: "thu",
    startTime: "09:45",
    endTime: "12:15",
    color: "bg-amber-500",
    isOnline: false,
  },
  {
    id: "4",
    name: "Trí tuệ nhân tạo",
    code: "CS401",
    instructor: "TS. Phạm Thị E",
    room: "Online",
    day: "fri",
    startTime: "07:00",
    endTime: "09:30",
    color: "bg-rose-500",
    isOnline: true,
  },
  {
    id: "5",
    name: "Kiểm thử phần mềm",
    code: "CS304",
    instructor: "ThS. Hoàng Văn F",
    room: "D102",
    day: "wed",
    startTime: "14:00",
    endTime: "16:30",
    color: "bg-violet-500",
    isOnline: false,
  },
  {
    id: "6",
    name: "An toàn thông tin",
    code: "CS402",
    instructor: "TS. Vũ Thị G",
    room: "A205",
    day: "mon",
    startTime: "13:00",
    endTime: "15:30",
    color: "bg-cyan-500",
    isOnline: false,
  },
  {
    id: "7",
    name: "Phát triển ứng dụng di động",
    code: "CS403",
    instructor: "ThS. Đặng Văn H",
    room: "Online",
    day: "sat",
    startTime: "08:00",
    endTime: "11:00",
    color: "bg-orange-500",
    isOnline: true,
  },
]

function getTimePosition(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  const startHour = 7
  return (hours - startHour) * 60 + minutes
}

function getBlockHeight(startTime: string, endTime: string): number {
  const start = getTimePosition(startTime)
  const end = getTimePosition(endTime)
  return end - start
}

export default function TimetablePage() {
  const [currentWeek, setCurrentWeek] = useState("20/05/2024 - 26/05/2024")
  const [selectedSemester, setSelectedSemester] = useState("hk2-2024")
  const [selectedCourse, setSelectedCourse] = useState<CourseBlock | null>(null)

  const hourHeight = 60

  return (
    <ProtectedRoute requiredRole="student">
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="thoi-khoa-bieu" />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Thời khóa biểu</h1>
              <p className="text-sm text-muted-foreground">
                Xem lịch học và quản lý thời gian của bạn
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hk2-2024">Học kỳ 2 - 2024</SelectItem>
                  <SelectItem value="hk1-2024">Học kỳ 1 - 2024</SelectItem>
                  <SelectItem value="hk2-2023">Học kỳ 2 - 2023</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Calendar */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/30 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Lịch tuần</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[180px] text-center text-sm font-medium">
                      {currentWeek}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Day Headers */}
                    <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b">
                      <div className="border-r bg-muted/20 p-2" />
                      {days.map((day, index) => (
                        <div
                          key={day.id}
                          className={cn(
                            "border-r p-3 text-center last:border-r-0",
                            index === 0 && "bg-primary/5"
                          )}
                        >
                          <p className="text-sm font-semibold text-foreground">
                            {day.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {20 + index}/05
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Time Grid */}
                    <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
                      {/* Time Labels */}
                      <div className="border-r bg-muted/20">
                        {timeSlots.map((time) => (
                          <div
                            key={time}
                            className="relative border-b last:border-b-0"
                            style={{ height: `${hourHeight}px` }}
                          >
                            <span className="absolute -top-2.5 left-2 text-xs text-muted-foreground">
                              {time}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Day Columns */}
                      {days.map((day, dayIndex) => (
                        <div
                          key={day.id}
                          className={cn(
                            "relative border-r last:border-r-0",
                            dayIndex === 0 && "bg-primary/5"
                          )}
                        >
                          {/* Hour Lines */}
                          {timeSlots.map((time) => (
                            <div
                              key={time}
                              className="border-b last:border-b-0"
                              style={{ height: `${hourHeight}px` }}
                            />
                          ))}

                          {/* Course Blocks */}
                          {scheduleData
                            .filter((course) => course.day === day.id)
                            .map((course) => {
                              const top = getTimePosition(course.startTime)
                              const height = getBlockHeight(
                                course.startTime,
                                course.endTime
                              )

                              return (
                                <button
                                  key={course.id}
                                  onClick={() => setSelectedCourse(course)}
                                  className={cn(
                                    "absolute left-1 right-1 rounded-lg p-2 text-left text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg",
                                    course.color,
                                    selectedCourse?.id === course.id &&
                                      "ring-2 ring-foreground ring-offset-2"
                                  )}
                                  style={{
                                    top: `${top}px`,
                                    height: `${height}px`,
                                  }}
                                >
                                  <div className="flex h-full flex-col overflow-hidden">
                                    <p className="truncate text-xs font-bold">
                                      {course.name}
                                    </p>
                                    <p className="truncate text-[10px] opacity-90">
                                      {course.code}
                                    </p>
                                    {height > 80 && (
                                      <>
                                        <p className="mt-auto truncate text-[10px] opacity-80">
                                          {course.room}
                                        </p>
                                        {course.isOnline && (
                                          <Badge
                                            variant="secondary"
                                            className="mt-1 h-4 w-fit bg-white/20 px-1 text-[9px] text-white"
                                          >
                                            Online
                                          </Badge>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Panel */}
            <div className="space-y-6">
              {/* Course Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Chi tiết môn học</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCourse ? (
                    <div className="space-y-4">
                      <div
                        className={cn(
                          "rounded-lg p-4 text-white",
                          selectedCourse.color
                        )}
                      >
                        <h3 className="font-bold">{selectedCourse.name}</h3>
                        <p className="text-sm opacity-90">{selectedCourse.code}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Giảng viên</p>
                            <p className="font-medium">{selectedCourse.instructor}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Phòng học</p>
                            <p className="font-medium">{selectedCourse.room}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          {selectedCourse.isOnline ? (
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Building className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <p className="text-muted-foreground">Hình thức</p>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {selectedCourse.isOnline ? "Trực tuyến" : "Trực tiếp"}
                              </p>
                              <Badge
                                variant={
                                  selectedCourse.isOnline ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {selectedCourse.isOnline ? "Online" : "Offline"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Thời gian</p>
                            <p className="font-medium">
                              {selectedCourse.startTime} - {selectedCourse.endTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <Calendar className="mx-auto mb-2 h-10 w-10 opacity-50" />
                      <p className="text-sm">Chọn một môn học để xem chi tiết</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tổng quan tuần này</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm text-muted-foreground">Số buổi học</span>
                      <span className="font-bold text-foreground">7 buổi</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm text-muted-foreground">Tổng giờ học</span>
                      <span className="font-bold text-foreground">17.5 giờ</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm text-muted-foreground">Học online</span>
                      <span className="font-bold text-foreground">2 buổi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legend */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Chú thích màu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {scheduleData.slice(0, 6).map((course) => (
                      <div key={course.id} className="flex items-center gap-2">
                        <div
                          className={cn("h-3 w-3 rounded-full", course.color)}
                        />
                        <span className="truncate text-xs text-muted-foreground">
                          {course.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
