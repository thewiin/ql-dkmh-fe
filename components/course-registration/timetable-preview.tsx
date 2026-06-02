"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import type { RegisteredCourseItem } from "@/types"

interface TimetablePreviewProps {
  courses: RegisteredCourseItem[]
}

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
const timeSlots = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

const courseColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-pink-500",
]

export function TimetablePreview({ courses }: TimetablePreviewProps) {
  const getTimeIndex = (time: string) => {
    return timeSlots.findIndex((t) => t === time)
  }

  const getSlotSpan = (startTime: string, endTime: string) => {
    const startIndex = getTimeIndex(startTime)
    const endIndex = getTimeIndex(endTime)
    return endIndex - startIndex
  }

  const getCourseColor = (courseId: string) => {
    const index = courses.findIndex((c) => c.id === courseId)
    return courseColors[index % courseColors.length]
  }

  const getCourseAtSlot = (day: number, timeSlot: string) => {
    for (const course of courses) {
      for (const schedule of course.schedule) {
        if (schedule.day === day) {
          const startIndex = getTimeIndex(schedule.startTime)
          const endIndex = getTimeIndex(schedule.endTime)
          const currentIndex = getTimeIndex(timeSlot)

          if (currentIndex >= startIndex && currentIndex < endIndex) {
            return {
              course,
              schedule,
              isStart: currentIndex === startIndex,
              span: endIndex - startIndex,
            }
          }
        }
      }
    }
    return null
  }

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Xem trước thời khóa biểu
        </CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Chưa có môn học nào được đăng ký</p>
            <p className="text-sm">Đăng ký môn học để xem thời khóa biểu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Header */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                <div className="text-xs font-medium text-muted-foreground p-1"></div>
                {[2, 3, 4, 5, 6, 7, 1].map((day) => (
                  <div
                    key={day}
                    className="text-xs font-medium text-center p-1 bg-muted rounded"
                  >
                    {dayNames[day === 1 ? 0 : day]}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className="space-y-0.5">
                {timeSlots.slice(0, -1).map((timeSlot, timeIndex) => (
                  <div key={timeSlot} className="grid grid-cols-7 gap-1">
                    <div className="text-[10px] text-muted-foreground p-1 text-right">
                      {timeIndex % 2 === 0 ? timeSlot : ""}
                    </div>
                    {[2, 3, 4, 5, 6, 7, 1].map((day) => {
                      const slotData = getCourseAtSlot(day, timeSlot)

                      if (slotData && slotData.isStart) {
                        return (
                          <div
                            key={`${day}-${timeSlot}`}
                            className={`${getCourseColor(slotData.course.id)} text-white rounded text-[10px] p-1 overflow-hidden`}
                            style={{
                              gridRow: `span ${slotData.span}`,
                              minHeight: `${slotData.span * 20}px`,
                            }}
                          >
                            <div className="font-medium truncate">
                              {slotData.course.code}
                            </div>
                            <div className="truncate opacity-90">
                              {slotData.schedule.room}
                            </div>
                          </div>
                        )
                      }

                      if (slotData && !slotData.isStart) {
                        return null
                      }

                      return (
                        <div
                          key={`${day}-${timeSlot}`}
                          className="bg-muted/30 rounded min-h-[20px]"
                        />
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  Môn đã đăng ký:
                </p>
                <div className="flex flex-wrap gap-2">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className={`w-3 h-3 rounded ${getCourseColor(course.id)}`}
                      />
                      <span>{course.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
