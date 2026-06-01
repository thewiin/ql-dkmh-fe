"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import AuthService from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenDangNhap: "",
    matKhau: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login({
        tenDangNhap: formData.tenDangNhap,
        matKhau: formData.matKhau,
      });
      // Assuming successful login, redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      // TODO: Display a user-friendly error message without modifying UI design significantly
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Đăng ký môn học",
      description: "Đăng ký môn học trực tuyến nhanh chóng",
    },
    {
      icon: Calendar,
      title: "Thời khóa biểu",
      description: "Xem lịch học và quản lý thời gian",
    },
    {
      icon: Award,
      title: "Kết quả học tập",
      description: "Tra cứu điểm và tiến độ học tập",
    },
    {
      icon: Users,
      title: "Hồ sơ sinh viên",
      description: "Quản lý thông tin cá nhân",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PNUni</h1>
              <p className="text-sm text-blue-200">Portal Sinh Vien</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-balance">
                Chao mung den voi
                <br />
                <span className="text-blue-300">Cong thong tin Sinh vien</span>
              </h2>
              <p className="text-blue-200 text-lg max-w-md leading-relaxed">
                He thong quan ly hoc tap toan dien, ho tro sinh vien trong suot
                qua trinh hoc tap tai truong.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-blue-200" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-blue-200">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-blue-200">
            <p>&copy; 2024 PNUni. Moi quyen duoc bao luu.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">PNUni</h1>
              <p className="text-sm text-muted-foreground">Portal Sinh Vien</p>
            </div>
          </div>

          <Card className="border-0 shadow-xl shadow-slate-200/50">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Dang nhap
                </h2>
                <p className="text-muted-foreground">
                  Nhap thong tin tai khoan de truy cap he thong
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Ma sinh vien
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="tenDangNhap"
                      type="text"
                      placeholder="VD: SV2024001"
                      className="pl-10 h-12 bg-[#f1f5f9] border-0 focus-visible:ring-2 focus-visible:ring-[#1e3a5f]"
                      value={formData.tenDangNhap}
                      onChange={(e) =>
                        setFormData({ ...formData, tenDangNhap: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mat khau
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="matKhau"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhap mat khau"
                      className="pl-10 pr-10 h-12 bg-[#f1f5f9] border-0 focus-visible:ring-2 focus-visible:ring-[#1e3a5f]"
                      value={formData.matKhau}
                      onChange={(e) =>
                        setFormData({ ...formData, matKhau: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, remember: checked === true })
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Ghi nho dang nhap
                    </Label>
                  </div>
                  <Link
                    href="/quen-mat-khau"
                    className="text-sm text-[#1e3a5f] hover:underline font-medium"
                  >
                    Quen mat khau?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Dang xu ly...</span>
                    </div>
                  ) : (
                    "Dang nhap"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">
                    Hoac
                  </span>
                </div>
              </div>

              {/* SSO Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 hover:bg-[#f1f5f9]"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Dang nhap bang Google
              </Button>

              {/* Help Text */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Can ho tro?{" "}
                <Link
                  href="/ho-tro"
                  className="text-[#1e3a5f] hover:underline font-medium"
                >
                  Lien he Phong Dao tao
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Bottom Links */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <Link href="/huong-dan" className="hover:text-foreground">
              Huong dan su dung
            </Link>
            <span>|</span>
            <Link href="/dieu-khoan" className="hover:text-foreground">
              Dieu khoan
            </Link>
            <span>|</span>
            <Link href="/bao-mat" className="hover:text-foreground">
              Chinh sach bao mat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
