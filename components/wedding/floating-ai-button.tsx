"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Mic, MessageCircle, Phone, ChevronRight, X, Navigation, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDraggable } from "@/hooks/use-draggable"
import { weddingConfig, formatPhoneForCall } from "@/lib/wedding-config"
import aiTemplates from "@/lib/ai-assistant-templates.json"

interface FloatingAIButtonProps {
  className?: string
  onOpenRSVP?: () => void
  onOpenMusic?: () => void
}

export function FloatingAIButton({ className, onOpenRSVP, onOpenMusic }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [currentGreeting, setCurrentGreeting] = useState(aiTemplates.greetings[0])
  const panelRef = useRef<HTMLDivElement>(null)

  const { position, isDragging, handleMouseDown, elementRef } = useDraggable({
    initialPosition: { x: 0, y: 0 },
  })

  const { couple, venue } = weddingConfig

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * aiTemplates.greetings.length)
      setCurrentGreeting(aiTemplates.greetings[randomIndex])
    }
  }, [isOpen])

  const handleShortcut = (command: string) => {
    switch (command) {
      case "navigate_to_venue":
        window.open(venue.mapUrl, "_blank")
        break
      case "guest_checkin":
      case "rsvp_confirm":
        onOpenRSVP?.()
        setIsOpen(false)
        break
      case "play_music":
        onOpenMusic?.()
        setIsOpen(false)
        break
      case "call_contact":
        window.open(formatPhoneForCall(couple.groomPhone!), "_self")
        break
      case "emergency_call":
        window.open(formatPhoneForCall(couple.groomPhone!), "_self")
        break
    }
  }

  const menuItems = [
    { icon: MessageCircle, label: "智能问答", description: "询问婚礼相关问题", action: () => {} },
    { icon: Mic, label: "语音助手", description: "语音交互更便捷", action: () => {} },
    {
      icon: Phone,
      label: "联系新郎",
      description: `${couple.groom} ${couple.groomPhone}`,
      action: () => window.open(formatPhoneForCall(couple.groomPhone!), "_self"),
    },
    {
      icon: Phone,
      label: "联系新娘",
      description: `${couple.bride} ${couple.bridePhone}`,
      action: () => window.open(formatPhoneForCall(couple.bridePhone!), "_self"),
    },
    {
      icon: Navigation,
      label: "导航到酒店",
      description: venue.name,
      action: () => window.open(venue.mapUrl, "_blank"),
    },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-6 top-6 z-40 flex items-center gap-2 rounded-full px-4 py-3 transition-all duration-300",
          "bg-graphite-900/60 backdrop-blur-md border border-gold-400/40",
          "hover:bg-graphite-900/80 hover:scale-105 hover:shadow-lg hover:shadow-gold-500/20",
          "focus:outline-none focus:ring-2 focus:ring-gold-400/50",
          isHovered && "animate-glow",
          className,
        )}
        aria-label="打开AI助手"
      >
        <Sparkles className={cn("h-5 w-5 text-gold-400 transition-transform duration-300", isHovered && "rotate-12")} />
        <span className="text-sm font-medium text-white">婚礼助手</span>
      </button>

      {/* AI 面板 - 可拖拽 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            ref={elementRef}
            className={cn(
              "pointer-events-auto absolute left-6 top-20 w-80",
              "rounded-2xl border border-gold-200/50",
              "bg-gold-50/95 backdrop-blur-xl",
              "shadow-2xl shadow-gold-500/10",
              "transition-all duration-200",
              isDragging && "scale-[1.02] shadow-3xl",
            )}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          >
            {/* 面板头部 - 拖拽区域 */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className="flex items-center justify-between p-4 border-b border-gold-200/30 cursor-move select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gold-500/20 animate-float">
                  <Sparkles className="h-5 w-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-graphite-800">
                    {couple.groom} & {couple.bride}
                  </h3>
                  <p className="text-xs text-graphite-500">婚礼助手 · 随时为您服务</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-graphite-400 hover:bg-gold-100 hover:text-graphite-600 transition-colors"
                aria-label="关闭面板"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 pt-3 pb-2">
              <div className="bg-gold-100/50 rounded-xl p-3 text-sm text-graphite-600">{currentGreeting.text}</div>
            </div>

            <div className="px-4 pb-2">
              <p className="text-xs text-graphite-400 mb-2">快捷操作</p>
              <div className="flex flex-wrap gap-2">
                {aiTemplates.shortcuts.map((shortcut) => (
                  <button
                    key={shortcut.command}
                    onClick={() => handleShortcut(shortcut.command)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full transition-all duration-200",
                      "bg-gold-100/50 text-graphite-600 border border-gold-200/50",
                      "hover:bg-gold-200/50 hover:scale-105",
                      "focus:outline-none focus:ring-2 focus:ring-gold-400/50",
                    )}
                  >
                    {shortcut.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 功能菜单 */}
            <div className="p-3 space-y-2 border-t border-gold-200/30">
              {menuItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                    "hover:bg-gold-100 hover:translate-x-1 group",
                    "focus:outline-none focus:ring-2 focus:ring-gold-400/50",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-2 rounded-lg bg-gold-500/10 text-gold-600 group-hover:bg-gold-500/20 transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-graphite-700 text-sm">{item.label}</p>
                    <p className="text-xs text-graphite-400">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-graphite-300 group-hover:text-gold-500 transition-colors" />
                </button>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-gold-200/30 bg-gold-100/30">
              <p className="text-xs text-graphite-500">
                🏮 <span className="font-medium">洛阳习俗</span>：{aiTemplates.luoyang_tips.jingcha}
              </p>
            </div>

            {/* 快捷输入 */}
            <div className="p-4 border-t border-gold-200/30">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="有什么可以帮您？"
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl text-sm",
                    "bg-white/50 border border-gold-200/50",
                    "placeholder:text-graphite-400 text-graphite-700",
                    "focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-transparent",
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue.trim()) {
                      setInputValue("")
                    }
                  }}
                />
                <button
                  className="p-2.5 rounded-xl bg-gold-500 text-white hover:bg-gold-600 transition-colors disabled:opacity-50"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
