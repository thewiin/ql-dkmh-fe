"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const gpaData = [
  { semester: "HK1", gpa: 3.2 },
  { semester: "HK2", gpa: 3.5 },
  { semester: "HK3", gpa: 3.6 },
  { semester: "HK4", gpa: 3.7 },
  { semester: "HK5", gpa: 3.8 },
  { semester: "HK6", gpa: 3.85 },
]

export function GPAChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Biểu đồ GPA theo học kỳ
        </CardTitle>
        <CardDescription>Theo dõi tiến độ học tập của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tiến độ hoàn thành chương trình</span>
            <span className="text-sm font-semibold text-primary">90%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
              style={{ width: "90%" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">108/120 tín chỉ đã hoàn thành</p>
        </div>
      </CardContent>
    </Card>
  )
}
