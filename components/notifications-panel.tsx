import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const notifications = [
  {
    title: "Mở đăng ký học kỳ 2/2024",
    time: "2 giờ trước",
    type: "info",
    dotColor: "bg-blue-500",
  },
  {
    title: "Nhắc nhở nộp học phí",
    time: "1 ngày trước",
    type: "warning",
    dotColor: "bg-amber-500",
  },
  {
    title: "Kết quả thi giữa kỳ đã công bố",
    time: "3 ngày trước",
    type: "success",
    dotColor: "bg-green-500",
  },
]

export function NotificationsPanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Bell className="h-5 w-5 text-muted-foreground" />
          Thông báo đăng ký môn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${notification.dotColor}`} />
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
