"use client"

import { useEffect, useState } from "react"
import { AlertCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { GpaChartViewModel } from "@/types"

interface GPAChartProps {
  isLoading: boolean
  error?: string
  data?: GpaChartViewModel | null
}

export function GPAChart({ isLoading, error, data }: GPAChartProps) {
  const isError = !!error
  const isEmpty = !data


  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Biểu đồ GPA theo học kỳ
        </CardTitle>
        <CardDescription>Theo dõi tiến độ học tập của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        )}

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && isEmpty && (
          <Empty className="border border-dashed border-border py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrendingUp />
              </EmptyMedia>
              <EmptyTitle>Chưa có dữ liệu GPA</EmptyTitle>
              <EmptyDescription>
                Hệ thống chưa có lịch sử điểm theo học kỳ. Tiến độ tín chỉ sẽ hiển thị
                khi bạn có đăng ký môn học.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {!isLoading && !isError && !isEmpty && data && (
          <>
            {data.history.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.history}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="semester"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      domain={[0, 4]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      ticks={[0, 1, 2, 3, 4]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [value.toFixed(2), "GPA"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="gpa"
                      stroke="hsl(221, 83%, 53%)"
                      strokeWidth={2}
                      fill="url(#gpaGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Chưa có điểm theo học kỳ từ API
                </p>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tiến độ hoàn thành chương trình
                </span>
                <span className="text-sm font-semibold text-primary">
                  {data.progressPercent}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
                  style={{ width: `${data.progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {data.completedCredits}/{data.totalCredits} tín chỉ đã hoàn thành
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
