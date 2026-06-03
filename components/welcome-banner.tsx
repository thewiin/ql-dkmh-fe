"use client"

import { useAuth } from "@/hooks/use-auth"

export function WelcomeBanner() {
  const { user } = useAuth()
  const displayName = user?.name || "Sinh viên"

  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-400 p-6 text-white">
      <h2 className="text-2xl font-bold">
        Xin chào, {displayName}! <span className="ml-1">👋</span>
      </h2>
      <p className="mt-2 text-white/90">
        Chào mừng trở lại portal sinh viên. Hãy kiểm tra lịch học và cập nhật mới nhất của bạn.
      </p>
    </div>
  )
}
