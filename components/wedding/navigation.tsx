"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Music, MessageSquare, ClipboardList, Users, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "首页", href: "#hero", type: "scroll" },
  { label: "关于我们", href: "#about", type: "scroll" },
  { label: "日程安排", href: "#schedule", type: "scroll" },
  { label: "照片墙", href: "#gallery", type: "scroll" },
  { label: "3D画廊", href: "#gallery-3d", type: "scroll" },
  { label: "互动专区", href: "#interactive", type: "scroll" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navItems.map((item) => item.href.slice(1))
      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.slice(1)
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled ? "bg-graphite-900/80 backdrop-blur-lg border-b border-gold-500/10 py-3" : "bg-transparent py-5",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo 占位 - 左侧留给浮动AI按钮 */}
          <div className="w-32" />

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 relative",
                  isScrolled ? "text-gold-200 hover:text-gold-400" : "text-gold-300/80 hover:text-gold-100",
                  activeSection === item.href.slice(1) && "text-gold-400",
                )}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gold-300 hover:bg-gold-500/10 transition-colors"
            aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <div
        className={cn(
          "fixed inset-0 z-30 md:hidden transition-all duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-graphite-900/90 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute top-20 left-6 right-6 p-6 rounded-2xl bg-graphite-800/90 border border-gold-500/20 transition-all duration-300",
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
          )}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "px-4 py-3 rounded-xl transition-colors",
                  activeSection === item.href.slice(1)
                    ? "bg-gold-500/20 text-gold-100"
                    : "text-gold-200 hover:bg-gold-500/10 hover:text-gold-100",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gold-500/20">
            <p className="text-gold-400/60 text-xs text-center mb-3">更多功能请使用底部操作栏</p>
            <div className="flex justify-center gap-4">
              <Music className="h-5 w-5 text-gold-400/50" />
              <MessageSquare className="h-5 w-5 text-gold-400/50" />
              <ClipboardList className="h-5 w-5 text-gold-400/50" />
              <Users className="h-5 w-5 text-gold-400/50" />
              <MapPin className="h-5 w-5 text-gold-400/50" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
