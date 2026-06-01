"use client"

import { Bell, Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sinh viên, môn học, lớp..."
          className="pl-10 bg-muted/50"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Semester Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Học kỳ 2 - 2024
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chọn học kỳ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Học kỳ 2 - 2024</DropdownMenuItem>
            <DropdownMenuItem>Học kỳ 1 - 2024</DropdownMenuItem>
            <DropdownMenuItem>Học kỳ 2 - 2023</DropdownMenuItem>
            <DropdownMenuItem>Học kỳ 1 - 2023</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            5
          </span>
        </Button>
      </div>
    </header>
  )
}
