"use client"

import { useState, useEffect } from "react"
import { getCountdown } from "@/lib/wedding-config"
import { cn } from "@/lib/utils"

interface CountdownProps {
  targetDate: Date
  className?: string
}

export function Countdown({ targetDate, className }: CountdownProps) {
  const [countdown, setCountdown] = useState(getCountdown(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeBlocks = [
    { value: countdown.days, label: "天", labelEn: "DAYS" },
    { value: countdown.hours, label: "时", labelEn: "HOURS" },
    { value: countdown.minutes, label: "分", labelEn: "MINS" },
    { value: countdown.seconds, label: "秒", labelEn: "SECS" },
  ]

  if (countdown.isOver) {
    return (
      <div className={cn("text-center", className)}>
        <p className="text-2xl font-light text-gold-600">婚礼进行中</p>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center gap-3 md:gap-6", className)}>
      {timeBlocks.map((block, index) => (
        <div key={block.labelEn} className="flex items-center gap-3 md:gap-6">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "relative w-16 h-20 md:w-24 md:h-28 rounded-xl overflow-hidden",
                "bg-graphite-800/80 backdrop-blur-sm",
                "border border-gold-500/30",
                "shadow-lg shadow-gold-500/10",
              )}
            >
              {/* 光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 to-transparent" />

              {/* 数字 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl md:text-5xl font-light text-gold-100 tabular-nums">
                  {String(block.value).padStart(2, "0")}
                </span>
              </div>

              {/* 中线装饰 */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-gold-500/20" />
            </div>

            <span className="mt-2 text-xs md:text-sm font-medium text-graphite-400 tracking-wider">
              {block.labelEn}
            </span>
          </div>

          {/* 分隔符 */}
          {index < timeBlocks.length - 1 && (
            <div className="flex flex-col gap-2 pb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
