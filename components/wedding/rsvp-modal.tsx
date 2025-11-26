"use client"

import type React from "react"

import { useState } from "react"
import { DraggableModal } from "@/components/draggable-modal"
import { User, Phone, Users, Utensils, MessageSquare, Send, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RSVPFormData {
  name: string
  phone: string
  attendStatus: "attending" | "not-attending" | "undecided"
  guestCount: number
  dietaryPreference: string
  message: string
}

interface RSVPModalProps {
  open: boolean
  onClose: () => void
}

export function RSVPModal({ open, onClose }: RSVPModalProps) {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: "",
    phone: "",
    attendStatus: "undecided",
    guestCount: 1,
    dietaryPreference: "none",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "请输入姓名"
    if (!formData.phone.trim()) newErrors.phone = "请输入手机号"
    else if (!/^1[3-9]\d{9}$/.test(formData.phone)) newErrors.phone = "请输入有效的手机号"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus("submitting")

    // 模拟 API 提交
    await new Promise((r) => setTimeout(r, 1500))

    // 保存到 localStorage
    const rsvpList = JSON.parse(localStorage.getItem("wedding_rsvp") || "[]")
    rsvpList.push({ ...formData, submittedAt: Date.now() })
    localStorage.setItem("wedding_rsvp", JSON.stringify(rsvpList))

    setStatus("submitted")
  }

  // 已提交状态
  if (status === "submitted") {
    return (
      <DraggableModal open={open} onClose={onClose} title="出席回执 RSVP" width={480} variant="glass-dark">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-gold-400" />
          </div>
          <h3 className="text-xl font-medium text-gold-100 mb-2">回执已提交</h3>
          <p className="text-gold-400/70">感谢您的回复，我们期待与您相聚！</p>
          <button
            onClick={() => {
              setStatus("idle")
              setFormData({
                name: "",
                phone: "",
                attendStatus: "undecided",
                guestCount: 1,
                dietaryPreference: "none",
                message: "",
              })
            }}
            className="mt-6 px-6 py-2 rounded-lg bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 transition-colors"
          >
            提交另一份回执
          </button>
        </div>
      </DraggableModal>
    )
  }

  return (
    <DraggableModal open={open} onClose={onClose} title="出席回执 RSVP" width={520} variant="glass-dark">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-gold-300 text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              姓名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="请输入您的姓名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-graphite-700/50 border border-gold-500/20 
                text-gold-100 placeholder:text-gold-400/40 text-sm
                focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-gold-300 text-sm flex items-center gap-2">
              <Phone className="h-4 w-4" />
              手机号 <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              placeholder="请输入手机号"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-graphite-700/50 border border-gold-500/20 
                text-gold-100 placeholder:text-gold-400/40 text-sm
                focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
            />
            {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
          </div>
        </div>

        {/* 出席状态 */}
        <div className="space-y-3">
          <label className="text-gold-300 text-sm">是否出席</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "attending", label: "出席", emoji: "🎉" },
              { value: "not-attending", label: "无法出席", emoji: "😢" },
              { value: "undecided", label: "待定", emoji: "🤔" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, attendStatus: option.value as RSVPFormData["attendStatus"] })}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                  formData.attendStatus === option.value
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

        {/* 出席详情 */}
        {formData.attendStatus === "attending" && (
          <>
            <div className="space-y-2">
              <label className="text-gold-300 text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                出席人数
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guestCount: Math.max(1, formData.guestCount - 1) })}
                  className="w-10 h-10 rounded-lg bg-graphite-700/50 border border-gold-500/20 text-gold-300 hover:border-gold-500/40"
                >
                  -
                </button>
                <span className="w-12 text-center text-xl font-medium text-gold-100">{formData.guestCount}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guestCount: Math.min(10, formData.guestCount + 1) })}
                  className="w-10 h-10 rounded-lg bg-graphite-700/50 border border-gold-500/20 text-gold-300 hover:border-gold-500/40"
                >
                  +
                </button>
                <span className="text-gold-400/60 text-sm ml-2">位宾客</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-gold-300 text-sm flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                餐饮偏好
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["无特殊要求", "素食", "清真", "其他"].map((option, i) => {
                  const values = ["none", "vegetarian", "halal", "other"]
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietaryPreference: values[i] })}
                      className={cn(
                        "p-2 rounded-lg border text-xs transition-all",
                        formData.dietaryPreference === values[i]
                          ? "border-gold-500 bg-gold-500/20 text-gold-100"
                          : "border-gold-500/20 bg-graphite-700/30 text-gold-300 hover:border-gold-500/40",
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* 祝福留言 */}
        <div className="space-y-2">
          <label className="text-gold-300 text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            祝福留言（选填）
          </label>
          <textarea
            placeholder="写下您对新人的祝福..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg bg-graphite-700/50 border border-gold-500/20 
              text-gold-100 placeholder:text-gold-400/40 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
            bg-gold-500 text-graphite-900 font-medium
            hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              提交中...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              提交回执
            </>
          )}
        </button>

        <p className="text-gold-400/50 text-xs text-center">您的信息仅用于婚礼安排，我们会妥善保管</p>
      </form>
    </DraggableModal>
  )
}
