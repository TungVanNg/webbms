"use client"

import { Activity, Battery, TrendingUp, Settings } from "lucide-react"

const MobileNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "cells", label: "Cells", icon: Battery },
    { id: "charts", label: "Charts", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="mobile-nav safe-area-bottom">
      <div className="flex">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`mobile-nav-item touch-target ${activeTab === id ? "active" : ""}`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default MobileNavigation
