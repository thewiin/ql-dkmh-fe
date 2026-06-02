"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Bell,
  BarChart3,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", id: "dashboard" },
  { icon: Users, label: "Quản lý sinh viên", href: "/admin/sinh-vien", id: "sinh-vien" },
  { icon: GraduationCap, label: "Quản lý giảng viên", href: "/admin/giang-vien", id: "giang-vien" },
  { icon: BookOpen, label: "Quản lý môn học", href: "/admin/mon-hoc", id: "mon-hoc" },
  { icon: Calendar, label: "Lớp học phần", href: "/admin/quan-ly-lop", id: "classes" },
  { icon: DollarSign, label: "Quản lý học phí", href: "/admin/hoc-phi", id: "hoc-phi" },
  { icon: BarChart3, label: "Báo cáo thống kê", href: "/admin/bao-cao", id: "bao-cao" },
  { icon: FileText, label: "Thông báo", href: "/admin/thong-bao", id: "thong-bao" },
  { icon: Settings, label: "Cài đặt hệ thống", href: "/admin/cai-dat", id: "cai-dat" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">PNUni</h1>
          <p className="text-xs text-slate-400">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
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

      {/* Admin Profile */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin System</p>
            <p className="text-xs text-slate-400 truncate">admin@pnuni.edu.vn</p>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
