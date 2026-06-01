"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CourseTable } from "@/components/course-registration/course-table"
import { TimetablePreview } from "@/components/course-registration/timetable-preview"
import { CourseFilters } from "@/components/course-registration/course-filters"
import { RegisteredCourses } from "@/components/course-registration/registered-courses"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export interface Course {
  id: string
  code: string
  name: string
  instructor: string
  credits: number
  totalSeats: number
  remainingSeats: number
  schedule: {
    day: number
    startTime: string
    endTime: string
    room: string
  }[]
  department: string
  prerequisite?: string
}

export interface RegisteredCourse extends Course {
  registeredAt: Date
}

const mockCourses: Course[] = [
  {
    id: "1",
    code: "IT001",
    name: "Lập trình Web",
    instructor: "TS. Nguyễn Văn A",
    credits: 3,
    totalSeats: 40,
    remainingSeats: 12,
    schedule: [{ day: 2, startTime: "07:00", endTime: "09:30", room: "A101" }],
    department: "CNTT",
  },
  {
    id: "2",
    code: "IT002",
    name: "Cơ sở dữ liệu",
    instructor: "PGS. Trần Thị B",
    credits: 3,
    totalSeats: 35,
    remainingSeats: 0,
    schedule: [{ day: 3, startTime: "13:00", endTime: "15:30", room: "B203" }],
    department: "CNTT",
  },
  {
    id: "3",
    code: "IT003",
    name: "Mạng máy tính",
    instructor: "ThS. Lê Văn C",
    credits: 3,
    totalSeats: 30,
    remainingSeats: 8,
    schedule: [{ day: 4, startTime: "09:45", endTime: "12:15", room: "C305" }],
    department: "CNTT",
  },
  {
    id: "4",
    code: "IT004",
    name: "Trí tuệ nhân tạo",
    instructor: "TS. Phạm Văn D",
    credits: 3,
    totalSeats: 25,
    remainingSeats: 5,
    schedule: [{ day: 5, startTime: "07:00", endTime: "09:30", room: "D102" }],
    department: "CNTT",
    prerequisite: "IT001",
  },
  {
    id: "5",
    code: "IT005",
    name: "An toàn thông tin",
    instructor: "TS. Hoàng Văn E",
    credits: 3,
    totalSeats: 30,
    remainingSeats: 15,
    schedule: [{ day: 2, startTime: "13:00", endTime: "15:30", room: "A205" }],
    department: "CNTT",
  },
  {
    id: "6",
    code: "MA001",
    name: "Giải tích 2",
    instructor: "PGS. Ngô Thị F",
    credits: 4,
    totalSeats: 50,
    remainingSeats: 22,
    schedule: [{ day: 3, startTime: "07:00", endTime: "09:30", room: "E101" }],
    department: "Toán",
  },
  {
    id: "7",
    code: "PH001",
    name: "Vật lý đại cương",
    instructor: "TS. Võ Văn G",
    credits: 3,
    totalSeats: 45,
    remainingSeats: 18,
    schedule: [{ day: 6, startTime: "07:00", endTime: "09:30", room: "F201" }],
    department: "Vật lý",
  },
  {
    id: "8",
    code: "IT006",
    name: "Phát triển ứng dụng di động",
    instructor: "ThS. Đặng Văn H",
    credits: 3,
    totalSeats: 30,
    remainingSeats: 3,
    schedule: [{ day: 4, startTime: "13:00", endTime: "15:30", room: "A301" }],
    department: "CNTT",
    prerequisite: "IT001",
  },
]

export default function CourseRegistrationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("2024-2")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourse[]>([])
  const [conflictWarning, setConflictWarning] = useState<string | null>(null)
  const [prerequisiteWarning, setPrerequisiteWarning] = useState<string | null>(null)

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const checkScheduleConflict = (newCourse: Course): boolean => {
    return registeredCourses.some((registered) =>
      registered.schedule.some((regSchedule) =>
        newCourse.schedule.some(
          (newSchedule) =>
            regSchedule.day === newSchedule.day &&
            ((newSchedule.startTime >= regSchedule.startTime && newSchedule.startTime < regSchedule.endTime) ||
              (newSchedule.endTime > regSchedule.startTime && newSchedule.endTime <= regSchedule.endTime) ||
              (newSchedule.startTime <= regSchedule.startTime && newSchedule.endTime >= regSchedule.endTime))
        )
      )
    )
  }

  const checkPrerequisite = (course: Course): boolean => {
    if (!course.prerequisite) return true
    return registeredCourses.some((c) => c.code === course.prerequisite)
  }

  const handleRegister = (course: Course) => {
    setConflictWarning(null)
    setPrerequisiteWarning(null)

    if (checkScheduleConflict(course)) {
      setConflictWarning(`Môn "${course.name}" bị trùng lịch với môn đã đăng ký!`)
      return
    }

    if (!checkPrerequisite(course)) {
      setPrerequisiteWarning(`Môn "${course.name}" yêu cầu học trước môn ${course.prerequisite}!`)
      return
    }

    if (registeredCourses.some((c) => c.id === course.id)) {
      return
    }

    setRegisteredCourses([...registeredCourses, { ...course, registeredAt: new Date() }])
  }

  const handleUnregister = (courseId: string) => {
    setRegisteredCourses(registeredCourses.filter((c) => c.id !== courseId))
    setConflictWarning(null)
    setPrerequisiteWarning(null)
  }

  const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="dang-ky-mon" />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Đăng ký môn học</h1>
            <p className="text-muted-foreground">Học kỳ 2 năm học 2024-2025</p>
          </div>

          {(conflictWarning || prerequisiteWarning) && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{conflictWarning || prerequisiteWarning}</AlertDescription>
            </Alert>
          )}

          <CourseFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            <div className="xl:col-span-2 space-y-6">
              <CourseTable
                courses={filteredCourses}
                registeredCourseIds={registeredCourses.map((c) => c.id)}
                onRegister={handleRegister}
              />
              <RegisteredCourses
                courses={registeredCourses}
                totalCredits={totalCredits}
                onUnregister={handleUnregister}
              />
            </div>
            <div className="xl:col-span-1">
              <TimetablePreview courses={registeredCourses} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
