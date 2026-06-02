"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    sourceClass: z.string().min(1, "Vui lòng chọn lớp nguồn"),
    targetClass: z.string().min(1, "Vui lòng chọn lớp đích"),
  })
  .refine((data) => data.sourceClass !== data.targetClass, {
    message: "Lớp đích không được trùng với lớp nguồn",
    path: ["targetClass"],
  });

type MergeClassFormValues = z.infer<typeof formSchema>;

export interface MergeClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes?: Array<{
    id: string;
    name: string;
    currentStudents: number;
    maxCapacity: number;
  }>;
  defaultSourceClassId?: string;
  defaultTargetClassId?: string;
  lockTargetClass?: boolean;
  onMerge?: (sourceClassId: string, targetClassId: string) => Promise<void>;
}

const defaultDummyClasses = [
  { id: "LHP001", name: "Lập trình Web nâng cao - LHP001", currentStudents: 30, maxCapacity: 50 },
  { id: "LHP002", name: "Cấu trúc dữ liệu và giải thuật - LHP002", currentStudents: 45, maxCapacity: 60 },
  { id: "LHP003", name: "Hệ điều hành - LHP003", currentStudents: 20, maxCapacity: 40 },
];

export function MergeClassDialog({
  open,
  onOpenChange,
  classes = defaultDummyClasses,
  defaultSourceClassId,
  defaultTargetClassId,
  lockTargetClass = false,
  onMerge,
}: MergeClassDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<MergeClassFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceClass: "",
      targetClass: "",
    },
  });

  // Reset form when dialog opens/closes or when defaultSourceClassId changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        sourceClass: defaultSourceClassId || "",
        targetClass: defaultTargetClassId || "",
      });
    }
  }, [open, defaultSourceClassId, defaultTargetClassId, form]);

  async function onSubmit(values: MergeClassFormValues) {
    setIsLoading(true);
    try {
      if (onMerge) {
        await onMerge(values.sourceClass, values.targetClass);
      } else {
        // Simulate API call delay as fallback/mock
        console.log("Merging classes:", values);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi gộp lớp:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const watchSourceClass = form.watch("sourceClass");
  const watchTargetClass = form.watch("targetClass");

  const sourceClassInfo = classes.find((c) => c.id === watchSourceClass);
  const targetClassInfo = classes.find((c) => c.id === watchTargetClass);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Hợp nhất Lớp học</DialogTitle>
          <DialogDescription>
            Chọn lớp nguồn và lớp đích để thực hiện gộp lớp. Toàn bộ sinh viên lớp nguồn sẽ được chuyển sang lớp đích.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Source Class field */}
            <FormField
              control={form.control}
              name="sourceClass"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold">Lớp nguồn (Chuyển đi)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lớp học phần nguồn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source Class Display Info */}
            {sourceClassInfo && (
              <div className="rounded-lg border bg-muted/40 p-3 text-sm space-y-1">
                <div className="font-medium text-muted-foreground mb-1">Thông tin lớp nguồn:</div>
                <div className="flex justify-between">
                  <span>Số sinh viên hiện tại:</span>
                  <span className="font-semibold text-foreground">
                    {sourceClassInfo.currentStudents} sinh viên
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sức chứa tối đa:</span>
                  <span className="font-semibold text-foreground">
                    {sourceClassInfo.maxCapacity} sinh viên
                  </span>
                </div>
              </div>
            )}

            {/* Target Class field */}
            <FormField
              control={form.control}
              name="targetClass"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold">Lớp đích (Nhận vào)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || lockTargetClass}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lớp học phần đích" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes
                        .filter((cls) => cls.id !== watchSourceClass) // Filter out source class to make it user-friendly
                        .map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Class Display Info */}
            {targetClassInfo && (
              <div className="rounded-lg border bg-muted/40 p-3 text-sm space-y-1">
                <div className="font-medium text-muted-foreground mb-1">Thông tin lớp đích:</div>
                <div className="flex justify-between">
                  <span>Số sinh viên hiện tại:</span>
                  <span className="font-semibold text-foreground">
                    {targetClassInfo.currentStudents} sinh viên
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sức chứa tối đa:</span>
                  <span className="font-semibold text-foreground">
                    {targetClassInfo.maxCapacity} sinh viên
                  </span>
                </div>
                {sourceClassInfo && (
                  <div className="pt-2 border-t mt-2 flex justify-between font-medium">
                    <span>Sĩ số sau khi gộp:</span>
                    <span
                      className={cn(
                        targetClassInfo.currentStudents + sourceClassInfo.currentStudents >
                          targetClassInfo.maxCapacity
                          ? "text-destructive font-bold"
                          : "text-green-600 font-bold"
                      )}
                    >
                      {targetClassInfo.currentStudents + sourceClassInfo.currentStudents} /{" "}
                      {targetClassInfo.maxCapacity}
                    </span>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                Hợp nhất lớp
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
