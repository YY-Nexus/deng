"use client"

import { useState } from "react"
import { Heart, Share2, Gift, Camera, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { ScrollReveal } from "./scroll-reveal"
import { AnimatedButton } from "./animated-button"

const interactions = [
  {
    icon: Camera,
    title: "拍照打卡",
    description: "在签到处留下您的笑容，让我们一起记录这美好时刻",
    action: "立即参与",
  },
  {
    icon: Gift,
    title: "礼金登记",
    description: "您的祝福我们已收到，点击查看礼金登记详情",
    action: "查看详情",
  },
  {
    icon: Share2,
    title: "分享喜悦",
    description: "将婚礼邀请函分享给您的亲友，一起见证我们的幸福",
    action: "立即分享",
  },
  {
    icon: Sparkles,
    title: "抽奖互动",
    description: "参与婚礼现场抽奖，赢取精美伴手礼",
    action: "参与抽奖",
  },
]

export function InteractiveSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  return (
    <SectionWrapper id="interactive" className="py-24 bg-gradient-to-b from-gold-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <p className="text-gold-500 text-sm tracking-[0.3em] mb-3">INTERACTIVE</p>
            <h2 className="text-3xl md:text-4xl font-light text-graphite-800 mb-4">互动专区</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gold-300" />
              <Heart className="h-4 w-4 text-gold-500" fill="currentColor" />
              <div className="h-px w-12 bg-gold-300" />
            </div>
            <p className="mt-6 text-graphite-500 max-w-xl mx-auto">
              参与婚礼互动，让这场婚礼更加难忘。您的每一次互动，都是我们最珍贵的回忆
            </p>
          </div>
        </ScrollReveal>

        {/* 互动卡片 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {interactions.map((item, index) => (
            <ScrollReveal key={item.title} animation="fade-up" delay={index * 100}>
              <div
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                className={cn(
                  "group relative p-6 rounded-2xl transition-all duration-300 cursor-pointer",
                  "bg-white border border-gold-100 hover:border-gold-300",
                  "hover:shadow-xl hover:shadow-gold-500/10 hover:-translate-y-1",
                  activeCard === index && "border-gold-400 shadow-xl shadow-gold-500/15",
                )}
              >
                {/* 图标 */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                    "bg-gold-50 group-hover:bg-gold-100 group-hover:scale-110",
                  )}
                >
                  <item.icon className="h-7 w-7 text-gold-600" />
                </div>

                {/* 内容 */}
                <h3 className="text-lg font-medium text-graphite-800 mb-2">{item.title}</h3>
                <p className="text-sm text-graphite-500 mb-4 leading-relaxed">{item.description}</p>

                {/* 按钮 */}
                <AnimatedButton variant="ghost" size="sm" className="w-full justify-center">
                  {item.action}
                </AnimatedButton>

                {/* 悬浮装饰 */}
                <div
                  className={cn(
                    "absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300",
                    "bg-gold-400 opacity-0 group-hover:opacity-100",
                  )}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 温馨提示 */}
        <ScrollReveal animation="fade-up" delay={400}>
          <div className="mt-12 p-6 rounded-2xl bg-gold-500/5 border border-gold-200/50 text-center">
            <p className="text-graphite-600 text-sm">
              <span className="text-gold-600 font-medium">温馨提示：</span>
              婚礼当天请提前30分钟到场签到，以便我们为您安排座位
            </p>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  )
}
