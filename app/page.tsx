"use client"

import { Navigation } from "@/components/wedding/navigation"
import { FloatingAIButton } from "@/components/wedding/floating-ai-button"
import { HeroSection } from "@/components/wedding/hero-section"
import { AboutSection } from "@/components/wedding/about-section"
import { ScheduleSection } from "@/components/wedding/schedule-section"
import { GallerySection } from "@/components/wedding/gallery-section"
import { Gallery3D } from "@/components/wedding/gallery-3d"
import { InteractiveSection } from "@/components/wedding/interactive-section"
import { FooterSection } from "@/components/wedding/footer-section"
import { ActionBar } from "@/components/wedding/action-bar"

export default function WeddingPage() {
  return (
    <main className="relative min-h-screen">
      {/* 导航栏 */}
      <Navigation />

      {/* 浮动 AI 按钮 */}
      <FloatingAIButton />

      {/* Hero 区域 - 倒计时与主视觉 */}
      <HeroSection />

      {/* 关于我们 - 新人介绍 */}
      <AboutSection />

      {/* 日程安排 - 时间线 */}
      <ScheduleSection />

      {/* 2D 照片画廊 - Bento Grid */}
      <GallerySection />

      {/* 3D 沉浸式画廊 - Three.js */}
      <Gallery3D />

      {/* 互动专区 */}
      <InteractiveSection />

      {/* 页脚 */}
      <FooterSection />

      {/* 底部操作栏 - 音乐/回执/留言/来宾 */}
      <ActionBar />
    </main>
  )
}
