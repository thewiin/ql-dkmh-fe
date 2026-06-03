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
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AlertTriangle, CheckCircle } from "lucide-react"
import CourseRegistrationService from "@/services/courseRegistration.service"
import AuthService from "@/services/auth.service"
import DangKyService from "@/services/dangKy.service"
import type {
  CourseRegistrationItem,
  RegisteredCourseItem,
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
  const [maSinhVien, setMaSinhVien] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadUser() {
      try {
        const profile = await AuthService.getProfile()
        if (!cancelled && profile.maSinhVien) {
          setMaSinhVien(profile.maSinhVien)
        }
      } catch {}
    }
    loadUser()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadState("loading")
    setLoadError("")

    async function load() {
      try {
        const data = await CourseRegistrationService.getOpenCourses(selectedSemester)
        if (cancelled) return
        setCourses(data)
        setLoadState("success")

        if (maSinhVien) {
          const registrations = await DangKyService.getDangKyBySinhVien(maSinhVien)
          if (cancelled) return

          const courseMap = new Map(data.map((course) => [course.id, course]))
          const mappedRegisteredCourses: RegisteredCourseItem[] = []

          registrations.forEach((registration) => {
            const course = courseMap.get(registration.maLopHocPhan)
            if (!course) return
            mappedRegisteredCourses.push({
              ...course,
              registeredAt: new Date(registration.ngayDangKy),
              registrationId: registration.maDangKy,
            })
          })
          setRegisteredCourses(mappedRegisteredCourses)
        } else {
          setRegisteredCourses([])
        }
      } catch {
        if (cancelled) return
        setLoadError("Không thể tải danh sách lớp học phần. Vui lòng thử lại sau.")
        setLoadState("error")
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [selectedSemester, maSinhVien])

  const refreshData = async () => {
    try {
      const data = await CourseRegistrationService.getOpenCourses(selectedSemester)
      setCourses(data)
      
      if (maSinhVien) {
        const registrations = await DangKyService.getDangKyBySinhVien(maSinhVien)
        const courseMap = new Map(data.map((course) => [course.id, course]))
        const mappedRegisteredCourses: RegisteredCourseItem[] = []
        
        registrations.forEach((registration) => {
          const course = courseMap.get(registration.maLopHocPhan)
          if (!course) return
          mappedRegisteredCourses.push({
            ...course,
            registeredAt: new Date(registration.ngayDangKy),
            registrationId: registration.maDangKy,
          })
        })
        setRegisteredCourses(mappedRegisteredCourses)
      }
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu:", error)
    }
  }

  const registrationDisabled = false

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment =
      selectedDepartment === "all" || course.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

   const handleRegister = (course: CourseRegistrationItem) => {
     if (registrationDisabled) {
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

   const handleUnregister = async (courseId: string) => {
     const unregisteredCourse = registeredCourses.find((c) => c.id === courseId)
     if (!unregisteredCourse) return

     if (!window.confirm(`Bạn có chắc chắn muốn hủy đăng ký môn ${unregisteredCourse.name} không?`)) {
       return
     }

     if (unregisteredCourse.registrationId) {
       try {
         await DangKyService.rutMon(unregisteredCourse.registrationId)
         setSubmitSuccess(`Đã hủy đăng ký môn ${unregisteredCourse.name}.`)
         setTimeout(() => setSubmitSuccess(null), 5000)
         await refreshData()
         return
       } catch {
         setSubmitError("Không thể hủy đăng ký trên hệ thống. Vui lòng thử lại.")
         return
       }
     }

     // Revert optimistic update: tăng remaining seats khi hủy đăng ký cho môn chưa submit
     setCourses(courses.map((c) =>
       c.id === courseId
         ? { ...c, remainingSeats: c.remainingSeats + 1 }
         : c
     ))

     setRegisteredCourses(registeredCourses.filter((c) => c.id !== courseId))
   }

  const handleSubmitRegistration = async () => {
    if (!maSinhVien) {
      setSubmitError("Vui lòng đăng nhập để đăng ký.")
      return
    }

    setSubmitError(null)
    setSubmitSuccess(null)
    setIsSubmitting(true)

    try {
      const newRegistrations = registeredCourses.filter((c) => !c.registrationId)

      if (newRegistrations.length === 0) {
        setIsSubmitting(false)
        return
      }

      let hasError = false
      for (const course of newRegistrations) {
        try {
          await DangKyService.createDangKy({
            maSinhVien,
            maLopHocPhan: course.id
          })
        } catch {
          hasError = true
        }
      }

      if (hasError) {
        setSubmitError("Có lỗi xảy ra khi đăng ký một số môn học. Vui lòng kiểm tra lại.")
      } else {
        setSubmitSuccess("Đăng ký thành công!")
        setTimeout(() => setSubmitSuccess(null), 5000)
      }

      await refreshData()

    } catch (error) {
      setSubmitError("Lỗi hệ thống khi đăng ký. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0)

  return (
    <ProtectedRoute requiredRole="student">
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="dang-ky-mon" />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Đăng ký môn học</h1>
            <p className="text-muted-foreground">Học kỳ 2 năm học 2024-2025</p>
          </div>

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
                  conflictingCourseIds={[]}
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
    </ProtectedRoute>
  )
}
