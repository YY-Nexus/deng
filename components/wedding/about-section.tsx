"use client"

import { Heart, Calendar, MapPin, Navigation } from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import { weddingConfig } from "@/lib/wedding-config"
import Image from "next/image"

export function AboutSection() {
  const { couple, venue, lunarDate, photos, invitation } = weddingConfig

  return (
    <SectionWrapper id="about" className="py-24 bg-gradient-to-b from-gold-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="text-gold-500 text-sm tracking-[0.3em] mb-3">OUR STORY</p>
          <h2 className="text-3xl md:text-4xl font-light text-graphite-800 mb-4">关于我们</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gold-300" />
            <Heart className="h-4 w-4 text-gold-500" fill="currentColor" />
            <div className="h-px w-12 bg-gold-300" />
          </div>
          <p className="mt-6 text-graphite-500 max-w-lg mx-auto">{invitation?.message}</p>
        </div>

        {/* 新人介绍 */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* 新郎 */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden rounded-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 opacity-20" />
              {photos?.groom?.[0] ? (
                <Image
                  src={photos.groom[0].src || "/placeholder.svg"}
                  alt={couple.groom}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-2 rounded-full bg-gold-100 flex items-center justify-center">
                  <span className="text-6xl text-gold-600 font-light">{couple.groom.charAt(0)}</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-light text-graphite-800 mb-1">{couple.groom}</h3>
            <p className="text-gold-500 text-sm tracking-wider mb-4">{couple.groomEnglish}</p>
            <p className="text-graphite-500 text-sm leading-relaxed max-w-sm mx-auto">
              热爱生活，温暖阳光。感谢命运的眷顾让我遇见你， 愿与你携手共度每一个清晨与黄昏，相伴一生。
            </p>
          </div>

          {/* 新娘 */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden rounded-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 opacity-20" />
              {photos?.bride?.[0] ? (
                <Image
                  src={photos.bride[0].src || "/placeholder.svg"}
                  alt={couple.bride}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-2 rounded-full bg-gold-100 flex items-center justify-center">
                  <span className="text-6xl text-gold-600 font-light">{couple.bride.charAt(0)}</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-light text-graphite-800 mb-1">{couple.bride}</h3>
            <p className="text-gold-500 text-sm tracking-wider mb-4">{couple.brideEnglish}</p>
            <p className="text-graphite-500 text-sm leading-relaxed max-w-sm mx-auto">
              温柔善良，笑容明媚。相信爱情让我们走到今天， 愿我们的故事如洛阳牡丹，年年盛开，岁岁芬芳。
            </p>
          </div>
        </div>

        {/* 婚礼信息卡片 */}
        <div className="mt-20 grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gold-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gold-50">
                <Calendar className="h-6 w-6 text-gold-600" />
              </div>
              <div>
                <h4 className="font-medium text-graphite-800 mb-1">婚礼时间</h4>
                <p className="text-graphite-500">2025年11月29日 星期六</p>
                <p className="text-graphite-400 text-sm">{lunarDate} · 上午 11:30 婚礼仪式</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gold-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gold-50">
                <MapPin className="h-6 w-6 text-gold-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-graphite-800 mb-1">婚礼地点</h4>
                <p className="text-graphite-500">
                  {venue.name}({venue.branch})
                </p>
                <p className="text-graphite-400 text-sm">{venue.address}</p>
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm text-gold-600 hover:text-gold-700 transition-colors"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>点击导航</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
