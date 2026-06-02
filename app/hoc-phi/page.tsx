"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Wallet,
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Eye,
  SplitSquareVertical,
  Banknote,
  Building2,
  QrCode,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Calendar,
  Printer,
  Loader2,
} from "lucide-react"
import PaymentService from "@/services/payment.service"
import { TuitionSummaryViewModel, TuitionCourseItem, TuitionFeeItem, PaymentHistoryItem, InvoiceItem } from "@/types"
import AuthService from "@/services/auth.service"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "paid":
      return { label: "Đã thanh toán", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 }
    case "partial":
      return { label: "Thanh toán một phần", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock }
    case "unpaid":
      return { label: "Chưa thanh toán", color: "bg-slate-100 text-slate-700 border-slate-200", icon: AlertCircle }
    case "overdue":
      return { label: "Quá hạn", color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle }
    default:
      return { label: status, color: "bg-slate-100 text-slate-700 border-slate-200", icon: Clock }
  }
}

export default function TuitionPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank")
  const [splitCount, setSplitCount] = useState(2)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false)

  // State for API data
  const [tuitionSummary, setTuitionSummary] = useState<TuitionSummaryViewModel | null>(null)
  const [courseTuition, setCourseTuition] = useState<TuitionCourseItem[]>([])
  const [otherFees, setOtherFees] = useState<TuitionFeeItem[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])

  // Loading, error states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tuition data
  useEffect(() => {
    const fetchTuitionData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const profile = await AuthService.getProfile()
        const data = await PaymentService.getTuitionSummary()
        setTuitionSummary(data)
        setCourseTuition(data.courseTuition || [])
        setOtherFees(data.otherFees || [])
        if (profile.maSinhVien) {
          const history = await PaymentService.getTuitionHistory(profile.maSinhVien)
          setPaymentHistory(history)
          setInvoices(
            history.map((payment) => ({
              id: payment.id,
              number: payment.reference || `INV-${payment.id}`,
              date: payment.date,
              amount: payment.amount,
              semester: data.semester,
              status: payment.status === "success" ? "paid" : payment.status,
            }))
          )
        } else {
          setPaymentHistory([])
          setInvoices([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu học phí")
        setTuitionSummary(null)
        setCourseTuition([])
        setOtherFees([])
        setPaymentHistory([])
        setInvoices([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTuitionData()
  }, [])

  // Guard: show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activePage="hoc-phi" />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">Đang tải dữ liệu học phí...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Guard: show error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activePage="hoc-phi" />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <Card className="border-0 shadow-sm max-w-md">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Lỗi</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Thử lại</Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  // Guard: show empty state
  if (!tuitionSummary) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activePage="hoc-phi" />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <Card className="border-0 shadow-sm max-w-md">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Không có dữ liệu</h3>
                <p className="text-muted-foreground mb-4">Không thể tải thông tin học phí. Vui lòng thử lại sau.</p>
                <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(tuitionSummary.status)
  const StatusIcon = statusConfig.icon

  const totalCourseTuition = courseTuition.reduce((sum: number, course: TuitionCourseItem) => sum + course.total, 0)
  const totalOtherFees = otherFees.reduce((sum: number, fee: TuitionFeeItem) => sum + fee.amount, 0)
  const paidPercentage = (tuitionSummary.paidAmount / tuitionSummary.totalTuition) * 100

  return (
    <ProtectedRoute requiredRole="student">
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="hoc-phi" />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Học phí</h1>
            <p className="text-muted-foreground">Quản lý học phí và thanh toán - {tuitionSummary.semester}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Tuition Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tổng học phí</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(tuitionSummary.totalTuition)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tuitionSummary.semester}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paid Amount Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Đã thanh toán</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(tuitionSummary.paidAmount)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">{paidPercentage.toFixed(0)}% hoàn thành</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remaining Balance Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Còn nợ</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(tuitionSummary.remainingBalance)}</p>
                    {tuitionSummary.remainingBalance > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-amber-600" />
                        <span className="text-xs text-amber-600">Hạn: {tuitionSummary.dueDate}</span>
                      </div>
                    )}
                    {tuitionSummary.remainingBalance === 0 && (
                      <span className="text-xs text-emerald-600">Đã thanh toán đủ</span>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
                    <Badge className={`${statusConfig.color} border mt-1`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">Cập nhật: 10/01/2024</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Progress */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">Tiến độ thanh toán</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(tuitionSummary.paidAmount)} / {formatCurrency(tuitionSummary.totalTuition)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {tuitionSummary.remainingBalance > 0 && (
                    <>
                      <Dialog open={isSplitDialogOpen} onOpenChange={setIsSplitDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <SplitSquareVertical className="h-4 w-4 mr-2" />
                            Chia nhỏ thanh toán
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Chia nhỏ thanh toán</DialogTitle>
                            <DialogDescription>
                              Chia số tiền còn nợ thành nhiều đợt thanh toán
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Số đợt thanh toán</Label>
                              <RadioGroup value={splitCount.toString()} onValueChange={(v) => setSplitCount(parseInt(v))}>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="2" id="split-2" />
                                  <Label htmlFor="split-2">2 đợt ({formatCurrency(tuitionSummary.remainingBalance / 2)} / đợt)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="3" id="split-3" />
                                  <Label htmlFor="split-3">3 đợt ({formatCurrency(tuitionSummary.remainingBalance / 3)} / đợt)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="4" id="split-4" />
                                  <Label htmlFor="split-4">4 đợt ({formatCurrency(tuitionSummary.remainingBalance / 4)} / đợt)</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                              <p className="text-sm font-medium mb-2">Lịch thanh toán dự kiến:</p>
                              {Array.from({ length: splitCount }, (_, i) => (
                                <div key={i} className="flex justify-between text-sm py-1">
                                  <span>Đợt {i + 1}</span>
                                  <span className="font-medium">{formatCurrency(tuitionSummary.remainingBalance / splitCount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsSplitDialogOpen(false)}>Hủy</Button>
                            <Button onClick={() => setIsSplitDialogOpen(false)}>Xác nhận</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Thanh toán ngay
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Thanh toán học phí</DialogTitle>
                            <DialogDescription>
                              Chọn phương thức thanh toán phù hợp với bạn
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-muted p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Số tiền cần thanh toán</span>
                                <span className="text-xl font-bold text-primary">{formatCurrency(tuitionSummary.remainingBalance)}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Phương thức thanh toán</Label>
                              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                                <div className="grid grid-cols-1 gap-2">
                                  <Label htmlFor="bank" className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                    <RadioGroupItem value="bank" id="bank" />
                                    <Building2 className="h-5 w-5 text-primary" />
                                    <div>
                                      <p className="font-medium">Chuyển khoản ngân hàng</p>
                                      <p className="text-xs text-muted-foreground">Chuyển khoản qua tài khoản ngân hàng</p>
                                    </div>
                                  </Label>
                                  <Label htmlFor="card" className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                    <RadioGroupItem value="card" id="card" />
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <div>
                                      <p className="font-medium">Thẻ tín dụng / Ghi nợ</p>
                                      <p className="text-xs text-muted-foreground">Visa, Mastercard, JCB</p>
                                    </div>
                                  </Label>
                                  <Label htmlFor="qr" className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                    <RadioGroupItem value="qr" id="qr" />
                                    <QrCode className="h-5 w-5 text-primary" />
                                    <div>
                                      <p className="font-medium">Quét mã QR</p>
                                      <p className="text-xs text-muted-foreground">VNPay, MoMo, ZaloPay</p>
                                    </div>
                                  </Label>
                                  <Label htmlFor="cash" className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                    <RadioGroupItem value="cash" id="cash" />
                                    <Banknote className="h-5 w-5 text-primary" />
                                    <div>
                                      <p className="font-medium">Tiền mặt</p>
                                      <p className="text-xs text-muted-foreground">Thanh toán tại phòng Tài vụ</p>
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {selectedPaymentMethod === "bank" && (
                              <div className="rounded-lg border p-4 space-y-2">
                                <p className="font-medium text-sm">Thông tin chuyển khoản:</p>
                                <div className="space-y-1 text-sm">
                                  <p><span className="text-muted-foreground">Ngân hàng:</span> Vietcombank</p>
                                  <p><span className="text-muted-foreground">Số tài khoản:</span> 1234567890</p>
                                  <p><span className="text-muted-foreground">Chủ tài khoản:</span> Trường Đại học PNU</p>
                                  <p><span className="text-muted-foreground">Nội dung:</span> SV2024001 HP HK2 2024</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Hủy</Button>
                            <Button onClick={() => setIsPaymentDialogOpen(false)}>Tiếp tục thanh toán</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
              <Progress value={paidPercentage} className="h-3" />
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="breakdown" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="breakdown">Chi tiết học phí</TabsTrigger>
              <TabsTrigger value="history">Lịch sử thanh toán</TabsTrigger>
              <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
            </TabsList>

            {/* Tuition Breakdown Tab */}
            <TabsContent value="breakdown" className="space-y-4">
              {/* Course Tuition Table */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Học phí theo môn học</CardTitle>
                  <CardDescription>Chi tiết học phí từng môn đăng ký trong học kỳ</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã môn</TableHead>
                        <TableHead>Tên môn học</TableHead>
                        <TableHead className="text-center">Số tín chỉ</TableHead>
                        <TableHead className="text-right">Đơn giá/TC</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseTuition.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell className="text-center">{course.credits}</TableCell>
                          <TableCell className="text-right">{formatCurrency(course.pricePerCredit)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(course.total)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Đã thanh toán
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/30 font-medium">
                        <TableCell colSpan={4}>Tổng học phí môn học</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalCourseTuition)}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Other Fees Table */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Các khoản phí khác</CardTitle>
                  <CardDescription>Bảo hiểm, phí thư viện và các khoản phí bắt buộc khác</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khoản phí</TableHead>
                        <TableHead className="text-right">Số tiền</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {otherFees.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell>{fee.name}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(fee.amount)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Đã thanh toán
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/30 font-medium">
                        <TableCell>Tổng phí khác</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalOtherFees)}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Total Summary Card */}
              <Card className="border-0 shadow-sm bg-primary/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng cộng tất cả các khoản</p>
                      <p className="text-3xl font-bold text-primary">{formatCurrency(tuitionSummary.totalTuition)}</p>
                    </div>
                    <Badge className={`${statusConfig.color} border text-sm py-1 px-3`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment History Tab */}
            <TabsContent value="history">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Lịch sử thanh toán</CardTitle>
                  <CardDescription>Tất cả các giao dịch thanh toán học phí của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Mã giao dịch</TableHead>
                        <TableHead>Phương thức</TableHead>
                        <TableHead className="text-right">Số tiền</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {payment.date}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{payment.reference}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {payment.method === "Chuyển khoản" && <Building2 className="h-4 w-4 text-primary" />}
                              {payment.method === "Thẻ tín dụng" && <CreditCard className="h-4 w-4 text-primary" />}
                              {payment.method === "Tiền mặt" && <Banknote className="h-4 w-4 text-primary" />}
                              {payment.method}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium text-emerald-600">{formatCurrency(payment.amount)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Thành công
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices">
              {invoices.length === 0 && (
                <Card className="border-0 shadow-sm mb-4">
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    Chưa có dữ liệu hóa đơn từ backend.
                  </CardContent>
                </Card>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{invoice.number}</p>
                            <p className="text-sm text-muted-foreground">{invoice.semester}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Đã thanh toán
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ngày xuất</span>
                          <span>{invoice.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Số tiền</span>
                          <span className="font-semibold text-primary">{formatCurrency(invoice.amount)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Tải về
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
