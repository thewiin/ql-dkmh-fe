import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const scheduleItems = [
  {
    subject: "Lập trình Web",
    day: "Thứ 2",
    time: "07:00 - 09:30",
    room: "Phòng: A101",
    dayColor: "bg-blue-100 text-blue-700",
  },
  {
    subject: "Cơ sở dữ liệu",
    day: "Thứ 3",
    time: "13:00 - 15:30",
    room: "Phòng: B203",
    dayColor: "bg-green-100 text-green-700",
  },
  {
    subject: "Mạng máy tính",
    day: "Thứ 4",
    time: "09:45 - 12:15",
    room: "Phòng: C305",
    dayColor: "bg-orange-100 text-orange-700",
  },
  {
    subject: "Trí tuệ nhân tạo",
    day: "Thứ 5",
    time: "07:00 - 09:30",
    room: "Phòng: D102",
    dayColor: "bg-rose-100 text-rose-700",
  },
]

export function SchedulePanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Lịch học tuần này
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduleItems.map((item, index) => (
          <div
            key={index}
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
