"use client"

import { useEffect, useState } from "react"
import { Clock, AlertCircle } from "lucide-react"
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
import DashboardService from "@/services/dashboard.service"
import type { ScheduleItemViewModel } from "@/types"

type LoadState = "loading" | "error" | "empty" | "success"

export function SchedulePanel() {
  const [state, setState] = useState<LoadState>("loading")
  const [scheduleItems, setScheduleItems] = useState<ScheduleItemViewModel[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState("loading")
      setErrorMessage("")
      try {
        const data = await DashboardService.getWeeklySchedule()
        if (cancelled) return
        if (data.length === 0) {
          setState("empty")
          return
        }
        setScheduleItems(data)
        setState("success")
      } catch {
        if (cancelled) return
        setErrorMessage(
          "Không thể tải lịch học. Vui lòng đăng nhập lại hoặc thử sau."
        )
        setState("error")
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Lịch học tuần này
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {state === "loading" &&
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-lg" />
          ))}

        {state === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {state === "empty" && (
          <Empty className="border border-dashed border-border py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Clock />
              </EmptyMedia>
              <EmptyTitle>Chưa có lịch học</EmptyTitle>
              <EmptyDescription>
                Backend chưa cung cấp API thời khóa biểu. Lịch sẽ hiển thị khi có dữ liệu
                lớp học phần.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {state === "success" &&
          scheduleItems.map((item, index) => (
            <div
              key={`${item.subject}-${index}`}
              className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{item.subject}</h4>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {item.time}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.room}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${item.dayColor}`}
                >
                  {item.day}
                </span>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
