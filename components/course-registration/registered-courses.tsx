"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle, Trash2, GraduationCap } from "lucide-react"
import type { RegisteredCourse } from "@/app/dang-ky-mon/page"

interface RegisteredCoursesProps {
  courses: RegisteredCourse[]
  totalCredits: number
  onUnregister: (courseId: string) => void
}

const dayNames = ["", "CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export function RegisteredCourses({
  courses,
  totalCredits,
  onUnregister,
}: RegisteredCoursesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Môn học đã đăng ký
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            <GraduationCap className="h-4 w-4 mr-1" />
            Tổng: {totalCredits} tín chỉ
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>Chưa có môn học nào được đăng ký</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Mã môn</TableHead>
                  <TableHead>Tên môn học</TableHead>
                  <TableHead className="text-center">TC</TableHead>
                  <TableHead>Lịch học</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead className="text-center w-[100px]">Hủy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {course.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell className="text-center">{course.credits}</TableCell>
                    <TableCell>
                      {course.schedule.map((s, idx) => (
                        <div key={idx} className="text-sm">
                          {dayNames[s.day]} {s.startTime}-{s.endTime}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {course.schedule.map((s, idx) => (
                        <div key={idx} className="text-sm">
                          {s.room}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onUnregister(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
