import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LopHocPhanApi } from "@/types"
import LopHocPhanService from "@/services/lopHocPhan.service"

interface ClassFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editingClass: LopHocPhanApi | null
}

export function ClassFormDialog({ open, onOpenChange, onSuccess, editingClass }: ClassFormDialogProps) {
  const [formData, setFormData] = useState({
    maMonHoc: "",
    namHoc: "2024",
    hocKy: 2,
    soLuongToiDa: 40,
    trangThai: "open",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingClass) {
      setFormData({
        maMonHoc: editingClass.maMH,
        namHoc: editingClass.namHoc,
        hocKy: editingClass.hocKy,
        soLuongToiDa: editingClass.siSoToiDa,
        trangThai: editingClass.trangThai || "open",
      })
    } else {
      setFormData({
        maMonHoc: "",
        namHoc: "2024",
        hocKy: 2,
        soLuongToiDa: 40,
        trangThai: "open",
      })
    }
  }, [editingClass, open])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editingClass) {
        await LopHocPhanService.updateLopHocPhan(editingClass.maLHP, {
          maMonHoc: formData.maMonHoc,
          namHoc: formData.namHoc,
          hocKy: formData.hocKy,
          soLuongToiDa: formData.soLuongToiDa,
          trangThai: formData.trangThai,
        })
      } else {
        await LopHocPhanService.createLopHocPhan({
          maMonHoc: formData.maMonHoc,
          namHoc: formData.namHoc,
          hocKy: formData.hocKy,
          soLuongToiDa: formData.soLuongToiDa,
          trangThai: formData.trangThai,
        })
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Lỗi khi lưu lớp học phần:", error)
      alert("Đã xảy ra lỗi khi lưu. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingClass ? "Chỉnh sửa lớp học phần" : "Thêm lớp học phần mới"}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho lớp học phần. Nhấn lưu để hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mã môn học</label>
            <Input
              value={formData.maMonHoc}
              onChange={(e) => setFormData({ ...formData, maMonHoc: e.target.value })}
              placeholder="VD: CS101"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Năm học</label>
              <Input
                value={formData.namHoc}
                onChange={(e) => setFormData({ ...formData, namHoc: e.target.value })}
                placeholder="VD: 2024"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Học kỳ</label>
              <Input
                type="number"
                value={formData.hocKy}
                onChange={(e) => setFormData({ ...formData, hocKy: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sĩ số tối đa</label>
              <Input
                type="number"
                value={formData.soLuongToiDa}
                onChange={(e) => setFormData({ ...formData, soLuongToiDa: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={formData.trangThai}
                onValueChange={(val) => setFormData({ ...formData, trangThai: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Đang mở</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
                  <SelectItem value="locked">Đã khóa</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.maMonHoc}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
