"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { WelcomeBanner } from "@/components/welcome-banner"
import { StatsCards } from "@/components/stats-cards"
import { GPAChart } from "@/components/gpa-chart"
import { SchedulePanel } from "@/components/schedule-panel"
import { NotificationsPanel } from "@/components/notifications-panel"
import { ProtectedRoute } from "@/components/auth/protected-route"
import DashboardService from "@/services/dashboard.service"
import type { StudentDashboardResponse } from "@/types"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<StudentDashboardResponse | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setIsLoading(true)
      setError(undefined)
      try {
        const studentId = await DashboardService.getCurrentStudentId()
        const dashboardData = await DashboardService.getStudentDashboard(studentId)
        
        if (cancelled) return
        setData(dashboardData)
      } catch {
        if (cancelled) return
        setError("Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.")
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadDashboard()
    
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ProtectedRoute requiredRole="student">
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar activePage="dashboard" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Stats Cards */}
            <div className="mt-6">
              <StatsCards 
                isLoading={isLoading} 
                error={error} 
                data={data?.stats} 
              />
            </div>

            {/* Main Grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Left Column - Charts */}
              <div className="space-y-6 lg:col-span-2">
                <GPAChart 
                  isLoading={isLoading} 
                  error={error} 
                  data={data?.gpaChart} 
                />
                <NotificationsPanel 
                  isLoading={isLoading} 
                  error={error} 
                  data={data?.notifications} 
                />
              </div>

              {/* Right Column - Schedule */}
              <div className="lg:col-span-1">
                <SchedulePanel 
                  isLoading={isLoading} 
                  error={error} 
                  data={data?.schedule} 
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
