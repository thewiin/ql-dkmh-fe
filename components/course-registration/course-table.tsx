"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookOpen, Clock, MapPin, User, AlertCircle, Check } from "lucide-react"
import type { CourseRegistrationItem } from "@/types"

interface CourseTableProps {
  courses: CourseRegistrationItem[]
  registeredCourseIds: string[]
  onRegister: (course: CourseRegistrationItem) => void
  registrationDisabled?: boolean
}

const dayNames = ["", "CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export function CourseTable({
  courses,
  registeredCourseIds,
  onRegister,
  registrationDisabled = false,
}: CourseTableProps) {
  const getSeatPercentage = (remaining: number, total: number) => {
    return ((total - remaining) / total) * 100
  }

  const getSeatColor = (remaining: number, total: number) => {
    const percentage = getSeatPercentage(remaining, total)
    if (percentage >= 90) return "bg-destructive"
    if (percentage >= 70) return "bg-amber-500"
    return "bg-primary"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Danh sách môn học mở đăng ký
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">Mã môn</TableHead>
                <TableHead>Tên môn học</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead className="text-center">TC</TableHead>
                <TableHead>Lịch học</TableHead>
                <TableHead className="w-[150px]">Chỗ trống</TableHead>
                <TableHead className="text-center w-[120px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                const isRegistered = registeredCourseIds.includes(course.id)
                const isFull = course.remainingSeats === 0
                const seatPercentage = getSeatPercentage(course.remainingSeats, course.totalSeats)

                return (
                  <TableRow
                    key={course.id}
                    className={isFull ? "opacity-60 bg-muted/30" : ""}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {course.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{course.name}</p>
                        {course.prerequisite && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertCircle className="h-3 w-3" />
                            <span>Yêu cầu: {course.prerequisite}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {course.instructor}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {course.credits}
                    </TableCell>
                    <TableCell>
                      {course.schedule.map((s, idx) => (
                        <div key={idx} className="text-sm space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-xs px-1.5">
                              {dayNames[s.day]}
                            </Badge>
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {s.startTime} - {s.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{s.room}</span>
                          </div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={isFull ? "text-destructive font-medium" : ""}>
                            {isFull ? "Hết chỗ" : `${course.remainingSeats}/${course.totalSeats}`}
                          </span>
                          <span className="text-muted-foreground">
                            {Math.round(seatPercentage)}%
                          </span>
                        </div>
                        <Progress
                          value={seatPercentage}
                          className={`h-2 ${getSeatColor(course.remainingSeats, course.totalSeats)}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {isRegistered ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">
                          <Check className="h-3 w-3 mr-1" />
                          Đã đăng ký
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isFull || registrationDisabled}
                          onClick={() => onRegister(course)}
                          className="w-full"
                        >
                          {isFull ? "Hết chỗ" : "Đăng ký"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
