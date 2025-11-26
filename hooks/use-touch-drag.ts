"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"

interface Position {
  x: number
  y: number
}

interface UseTouchDragOptions {
  initialPosition?: Position
  onDragStart?: () => void
  onDragEnd?: () => void
  disabled?: boolean
}

export function useTouchDrag(options: UseTouchDragOptions = {}) {
  const { initialPosition = { x: 0, y: 0 }, onDragStart, onDragEnd, disabled = false } = options

  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const startRef = useRef<Position>({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return

      const touch = e.touches[0]
      startRef.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      }
      setIsDragging(true)
      onDragStart?.()
    },
    [disabled, position, onDragStart],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()

      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - startRef.current.x,
        y: touch.clientY - startRef.current.y,
      })
    },
    [isDragging],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    onDragEnd?.()
  }, [onDragEnd])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, handleTouchMove, handleTouchEnd])

  const resetPosition = useCallback(() => {
    setPosition(initialPosition)
  }, [initialPosition])

  return {
    position,
    isDragging,
    elementRef,
    handleTouchStart,
    resetPosition,
    setPosition,
  }
}
