"use client"

import { useEffect, useState, useRef } from "react"
import { Heart, ChevronDown, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Countdown } from "./countdown"
import { weddingConfig } from "@/lib/wedding-config"

const welcomeCopyStyles = {
  modern: {
    title: "爱，让两颗心合而为一",
    subtitle: "我们结婚啦 ✨",
    description: "一路走来，感恩有您的祝福与陪伴",
  },
  traditional: {
    title: "百年修得同船渡",
    subtitle: "千年修得共枕眠",
    description: "承蒙厚爱，敬邀您拨冗莅临",
  },
  casual: {
    title: "终于等到这一天啦！",
    subtitle: "准备好一起嗨翻吗？🎉",
    description: "美食、美酒、还有满满的欢笑",
  },
}

interface HeroSectionProps {
  className?: string
  copyStyle?: keyof typeof welcomeCopyStyles
}

export function HeroSection({ className, copyStyle = "modern" }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const currentCopy = welcomeCopyStyles[copyStyle]

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const { couple, date, venue, lunarDate } = weddingConfig
  const formattedDate = date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center overflow-hidden",
        "bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-900",
        className,
      )}
    >
      {/* 背景装饰 - 视差效果 */}
      <div className="absolute inset-0 opacity-30" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      {/* 装饰线条 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="url(#gold-gradient)" strokeWidth="0.1" />
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4a847" stopOpacity="0" />
              <stop offset="50%" stopColor="#d4a847" stopOpacity="1" />
              <stop offset="100%" stopColor="#d4a847" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* 顶部装饰 */}
        <div
          className={cn(
            "flex items-center justify-center gap-4 mb-8 transition-all duration-1000",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8",
          )}
        >
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-gold-500/50" />
          <Heart className="h-5 w-5 text-gold-500 animate-float" fill="currentColor" />
          <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-gold-500/50" />
        </div>

        <div
          className={cn(
            "mb-6 transition-all duration-1000 delay-200",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8",
          )}
        >
          {/* 文案标题 */}
          <p className="text-gold-400/80 text-sm md:text-base tracking-[0.2em] mb-2 font-light">{currentCopy.title}</p>
          <p className="text-gold-400/60 text-xs md:text-sm tracking-[0.3em] mb-4 font-light">{currentCopy.subtitle}</p>

          {/* 新人名字 */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-gold-100 tracking-wide">
            <span>{couple.groom}</span>
            <span className="mx-4 md:mx-6 text-gold-500">&</span>
            <span>{couple.bride}</span>
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gold-300/60 font-light tracking-wider">
            {couple.groomEnglish} & {couple.brideEnglish}
          </p>

          {/* 文案描述 */}
          <p className="mt-4 text-gold-300/50 text-sm tracking-wider">{currentCopy.description}</p>
        </div>

        {/* 日期地点 */}
        <div
          className={cn(
            "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 transition-all duration-1000 delay-400",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8",
          )}
        >
          <div className="flex items-center gap-2 text-gold-300/70">
            <Calendar className="h-4 w-4" />
            <span className="text-sm md:text-base">
              {formattedDate} · {lunarDate}
            </span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-gold-500/50" />
          <div className="flex items-center gap-2 text-gold-300/70">
            <MapPin className="h-4 w-4" />
            <span className="text-sm md:text-base">
              {venue.name}({venue.branch})
            </span>
          </div>
        </div>

        {/* 倒计时 */}
        <div
          className={cn(
            "transition-all duration-1000 delay-600",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <p className="text-gold-400/60 text-sm tracking-wider mb-6">距离我们的大喜之日还有</p>
          <Countdown targetDate={date} />
        </div>

        <div className={cn("mt-12 transition-all duration-1000 delay-800", isLoaded ? "opacity-100" : "opacity-0")}>
          <p className="text-gold-400/40 text-xs tracking-wider">
            🏮 洛阳传统 · 敬茶环节，新人将向双方父母敬上清茶，感恩养育之恩
          </p>
        </div>
      </div>

      {/* 向下滚动提示 */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-xs text-gold-400/50 tracking-wider">向下滚动探索更多</span>
        <ChevronDown className="h-5 w-5 text-gold-400/50 animate-bounce" />
      </div>
    </section>
  )
}
