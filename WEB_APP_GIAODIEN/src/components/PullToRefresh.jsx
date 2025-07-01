"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

const PullToRefresh = ({ onRefresh, isRefreshing }) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [startY, setStartY] = useState(0)

  useEffect(() => {
    let touchStartY = 0
    let touchMoveY = 0

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY
        setStartY(touchStartY)
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e) => {
      if (!isPulling || window.scrollY > 0) return

      touchMoveY = e.touches[0].clientY
      const distance = Math.max(0, touchMoveY - touchStartY)

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, 100))
      }
    }

    const handleTouchEnd = () => {
      if (isPulling && pullDistance > 60) {
        onRefresh()
      }
      setIsPulling(false)
      setPullDistance(0)
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isPulling, pullDistance, onRefresh])

  if (!isPulling && !isRefreshing && pullDistance === 0) return null

  return (
    <div
      className="pull-to-refresh transition-all duration-300"
      style={{
        transform: `translateY(${pullDistance}px)`,
        opacity: pullDistance > 0 ? 1 : 0,
      }}
    >
      <RefreshCw className={`w-6 h-6 text-jk-primary ${isRefreshing || pullDistance > 60 ? "animate-spin" : ""}`} />
      <span className="ml-2 text-sm font-medium">
        {isRefreshing ? "Refreshing..." : pullDistance > 60 ? "Release to refresh" : "Pull to refresh"}
      </span>
    </div>
  )
}

export default PullToRefresh
