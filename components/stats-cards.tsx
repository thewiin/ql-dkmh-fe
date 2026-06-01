import { BookOpen, TrendingUp, DollarSign, CalendarCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    label: "Tín chỉ đã đăng ký",
    value: "18",
    subtext: "Học kỳ 1/2024",
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "GPA hiện tại",
    value: "3.85",
    subtext: "Tăng 0.05 điểm",
    icon: TrendingUp,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Học phí còn nợ",
    value: "0đ",
    subtext: "Đã thanh toán đủ",
    icon: DollarSign,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Tín chỉ tích lũy",
    value: "108",
    subtext: "Còn 12 tín chỉ",
    icon: CalendarCheck,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
