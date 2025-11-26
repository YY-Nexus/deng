"use client"

import { useState } from "react"
import { Heart, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { weddingConfig } from "@/lib/wedding-config"
import { DraggableModal } from "@/components/draggable-modal"

export function GallerySection() {
  const { gallery } = weddingConfig
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof gallery)[0] | null>(null)

  return (
    <SectionWrapper id="gallery" className="py-24 bg-gradient-to-b from-white to-gold-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="text-gold-500 text-sm tracking-[0.3em] mb-3">GALLERY</p>
          <h2 className="text-3xl md:text-4xl font-light text-graphite-800 mb-4">甜蜜画廊</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gold-300" />
            <Heart className="h-4 w-4 text-gold-500" fill="currentColor" />
            <div className="h-px w-12 bg-gold-300" />
          </div>
        </div>

        {/* 照片网格 - Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((photo, index) => {
            // 创建不规则网格效果
            const isLarge = index === 0 || index === 3

            return (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-gold-100",
                  "transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/20",
                  isLarge ? "md:col-span-2 md:row-span-2 aspect-[4/3]" : "aspect-square",
                )}
              >
                {/* 占位图 */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-200 via-gold-100 to-gold-300 flex items-center justify-center">
                  <span className="text-4xl md:text-6xl text-gold-400/50 font-light">{photo.id}</span>
                </div>

                {/* 悬浮遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-graphite-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 悬浮信息 */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-gold-100 font-medium">{photo.title}</p>
                  <p className="text-gold-300/80 text-sm">{photo.description}</p>
                </div>

                {/* 放大图标 */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 照片详情弹窗 */}
      <DraggableModal
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title}
        width={600}
        variant="glass"
      >
        {selectedPhoto && (
          <div className="space-y-4">
            {/* 大图展示 */}
            <div className="aspect-video rounded-xl bg-gradient-to-br from-gold-200 via-gold-100 to-gold-300 flex items-center justify-center">
              <span className="text-8xl text-gold-400/50 font-light">{selectedPhoto.id}</span>
            </div>

            {/* 照片信息 */}
            <div>
              <h3 className="text-lg font-medium text-graphite-800 mb-2">{selectedPhoto.title}</h3>
              <p className="text-graphite-500">{selectedPhoto.description}</p>
            </div>

            {/* 互动区 */}
            <div className="flex items-center gap-4 pt-4 border-t border-gold-200/30">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-50 text-gold-600 hover:bg-gold-100 transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-sm">喜欢</span>
              </button>
              <span className="text-sm text-graphite-400">分类：{selectedPhoto.category}</span>
            </div>
          </div>
        )}
      </DraggableModal>
    </SectionWrapper>
  )
}
