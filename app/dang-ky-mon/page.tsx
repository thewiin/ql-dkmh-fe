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
import { AlertTriangle, CheckCircle } from "lucide-react"
import CourseRegistrationService from "@/services/courseRegistration.service"
import RegistrationService from "@/services/registration.service"
import AuthService from "@/services/auth.service"
import type {
  CourseRegistrationItem,
  RegisteredCourseItem,
  TuitionValidationResult,
} from "@/types"
import type { ScheduleConflict } from "@/services/registration.service"

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
  const [conflictDetails, setConflictDetails] = useState<ScheduleConflict[]>([])
  const [prerequisiteWarning, setPrerequisiteWarning] = useState<string | null>(null)
  const [tuitionValidation, setTuitionValidation] =
    useState<TuitionValidationResult | null>(null)
  const [maSinhVien, setMaSinhVien] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadUserAndTuition() {
      try {
        const profile = await AuthService.getProfile()
        if (cancelled) return
        setMaSinhVien(profile.maSinhVien || null)
      } catch {
        if (cancelled) return
        console.error("Failed to load user profile")
      }

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

    void loadUserAndTuition()
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

  const checkScheduleConflict = (newCourse: CourseRegistrationItem): ScheduleConflict[] => {
    return RegistrationService.detectScheduleConflicts(newCourse, registeredCourses)
  }

  const checkPrerequisite = (course: CourseRegistrationItem): boolean => {
    if (!course.prerequisite) return true
    return registeredCourses.some((c) => c.code === course.prerequisite)
  }

   const handleRegister = (course: CourseRegistrationItem) => {
     setConflictWarning(null)
     setConflictDetails([])
     setPrerequisiteWarning(null)

     if (registrationDisabled) {
       return
     }

     const conflicts = checkScheduleConflict(course)
     if (conflicts.length > 0) {
       setConflictDetails(conflicts)
       const message = RegistrationService.formatConflictMessage(conflicts)
       setConflictWarning(message)
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

     // Optimistic update: giảm remaining seats khi đăng ký
     setCourses(courses.map(c =>
       c.id === course.id
         ? { ...c, remainingSeats: Math.max(0, c.remainingSeats - 1) }
         : c
     ))

     setRegisteredCourses([
       ...registeredCourses,
       { ...course, registeredAt: new Date() },
     ])
   }

   const handleUnregister = (courseId: string) => {
     // Revert optimistic update: tăng remaining seats khi hủy đăng ký
     const unregisteredCourse = registeredCourses.find(c => c.id === courseId)
     if (unregisteredCourse) {
       setCourses(courses.map(c =>
         c.id === courseId
           ? { ...c, remainingSeats: c.remainingSeats + 1 }
           : c
       ))
     }

     setRegisteredCourses(registeredCourses.filter((c) => c.id !== courseId))
     setConflictWarning(null)
     setConflictDetails([])
     setPrerequisiteWarning(null)
   }

  const validateBeforeSubmit = (): { isValid: boolean; error?: string } => {
    if (!maSinhVien) {
      return { isValid: false, error: "Không thể lấy thông tin sinh viên. Vui lòng đăng nhập lại." }
    }

    if (registeredCourses.length === 0) {
      return { isValid: false, error: "Vui lòng chọn ít nhất một môn học để đăng ký." }
    }

    if (registrationDisabled) {
      return { isValid: false, error: tuitionValidation?.message || "Bạn không thể đăng ký môn học lúc này." }
    }

    // Check for any remaining validation issues with courses
    for (const course of registeredCourses) {
      // Find original course to check current seat status
      const originalCourse = courses.find((c) => c.id === course.id)
      if (originalCourse && originalCourse.remainingSeats <= 0) {
        return { isValid: false, error: `Môn "${course.name}" đã hết chỗ.` }
      }
    }

    return { isValid: true }
  }

  const handleSubmitRegistration = async () => {
    setSubmitError(null)
    setSubmitSuccess(null)

    const validation = validateBeforeSubmit()
    if (!validation.isValid) {
      setSubmitError(validation.error || "Vui lòng kiểm tra lại các môn học đã chọn.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await RegistrationService.submitRegistration(registeredCourses, maSinhVien!)

      if (result.success) {
        setSubmitSuccess(result.message)
        // Clear registered courses after successful submission
        setRegisteredCourses([])
        setConflictWarning(null)
        setConflictDetails([])
        setPrerequisiteWarning(null)

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(null)
        }, 5000)
      } else {
        setSubmitError(result.message)
      }
    } catch (error) {
      setSubmitError("Lỗi khi đăng ký: " + (error instanceof Error ? error.message : "Vui lòng thử lại"))
    } finally {
      setIsSubmitting(false)
    }
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

           {submitError && (
             <Alert variant="destructive" className="mb-4">
               <AlertTriangle className="h-4 w-4" />
               <AlertTitle>Lỗi đăng ký</AlertTitle>
               <AlertDescription>{submitError}</AlertDescription>
             </Alert>
           )}

           {submitSuccess && (
             <Alert className="mb-4 border-emerald-200 bg-emerald-50">
               <CheckCircle className="h-4 w-4 text-emerald-600" />
               <AlertTitle className="text-emerald-900">Đăng ký thành công</AlertTitle>
               <AlertDescription className="text-emerald-800">{submitSuccess}</AlertDescription>
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
                  conflictingCourseIds={conflictDetails.map((c) => c.conflictingCourse.id)}
                />
              )}
               <RegisteredCourses
                 courses={registeredCourses}
                 totalCredits={totalCredits}
                 onUnregister={handleUnregister}
                 onSubmit={handleSubmitRegistration}
                 isSubmitting={isSubmitting}
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
