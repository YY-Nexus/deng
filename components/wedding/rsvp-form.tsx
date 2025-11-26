"use client"

// 任务卡 06：RSVP 表单与来宾管理
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { User, Phone, Users, Utensils, MessageSquare, Send, Check, Loader2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// RSVP 表单数据类型
interface RSVPFormData {
  name: string
  phone: string
  attendStatus: "attending" | "not-attending" | "undecided"
  guestCount: number
  dietaryPreference: "none" | "vegetarian" | "halal" | "other"
  dietaryNote?: string
  seatPreference: "front" | "middle" | "back" | "no-preference"
  needsChildSeat: boolean
  needsWheelchairAccess: boolean
  message?: string
}

// 表单状态
type FormStatus = "idle" | "saving" | "saved" | "submitting" | "submitted" | "error"

interface RSVPFormProps {
  className?: string
  onSubmit?: (data: RSVPFormData) => Promise<void>
}

export function RSVPForm({ className, onSubmit }: RSVPFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<RSVPFormData>({
    defaultValues: {
      name: "",
      phone: "",
      attendStatus: "undecided",
      guestCount: 1,
      dietaryPreference: "none",
      seatPreference: "no-preference",
      needsChildSeat: false,
      needsWheelchairAccess: false,
      message: "",
    },
  })

  const attendStatus = watch("attendStatus")
  const dietaryPreference = watch("dietaryPreference")

  // 保存草稿
  const saveDraft = useCallback(async () => {
    setStatus("saving")
    // 模拟保存到 localStorage
    const formData = watch()
    localStorage.setItem("rsvp_draft", JSON.stringify(formData))
    await new Promise((r) => setTimeout(r, 500))
    setStatus("saved")
    setTimeout(() => setStatus("idle"), 2000)
  }, [watch])

  // 提交表单
  const onFormSubmit = async (data: RSVPFormData) => {
    setStatus("submitting")
    setErrorMessage("")

    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // 模拟 API 请求
        await new Promise((r) => setTimeout(r, 1500))
      }
      setStatus("submitted")
      localStorage.removeItem("rsvp_draft")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "提交失败，请稍后重试")
    }
  }

  // 已提交状态
  if (status === "submitted") {
    return (
      <div className={cn("p-8 rounded-2xl bg-graphite-800/50 border border-gold-500/20 text-center", className)}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/20 flex items-center justify-center">
          <Check className="h-8 w-8 text-gold-400" />
        </div>
        <h3 className="text-xl font-medium text-gold-100 mb-2">回执已提交</h3>
        <p className="text-gold-400/70">感谢您的回复，我们期待与您相聚！</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={cn("space-y-6", className)}>
      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 姓名 */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gold-300 flex items-center gap-2">
            <User className="h-4 w-4" />
            姓名 <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="请输入您的姓名"
            className="bg-graphite-700/50 border-gold-500/20 text-gold-100 placeholder:text-gold-400/40 focus:border-gold-500"
            {...register("name", { required: "请输入姓名" })}
          />
          {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
        </div>

        {/* 电话 */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gold-300 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            手机号 <span className="text-red-400">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="请输入手机号"
            className="bg-graphite-700/50 border-gold-500/20 text-gold-100 placeholder:text-gold-400/40 focus:border-gold-500"
            {...register("phone", {
              required: "请输入手机号",
              pattern: {
                value: /^1[3-9]\d{9}$/,
                message: "请输入有效的手机号",
              },
            })}
          />
          {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
        </div>
      </div>

      {/* 出席状态 */}
      <div className="space-y-3">
        <Label className="text-gold-300">是否出席</Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "attending", label: "出席", emoji: "🎉" },
            { value: "not-attending", label: "无法出席", emoji: "😢" },
            { value: "undecided", label: "待定", emoji: "🤔" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("attendStatus", option.value as RSVPFormData["attendStatus"])}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                attendStatus === option.value
                  ? "border-gold-500 bg-gold-500/20"
                  : "border-gold-500/20 bg-graphite-700/30 hover:border-gold-500/40",
              )}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-gold-100 text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 出席详情（仅在选择出席时显示） */}
      {attendStatus === "attending" && (
        <>
          {/* 人数 */}
          <div className="space-y-2">
            <Label htmlFor="guestCount" className="text-gold-300 flex items-center gap-2">
              <Users className="h-4 w-4" />
              出席人数
            </Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const current = watch("guestCount")
                  if (current > 1) setValue("guestCount", current - 1)
                }}
                className="w-10 h-10 rounded-lg bg-graphite-700/50 border border-gold-500/20 text-gold-300 hover:border-gold-500/40 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-xl font-medium text-gold-100">{watch("guestCount")}</span>
              <button
                type="button"
                onClick={() => {
                  const current = watch("guestCount")
                  if (current < 10) setValue("guestCount", current + 1)
                }}
                className="w-10 h-10 rounded-lg bg-graphite-700/50 border border-gold-500/20 text-gold-300 hover:border-gold-500/40 transition-colors"
              >
                +
              </button>
              <span className="text-gold-400/60 text-sm ml-2">位宾客</span>
            </div>
          </div>

          {/* 餐饮偏好 */}
          <div className="space-y-3">
            <Label className="text-gold-300 flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              餐饮偏好
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "none", label: "无特殊要求" },
                { value: "vegetarian", label: "素食" },
                { value: "halal", label: "清真" },
                { value: "other", label: "其他" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("dietaryPreference", option.value as RSVPFormData["dietaryPreference"])}
                  className={cn(
                    "p-3 rounded-lg border text-sm transition-all",
                    dietaryPreference === option.value
                      ? "border-gold-500 bg-gold-500/20 text-gold-100"
                      : "border-gold-500/20 bg-graphite-700/30 text-gold-300 hover:border-gold-500/40",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {dietaryPreference === "other" && (
              <Input
                placeholder="请说明您的饮食要求"
                className="bg-graphite-700/50 border-gold-500/20 text-gold-100 placeholder:text-gold-400/40"
                {...register("dietaryNote")}
              />
            )}
          </div>

          {/* 特殊需求 */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gold-500/30 bg-graphite-700/50 text-gold-500 focus:ring-gold-500/50"
                {...register("needsChildSeat")}
              />
              <span className="text-gold-300 text-sm">需要儿童座椅</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gold-500/30 bg-graphite-700/50 text-gold-500 focus:ring-gold-500/50"
                {...register("needsWheelchairAccess")}
              />
              <span className="text-gold-300 text-sm">需要无障碍通道</span>
            </label>
          </div>
        </>
      )}

      {/* 祝福留言 */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gold-300 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          祝福留言（选填）
        </Label>
        <Textarea
          id="message"
          placeholder="写下您对新人的祝福..."
          rows={3}
          className="bg-graphite-700/50 border-gold-500/20 text-gold-100 placeholder:text-gold-400/40 focus:border-gold-500 resize-none"
          {...register("message")}
        />
      </div>

      {/* 错误提示 */}
      {status === "error" && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{errorMessage}</div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={saveDraft}
          disabled={!isDirty || status === "saving" || status === "submitting"}
          className="flex-1 border-gold-500/30 text-gold-300 hover:bg-gold-500/10 bg-transparent"
        >
          {status === "saving" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : status === "saved" ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {status === "saved" ? "已保存" : "保存草稿"}
        </Button>
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="flex-1 bg-gold-500 hover:bg-gold-400 text-graphite-900"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {status === "submitting" ? "提交中..." : "提交回执"}
        </Button>
      </div>

      {/* 隐私提示 */}
      <p className="text-gold-400/50 text-xs text-center">您的信息仅用于婚礼安排，我们会妥善保管</p>
    </form>
  )
}
