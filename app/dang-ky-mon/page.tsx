"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CourseTable } from "@/components/course-registration/course-table"
import { TimetablePreview } from "@/components/course-registration/timetable-preview"
import { CourseFilters } from "@/components/course-registration/course-filters"
import { RegisteredCourses } from "@/components/course-registration/registered-courses"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"
import CourseRegistrationService from "@/services/courseRegistration.service"
import RegistrationService from "@/services/registration.service"
import type {
  CourseRegistrationItem,
  RegisteredCourseItem,
  TuitionValidationResult,
} from "@/types"

type LoadState = "loading" | "error" | "success"

export default function CourseRegistrationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("2024-2")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [courses, setCourses] = useState<CourseRegistrationItem[]>([])
  const [loadState, setLoadState] = useState<LoadState>("loading")
  const [loadError, setLoadError] = useState<string>("")
  const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourseItem[]>([])
  const [conflictWarning, setConflictWarning] = useState<string | null>(null)
  const [prerequisiteWarning, setPrerequisiteWarning] = useState<string | null>(null)
  const [tuitionValidation, setTuitionValidation] =
    useState<TuitionValidationResult | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadTuitionStatus() {
      try {
        const validation = await RegistrationService.validateTuition()
        if (cancelled) return
        setTuitionValidation(validation)
      } catch {
        if (cancelled) return
        setTuitionValidation({
          canRegister: false,
          status: "unpaid",
          message:
            "Không thể xác minh trạng thái học phí. Vui lòng đăng nhập lại hoặc thử sau.",
        })
      }
    }

    void loadTuitionStatus()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadCourses() {
      setLoadState("loading")
      setLoadError("")
      try {
        const data = await CourseRegistrationService.getOpenCourses(selectedSemester)
        if (cancelled) return
        setCourses(data)
        setLoadState("success")
      } catch {
        if (cancelled) return
        setLoadError(
          "Không thể tải danh sách lớp học phần. Vui lòng đăng nhập lại hoặc thử sau."
        )
        setLoadState("error")
      }
    }

    void loadCourses()
    return () => {
      cancelled = true
    }
  }, [selectedSemester])

  const registrationDisabled = tuitionValidation !== null && !tuitionValidation.canRegister

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment =
      selectedDepartment === "all" || course.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const checkScheduleConflict = (newCourse: CourseRegistrationItem): boolean => {
    return registeredCourses.some((registered) =>
      registered.schedule.some((regSchedule) =>
        newCourse.schedule.some(
          (newSchedule) =>
            regSchedule.day === newSchedule.day &&
            ((newSchedule.startTime >= regSchedule.startTime &&
              newSchedule.startTime < regSchedule.endTime) ||
              (newSchedule.endTime > regSchedule.startTime &&
                newSchedule.endTime <= regSchedule.endTime) ||
              (newSchedule.startTime <= regSchedule.startTime &&
                newSchedule.endTime >= regSchedule.endTime))
        )
      )
    )
  }

  const checkPrerequisite = (course: CourseRegistrationItem): boolean => {
    if (!course.prerequisite) return true
    return registeredCourses.some((c) => c.code === course.prerequisite)
  }

  const handleRegister = (course: CourseRegistrationItem) => {
    setConflictWarning(null)
    setPrerequisiteWarning(null)

    if (registrationDisabled) {
      return
    }

    if (checkScheduleConflict(course)) {
      setConflictWarning(`Môn "${course.name}" bị trùng lịch với môn đã đăng ký!`)
      return
    }

    if (!checkPrerequisite(course)) {
      setPrerequisiteWarning(
        `Môn "${course.name}" yêu cầu học trước môn ${course.prerequisite}!`
      )
      return
    }

    if (registeredCourses.some((c) => c.id === course.id)) {
      return
    }

    setRegisteredCourses([
      ...registeredCourses,
      { ...course, registeredAt: new Date() },
    ])
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

          {tuitionValidation && !tuitionValidation.canRegister && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Không thể đăng ký môn học</AlertTitle>
              <AlertDescription>{tuitionValidation.message}</AlertDescription>
            </Alert>
          )}

          {loadState === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
              <AlertDescription>{loadError}</AlertDescription>
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
              {loadState === "loading" ? (
                <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <CourseTable
                  courses={filteredCourses}
                  registeredCourseIds={registeredCourses.map((c) => c.id)}
                  onRegister={handleRegister}
                  registrationDisabled={registrationDisabled}
                />
              )}
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
