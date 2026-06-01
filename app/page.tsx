import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { WelcomeBanner } from "@/components/welcome-banner"
import { StatsCards } from "@/components/stats-cards"
import { GPAChart } from "@/components/gpa-chart"
import { SchedulePanel } from "@/components/schedule-panel"
import { NotificationsPanel } from "@/components/notifications-panel"

export default function DashboardPage() {
  return (
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
            <StatsCards />
          </div>

          {/* Main Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Left Column - Charts */}
            <div className="space-y-6 lg:col-span-2">
              <GPAChart />
              <NotificationsPanel />
            </div>

            {/* Right Column - Schedule */}
            <div className="lg:col-span-1">
              <SchedulePanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
