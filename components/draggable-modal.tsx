"use client"

import type * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { X, GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== 类型定义 ====================

export interface DraggableModalProps {
  /** 控制弹窗显示/隐藏 */
  open: boolean
  /** 关闭弹窗的回调函数 */
  onClose: () => void
  /** 弹窗标题 */
  title?: React.ReactNode
  /** 弹窗内容 */
  children: React.ReactNode
  /** 是否允许拖拽（默认 true） */
  draggable?: boolean
  /** 是否允许按 Esc 键关闭（默认 true） */
  closeOnEsc?: boolean
  /** 是否允许点击背景关闭（默认 true） */
  closeOnBackdrop?: boolean
  /** 是否显示关闭按钮（默认 true） */
  showCloseButton?: boolean
  /** 弹窗宽度 */
  width?: string | number
  /** 弹窗最大宽度 */
  maxWidth?: string | number
  /** 弹窗自定义类名 */
  className?: string
  /** 弹窗内容区自定义类名 */
  contentClassName?: string
  /** 弹窗初始位置 */
  initialPosition?: { x: number; y: number }
  /** 弹窗层级（默认 50） */
  zIndex?: number
  variant?: "default" | "glass" | "glass-dark"
  blur?: "sm" | "md" | "lg" | "xl"
  opacity?: number
}

// ==================== 拖拽 Hook ====================

interface Position {
  x: number
  y: number
}

function useDraggable(
  ref: React.RefObject<HTMLDivElement | null>,
  handleRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  initialPosition?: Position,
) {
  const [position, setPosition] = useState<Position>(initialPosition ?? { x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef<Position>({ x: 0, y: 0 })

  // 重置位置（当弹窗重新打开时）
  const resetPosition = useCallback(() => {
    setPosition(initialPosition ?? { x: 0, y: 0 })
  }, [initialPosition])

  useEffect(() => {
    if (!enabled) return

    const handle = handleRef.current
    if (!handle) return

    const onMouseDown = (e: MouseEvent) => {
      // 仅响应左键点击
      if (e.button !== 0) return
      e.preventDefault()
      setIsDragging(true)
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    handle.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      handle.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [enabled, isDragging, position, handleRef])

  return { position, isDragging, resetPosition }
}

// ==================== 弹窗组件 ====================

export function DraggableModal({
  open,
  onClose,
  title,
  children,
  draggable = true,
  closeOnEsc = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  width = 480,
  maxWidth = "90vw",
  className,
  contentClassName,
  initialPosition,
  zIndex = 50,
  variant = "glass",
  blur = "lg",
  opacity = 0.85,
}: DraggableModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const { position, isDragging, resetPosition } = useDraggable(modalRef, headerRef, draggable, initialPosition)

  // 锁定背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Esc 键关闭
  useEffect(() => {
    if (!open || !closeOnEsc) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, closeOnEsc])

  // 弹窗打开时重置位置
  useEffect(() => {
    if (open) {
      resetPosition()
    }
  }, [open, resetPosition])

  // 背景点击关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleClose = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      onClose()
    }, 150)
  }, [onClose])

  if (!open) return null

  const blurValues = { sm: "8px", md: "12px", lg: "16px", xl: "24px" }
  const variantStyles = {
    default: {
      background: `rgba(255, 255, 255, ${opacity})`,
      backdropFilter: `blur(${blurValues[blur]})`,
      WebkitBackdropFilter: `blur(${blurValues[blur]})`,
    },
    glass: {
      background: `rgba(254, 253, 248, ${opacity})`,
      backdropFilter: `blur(${blurValues[blur]})`,
      WebkitBackdropFilter: `blur(${blurValues[blur]})`,
      boxShadow: "0 8px 32px rgba(212, 168, 71, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
    },
    "glass-dark": {
      background: `rgba(26, 26, 24, ${opacity})`,
      backdropFilter: `blur(${blurValues[blur]})`,
      WebkitBackdropFilter: `blur(${blurValues[blur]})`,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    },
  }

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-graphite-900/30 backdrop-blur-sm transition-all duration-200",
        isAnimating ? "opacity-0" : "opacity-100",
      )}
      style={{ zIndex }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 弹窗主体 */}
      <div
        ref={modalRef}
        className={cn(
          "relative flex flex-col rounded-2xl border border-gold-200/50 transition-all duration-200",
          isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100",
          isDragging && "scale-[1.02]",
          className,
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "scale 0.1s ease" : "all 0.2s ease",
          ...variantStyles[variant],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部（拖拽区域） */}
        <div
          ref={headerRef}
          className={cn(
            "flex items-center justify-between gap-4 border-b border-gold-200/30 px-5 py-4",
            draggable && "cursor-move select-none",
          )}
        >
          <div className="flex items-center gap-3">
            {draggable && <GripHorizontal className="h-4 w-4 text-gold-400" />}
            <h2
              id="modal-title"
              className={cn("text-lg font-semibold", variant === "glass-dark" ? "text-gold-100" : "text-graphite-800")}
            >
              {title ?? "弹窗标题"}
            </h2>
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gold-400/50",
                variant === "glass-dark"
                  ? "text-gold-300 hover:bg-gold-500/20 hover:text-gold-100"
                  : "text-graphite-500 hover:bg-gold-100 hover:text-graphite-800",
              )}
              aria-label="关闭弹窗"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 内容区域 */}
        <div
          className={cn(
            "flex-1 overflow-auto px-5 py-4",
            variant === "glass-dark" ? "text-gold-50" : "text-graphite-700",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
