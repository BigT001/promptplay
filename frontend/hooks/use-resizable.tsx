"use client"

import { useState, useEffect, useCallback } from 'react'

interface ResizeProps {
  minWidth?: number
  maxWidth?: number
  defaultWidth?: number
}

export function useResizable({ minWidth = 280, maxWidth = 800, defaultWidth = 320 }: ResizeProps = {}) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      // Getting the viewport width to ensure we don't resize beyond screen
      const viewportWidth = window.innerWidth
      // Calculate from right edge of screen since our sidebar is on the right
      const newWidth = viewportWidth - e.clientX
      
      // Constrain the width between min and max values
      const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth)
      setWidth(constrainedWidth)
    }
  }, [isResizing, minWidth, maxWidth])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  return {
    width,
    isResizing,
    startResizing,
    stopResizing
  }
}
