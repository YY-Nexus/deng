"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect, type RefObject } from "react"

interface Position {
  x: number
  y: number
}

interface UseDraggableOptions {
  initialPosition?: Position
  boundaryRef?: RefObject<HTMLElement | null>
  handleSelector?: string
  disabled?: boolean
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { initialPosition = { x: 0, y: 0 }, boundaryRef, disabled = false } = options

  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return

      e.preventDefault()
      setIsDragging(true)

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

      dragStartRef.current = {
        x: clientX - position.x,
        y: clientY - position.y,
      }
    },
    [disabled, position],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

      let newX = clientX - dragStartRef.current.x
      let newY = clientY - dragStartRef.current.y

      // 边界约束
      if (boundaryRef?.current && elementRef.current) {
        const boundary = boundaryRef.current.getBoundingClientRect()
        const element = elementRef.current.getBoundingClientRect()

        newX = Math.max(-boundary.width / 2 + element.width / 2, Math.min(newX, boundary.width / 2 - element.width / 2))
        newY = Math.max(
          -boundary.height / 2 + element.height / 2,
          Math.min(newY, boundary.height / 2 - element.height / 2),
        )
      }

      setPosition({ x: newX, y: newY })
    },
    [isDragging, boundaryRef],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleMouseMove, { passive: false })
      document.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleMouseMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const resetPosition = useCallback(() => {
    setPosition(initialPosition)
  }, [initialPosition])

  return {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
    resetPosition,
    setPosition,
  }
}
