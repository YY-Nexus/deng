"use client"

import type React from "react"
import { Heart, Pen, Utensils, Camera, Car, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { LocationCard } from "./location-card"
import { weddingConfig } from "@/lib/wedding-config"
import { ScrollReveal } from "./scroll-reveal"

const iconMap: Record<string, React.ElementType> = {
  pen: Pen,
  heart: Heart,
  utensils: Utensils,
  tea: Utensils,
  camera: Camera,
  car: Car,
  gift: Gift,
}

export function ScheduleSection() {
  const { schedule } = weddingConfig

  return (
    <SectionWrapper id="schedule" className="py-24 bg-graphite-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <p className="text-gold-400 text-sm tracking-[0.3em] mb-3">TIMELINE</p>
            <h2 className="text-3xl md:text-4xl font-light text-gold-100 mb-4">婚礼日程</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gold-500/30" />
              <Heart className="h-4 w-4 text-gold-500" fill="currentColor" />
              <div className="h-px w-12 bg-gold-500/30" />
            </div>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* 时间线 - 占 3 列 */}
          <div className="lg:col-span-3 relative">
            {/* 中线 */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/0 via-gold-500/50 to-gold-500/0" />

            <div className="space-y-6">
              {schedule.map((item, index) => {
                const Icon = iconMap[item.icon] || Heart
                const isLeft = index % 2 === 0

                return (
                  <ScrollReveal key={item.time} animation={isLeft ? "fade-right" : "fade-left"} delay={index * 100}>
                    <div
                      className={cn(
                        "relative flex items-center gap-6",
                        "md:gap-0",
                        isLeft ? "md:flex-row" : "md:flex-row-reverse",
                      )}
                    >
                      {/* 时间点 */}
                      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                        <div className="w-4 h-4 rounded-full bg-gold-500 ring-4 ring-graphite-900 animate-pulse" />
                      </div>

                      {/* 内容卡片 */}
                      <div className={cn("ml-16 md:ml-0 md:w-1/2", isLeft ? "md:pr-8 md:text-right" : "md:pl-8")}>
                        <div
                          className={cn(
                            "inline-flex items-center gap-4 p-4 rounded-xl",
                            "bg-graphite-800/50 border border-gold-500/20",
                            "backdrop-blur-sm",
                            "hover:border-gold-500/40 hover:bg-graphite-800/70 transition-all duration-300",
                            "group cursor-default",
                          )}
                        >
                          <div
                            className={cn(
                              "p-3 rounded-lg bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors",
                              isLeft ? "md:order-2" : "",
                            )}
                          >
                            <Icon className="h-5 w-5 text-gold-400" />
                          </div>
                          <div className={isLeft ? "md:text-right" : ""}>
                            <p className="text-gold-400 text-sm font-medium">{item.time}</p>
                            <p className="text-gold-100 font-light">{item.event}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>

          {/* 地点卡片 - 占 2 列 */}
          <div className="lg:col-span-2">
            <ScrollReveal animation="fade-left" delay={200}>
              <div className="lg:sticky lg:top-24">
                <LocationCard />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* 洛阳习俗提示 */}
        <ScrollReveal animation="fade-up" delay={400}>
          <div className="mt-16 p-6 rounded-2xl bg-gold-500/10 border border-gold-500/20">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="p-3 rounded-full bg-gold-500/20">
                <Gift className="h-6 w-6 text-gold-400" />
              </div>
              <div>
                <h4 className="text-gold-100 font-medium mb-1">洛阳传统习俗提示</h4>
                <p className="text-gold-300/70 text-sm leading-relaxed">
                  按照洛阳传统习俗，敬茶环节将奉上传统茶点。请各位长辈准备红包，祝福新人幸福美满、早生贵子。
                  婚宴采用洛阳传统"水席"，请宾客们尽情品尝。
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  )
}
