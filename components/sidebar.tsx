"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  DollarSign,
  Award,
  User,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", id: "dashboard" },
  { icon: BookOpen, label: "Đăng ký môn", href: "/dang-ky-mon", id: "dang-ky-mon" },
  { icon: Calendar, label: "Thời khóa biểu", href: "/thoi-khoa-bieu", id: "thoi-khoa-bieu" },
  { icon: DollarSign, label: "Học phí", href: "/hoc-phi", id: "hoc-phi" },
  { icon: Award, label: "Kết quả học tập", href: "/ket-qua-hoc-tap", id: "ket-qua" },
  { icon: User, label: "Hồ sơ cá nhân", href: "/ho-so", id: "ho-so" },
]

interface SidebarProps {
  activePage?: string
}

export function Sidebar({ activePage = "dashboard" }: SidebarProps) {
  const { user } = useAuth()
  const [maSv, setMaSv] = useState("Đang tải...")

  useEffect(() => {
    const cachedMaSv = localStorage.getItem("ma_sinh_vien")
    if (cachedMaSv) {
      setMaSv(cachedMaSv)
    } else {
      setMaSv("")
    }
  }, [])

  const displayName = user?.name || "Sinh viên"
  const nameParts = displayName.split(" ")
  const initials = nameParts.length > 1 
    ? (nameParts[nameParts.length - 2][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : displayName.substring(0, 2).toUpperCase()

  return (
    <aside className="sticky left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">PNUni</h1>
          <p className="text-xs text-sidebar-foreground/70">Portal Sinh Viên</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-sidebar"
                      : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/70">{maSv}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
