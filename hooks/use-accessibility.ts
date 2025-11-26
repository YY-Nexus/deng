"use client"

import type React from "react"

/**
 * 任务卡 10: 响应式与无障碍适配
 * 无障碍增强钩子
 */

import { useEffect, useState, useCallback } from "react"

// 检测用户偏好设置
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    darkMode: false,
    largeText: false,
  })

  useEffect(() => {
    const checkPreferences = () => {
      setPreferences({
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        highContrast: window.matchMedia("(prefers-contrast: more)").matches,
        darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
        largeText: window.matchMedia("(min-resolution: 2dppx)").matches,
      })
    }

    checkPreferences()

    const mediaQueries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(prefers-contrast: more)"),
      window.matchMedia("(prefers-color-scheme: dark)"),
    ]

    mediaQueries.forEach((mq) => mq.addEventListener("change", checkPreferences))
    return () => {
      mediaQueries.forEach((mq) => mq.removeEventListener("change", checkPreferences))
    }
  }, [])

  return preferences
}

// 焦点管理
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // 保存之前的焦点
    const previouslyFocused = document.activeElement as HTMLElement

    // 聚焦第一个元素
    firstElement?.focus()

    container.addEventListener("keydown", handleKeyDown)
    return () => {
      container.removeEventListener("keydown", handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [containerRef, isActive])
}

// 键盘导航增强
export function useKeyboardNavigation(
  items: HTMLElement[],
  options?: {
    orientation?: "horizontal" | "vertical" | "both"
    loop?: boolean
    onSelect?: (index: number) => void
  },
) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { orientation = "vertical", loop = true, onSelect } = options || {}

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isVertical = orientation === "vertical" || orientation === "both"
      const isHorizontal = orientation === "horizontal" || orientation === "both"

      let newIndex = activeIndex

      if ((e.key === "ArrowDown" && isVertical) || (e.key === "ArrowRight" && isHorizontal)) {
        e.preventDefault()
        newIndex = activeIndex + 1
        if (newIndex >= items.length) {
          newIndex = loop ? 0 : items.length - 1
        }
      } else if ((e.key === "ArrowUp" && isVertical) || (e.key === "ArrowLeft" && isHorizontal)) {
        e.preventDefault()
        newIndex = activeIndex - 1
        if (newIndex < 0) {
          newIndex = loop ? items.length - 1 : 0
        }
      } else if (e.key === "Home") {
        e.preventDefault()
        newIndex = 0
      } else if (e.key === "End") {
        e.preventDefault()
        newIndex = items.length - 1
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onSelect?.(activeIndex)
        return
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
        items[newIndex]?.focus()
      }
    },
    [activeIndex, items, orientation, loop, onSelect],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return { activeIndex, setActiveIndex }
}

// 屏幕阅读器公告
export function useAnnounce() {
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", priority)
    announcer.setAttribute("aria-atomic", "true")
    announcer.setAttribute("class", "sr-only")
    document.body.appendChild(announcer)

    // 延迟添加内容以确保被读取
    setTimeout(() => {
      announcer.textContent = message
    }, 100)

    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }, [])

  return announce
}

// 触控手势支持
export function useTouchGestures(
  ref: React.RefObject<HTMLElement | null>,
  handlers: {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
    onLongPress?: () => void
  },
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    let startX = 0
    let startY = 0
    let startTime = 0
    let longPressTimer: NodeJS.Timeout | null = null

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startTime = Date.now()

      if (handlers.onLongPress) {
        longPressTimer = setTimeout(() => {
          handlers.onLongPress?.()
        }, 500)
      }
    }

    const handleTouchMove = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = endX - startX
      const diffY = endY - startY
      const elapsed = Date.now() - startTime

      // 快速滑动检测
      if (elapsed < 300 && (Math.abs(diffX) > 50 || Math.abs(diffY) > 50)) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            handlers.onSwipeRight?.()
          } else {
            handlers.onSwipeLeft?.()
          }
        } else {
          if (diffY > 0) {
            handlers.onSwipeDown?.()
          } else {
            handlers.onSwipeUp?.()
          }
        }
      }
    }

    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchmove", handleTouchMove, { passive: true })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
      if (longPressTimer) clearTimeout(longPressTimer)
    }
  }, [ref, handlers])
}
