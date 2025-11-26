"use client"

import { Heart, MapPin, Phone } from "lucide-react"
import { weddingConfig } from "@/lib/wedding-config"

export function FooterSection() {
  const { couple, venue } = weddingConfig

  return (
    <footer className="py-16 bg-graphite-900 border-t border-gold-500/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* 新人名字 */}
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gold-100 mb-2">
            {couple.groom} & {couple.bride}
          </h2>
          <p className="text-gold-400/60 text-sm tracking-wider">
            {couple.groomEnglish} & {couple.brideEnglish}
          </p>
        </div>

        {/* 分隔线 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gold-500/30" />
          <Heart className="h-4 w-4 text-gold-500" fill="currentColor" />
          <div className="h-px w-16 bg-gold-500/30" />
        </div>

        {/* 联系信息 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 text-gold-300/70 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>
              {venue.name}({venue.branch})
            </span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-gold-500/50" />
          <a
            href={`tel:${couple.groomPhone}`}
            className="flex items-center gap-2 hover:text-gold-200 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>新郎：{couple.groomPhone}</span>
          </a>
          <div className="hidden md:block w-1 h-1 rounded-full bg-gold-500/50" />
          <a
            href={`tel:${couple.bridePhone}`}
            className="flex items-center gap-2 hover:text-gold-200 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>新娘：{couple.bridePhone}</span>
          </a>
        </div>

        {/* 婚礼日期 */}
        <p className="text-gold-400/50 text-sm mb-4">2025年11月29日 · {weddingConfig.lunarDate}</p>

        {/* 版权信息 */}
        <p className="text-gold-500/40 text-xs">Made with love for our special day</p>
      </div>
    </footer>
  )
}
