"use client"

import { useEffect, useState } from "react"
import { Bell, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { DashboardNotificationViewModel } from "@/types"

interface NotificationsPanelProps {
  isLoading: boolean
  error?: string
  data?: DashboardNotificationViewModel[]
}

export function NotificationsPanel({ isLoading, error, data }: NotificationsPanelProps) {
  const isError = !!error
  const isEmpty = !data || data.length === 0


  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Bell className="h-5 w-5 text-muted-foreground" />
          Thông báo đăng ký môn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="mt-2 h-2 w-2 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && isEmpty && (
          <Empty className="border border-dashed border-border py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyTitle>Chưa có thông báo</EmptyTitle>
              <EmptyDescription>
                Các hoạt động đăng ký môn và học phí sẽ hiển thị tại đây.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {!isLoading && !isError && !isEmpty &&
          data!.map((notification, index) => (
            <div key={index} className="flex items-start gap-3">
              <span
                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${notification.dotColor}`}
              />
              <div>
                <p className="font-medium text-foreground">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
