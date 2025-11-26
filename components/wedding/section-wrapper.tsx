"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  parallaxIntensity?: number // 0-1, 视差强度
  fadeOnScroll?: boolean
}

export function SectionWrapper({
  children,
  className,
  id,
  parallaxIntensity = 0.1,
  fadeOnScroll = true,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!fadeOnScroll) return

    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, 1 - rect.top / windowHeight))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [fadeOnScroll])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "relative transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
        className,
      )}
      style={{
        transform: fadeOnScroll ? `translateY(${(1 - scrollProgress) * parallaxIntensity * 100}px)` : undefined,
      }}
    >
      {children}
    </section>
  )
}
