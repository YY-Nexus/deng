'use client'

import { useState, useEffect } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { weddingConfig } from '@/lib/wedding-config'
import { prioritizeMedia } from '@/lib/media-utils'

export default function GroomPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* 新郎照片 */}
        <div
          className={cn(
            "relative w-full mb-6 transition-all duration-1000",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <div className="relative">
            {/* 统一金色边框 */}
            <div className="absolute -inset-[3px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg" />
            
            {/* 照片容器 */}
            <div className="relative bg-slate-900 rounded-lg overflow-hidden">
              <img
                src={
                  // 尝试优先选择带“主婚/主纱/主婚单/主婚合影”标注的照片
                  prioritizeMedia(
                    [
                      ...(weddingConfig.gallery ?? []),
                      ...Object.values(weddingConfig.photos ?? {}).flat(),
                    ],
                    1
                  )[0]?.src ?? '/wedding/Groom主婚单7.jpg'
                }
                alt="新郎 张波"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* 婚礼信息卡片 */}
        <div
          className={cn(
            "w-full mb-6 transition-all duration-1000 delay-200",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="relative">
            {/* 统一金色边框 */}
            <div className="absolute -inset-[3px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg" />
            
            {/* 信息容器 */}
            <div className="relative bg-slate-900 rounded-lg p-6">
              <p className="text-amber-400 text-sm tracking-wider mb-2 text-center">诚挚邀请您参加</p>
              <p className="text-white text-xl font-medium mb-4 text-center">张波 & 邓芮 婚礼庆典</p>
              <div className="space-y-2 text-sm text-gray-300 text-center">
                <p>📅 2025年11月29日 星期六</p>
                <p>🕐 上午11:30 农历十月初十</p>
                <p>📍 富豪宴会厅（阿新大道旁）</p>
              </div>
            </div>
          </div>
        </div>

        {/* 二维码卡片 */}
        <div
          className={cn(
            "w-full transition-all duration-1000 delay-400",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}
        >
          <div className="relative">
            {/* 统一金色边框 */}
            <div className="absolute -inset-[3px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg" />
            
            {/* 二维码容器 */}
            <div className="relative bg-slate-900 rounded-lg p-8">
              <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center">
                {/* 这里放置二维码图片 */}
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-amber-500 mx-auto mb-3 animate-pulse" />
                  <p className="text-sm text-gray-600 font-medium">扫描查看电子邀请函</p>
                </div>
              </div>
            </div>
          </div>

          {/* 提示文字 */}
          <p className="text-center mt-4 text-sm text-amber-300/80 tracking-wide">
            长按保存二维码 · 分享给亲朋好友
          </p>
        </div>
      </div>
    </div>
  )
}
