"use client"

import type React from "react"

import { useState, type ReactNode, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  withRipple?: boolean
  withGlow?: boolean
}

export function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  withRipple = true,
  withGlow = false,
  className,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (withRipple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples((prev) => [...prev, { x, y, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }

    onClick?.(e)
  }

  const variants = {
    primary:
      "bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 shadow-lg shadow-gold-500/30",
    secondary: "bg-gold-100 text-gold-700 hover:bg-gold-200 border border-gold-200",
    ghost: "bg-transparent text-gold-600 hover:bg-gold-50",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-xl font-medium transition-all duration-300",
        "transform hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-gold-400/50",
        variants[variant],
        sizes[size],
        withGlow && "animate-glow",
        className,
      )}
      {...props}
    >
      {/* 内容 */}
      <span className="relative z-10">{children}</span>

      {/* 涟漪效果 */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </button>
  )
}
