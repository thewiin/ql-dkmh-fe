"use client"

import { useEffect, useState } from "react"
import { BookOpen, TrendingUp, DollarSign, CalendarCheck, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { StatsCardViewModel } from "@/types"

const STAT_ICONS = [
  { icon: BookOpen, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { icon: TrendingUp, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { icon: DollarSign, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
  { icon: CalendarCheck, iconBg: "bg-rose-100", iconColor: "text-rose-600" },
] as const

interface StatsCardsProps {
  isLoading: boolean
  error?: string
  data?: StatsCardViewModel[]
}

export function StatsCards({ isLoading, error, data }: StatsCardsProps) {
  const isError = !!error
  const isEmpty = !data || data.length === 0

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_ICONS.map((_, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-3 h-9 w-20" />
              <Skeleton className="mt-2 h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isEmpty) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen />
          </EmptyMedia>
          <EmptyTitle>Chưa có thống kê</EmptyTitle>
          <EmptyDescription>
            Đăng ký môn học để xem tín chỉ và học phí trên bảng điều khiển.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data!.map((stat, index) => {
        const iconConfig = STAT_ICONS[index] ?? STAT_ICONS[0]
        const Icon = iconConfig.icon
        return (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconConfig.iconBg}`}
              >
                <Icon className={`h-6 w-6 ${iconConfig.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
