"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CourseFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedSemester: string
  onSemesterChange: (value: string) => void
  selectedDepartment: string
  onDepartmentChange: (value: string) => void
}

export function CourseFilters({
  searchQuery,
  onSearchChange,
  selectedSemester,
  onSemesterChange,
  selectedDepartment,
  onDepartmentChange,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm môn học, mã môn, giảng viên..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedSemester} onValueChange={onSemesterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Chọn học kỳ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2024-2">Học kỳ 2/2024</SelectItem>
          <SelectItem value="2024-1">Học kỳ 1/2024</SelectItem>
          <SelectItem value="2023-2">Học kỳ 2/2023</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Chọn khoa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả khoa</SelectItem>
          <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
          <SelectItem value="Toán">Toán học</SelectItem>
          <SelectItem value="Vật lý">Vật lý</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
