"use client"

import { useState, useEffect } from "react"
import { useMQTT } from "../hooks/useMQTT"
import { useBMSData } from "../hooks/useBMSData"
import StatusCard from "./StatusCard"
import CellGrid from "./CellGrid"
import SettingsPanel from "./SettingsPanel"
import PowerChart from "./PowerChart"
import MobileNavigation from "./MobileNavigation"
import PullToRefresh from "./PullToRefresh"
import {
  Activity,
  Battery,
  Thermometer,
  Zap,
  Settings,
  Wifi,
  WifiOff,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"

const JKBMSApp = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { isConnected, connectionStatus, publishCommand, publishOTA } = useMQTT()
  const { bmsData, deviceStatus, lastUpdate, alerts, statusColor, connectionQuality } = useBMSData()

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const formatTime = (date) => {
    if (!date) return "Never"
    return date.toLocaleTimeString()
  }

  const getStatusIcon = () => {
    return isConnected ? <Wifi className="w-4 h-4 sm:w-5 sm:h-5" /> : <WifiOff className="w-4 h-4 sm:w-5 sm:h-5" />
  }

  const getDeviceStatusIcon = () => {
    switch (deviceStatus) {
      case "online":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-jk-success" />
      case "offline":
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-jk-danger" />
      default:
        return <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-jk-warning" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 no-bounce">
      {/* Mobile Header */}
      {isMobile ? (
        <header className="jk-gradient-bg shadow-2xl safe-area-top">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Battery className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-lg font-bold">JK BMS</h1>
                  <p className="text-blue-100 text-xs">Battery Monitor</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    isConnected ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
                  }`}
                >
                  {getStatusIcon()}
                  <span className="hidden xs:inline">{connectionStatus}</span>
                </div>

                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 bg-white/20 rounded-lg backdrop-blur-sm text-white touch-target"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Status Bar */}
            <div className="mt-3 flex items-center justify-between">
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  deviceStatus === "online" ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
                }`}
              >
                {getDeviceStatusIcon()}
                <span>Device: {deviceStatus}</span>
              </div>

              <div className="text-white text-xs">Last: {formatTime(lastUpdate)}</div>
            </div>
          </div>
        </header>
      ) : (
        // Desktop Header
        <header className="jk-gradient-bg shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Battery className="w-10 h-10 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">JK BMS Monitor</h1>
                  <p className="text-blue-100 text-sm">Professional Battery Management System</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                    isConnected ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
                  }`}
                >
                  {getStatusIcon()}
                  <span>{connectionStatus}</span>
                </div>

                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                    deviceStatus === "online" ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
                  }`}
                >
                  {getDeviceStatusIcon()}
                  <span>Device: {deviceStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl slide-down">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-900">Menu</h3>
            </div>
            <div className="p-4 space-y-2">
              {[
                { id: "overview", label: "Overview", icon: Activity },
                { id: "cells", label: "Cell Monitor", icon: Battery },
                { id: "charts", label: "Analytics", icon: TrendingUp },
                { id: "settings", label: "Settings", icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id)
                    setShowMobileMenu(false)
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors touch-target ${
                    activeTab === id ? "bg-jk-primary text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: Activity },
                { id: "cells", label: "Cell Monitor", icon: Battery },
                { id: "charts", label: "Analytics", icon: TrendingUp },
                { id: "settings", label: "Settings", icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-3 font-semibold text-sm transition-all duration-300 ${
                    activeTab === id
                      ? "border-jk-primary text-jk-primary bg-blue-50/50"
                      : "border-transparent text-gray-600 hover:text-jk-primary hover:border-jk-primary/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Critical Alerts - Mobile Optimized */}
      {alerts.length > 0 && (
        <div className="px-4 py-3">
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 shadow-md animate-fade-in ${
                  alert.type === "danger"
                    ? "bg-red-50 border-red-500 text-red-800"
                    : alert.type === "warning"
                      ? "bg-amber-50 border-amber-500 text-amber-800"
                      : "bg-blue-50 border-blue-500 text-blue-800"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 animate-pulse-slow flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm">{alert.type === "danger" ? "CRITICAL" : "WARNING"}</p>
                    <p className="text-xs">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pull to Refresh */}
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Main Content */}
      <main className={`px-4 py-4 ${isMobile ? "pb-20" : "max-w-7xl mx-auto sm:px-6 lg:px-8 py-8"}`}>
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Status Cards - Mobile Optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <StatusCard
                title="Voltage"
                value={bmsData?.voltage ? `${bmsData.voltage.toFixed(1)}V` : "N/A"}
                icon={<Zap className="w-6 h-6 sm:w-8 sm:h-8" />}
                color="primary"
                trend={bmsData?.voltage > 50 ? "up" : "down"}
                subtitle="Pack"
                isMobile={isMobile}
              />
              <StatusCard
                title="Current"
                value={bmsData?.current ? `${bmsData.current.toFixed(1)}A` : "N/A"}
                icon={<Activity className="w-6 h-6 sm:w-8 sm:h-8" />}
                color={bmsData?.current > 0 ? "success" : bmsData?.current < 0 ? "warning" : "primary"}
                trend={bmsData?.current > 0 ? "up" : "down"}
                subtitle={bmsData?.current > 0 ? "Charge" : bmsData?.current < 0 ? "Discharge" : "Idle"}
                isMobile={isMobile}
              />
              <StatusCard
                title="SOC"
                value={bmsData?.soc ? `${bmsData.soc.toFixed(0)}%` : "N/A"}
                icon={<Battery className="w-6 h-6 sm:w-8 sm:h-8" />}
                color={bmsData?.soc > 50 ? "success" : bmsData?.soc > 20 ? "warning" : "danger"}
                trend="stable"
                subtitle="Battery"
                isMobile={isMobile}
              />
              <StatusCard
                title="Temp"
                value={bmsData?.temperature ? `${bmsData.temperature.toFixed(0)}°C` : "N/A"}
                icon={<Thermometer className="w-6 h-6 sm:w-8 sm:h-8" />}
                color={bmsData?.temperature < 40 ? "success" : bmsData?.temperature < 50 ? "warning" : "danger"}
                trend="stable"
                subtitle="Pack"
                isMobile={isMobile}
              />
            </div>

            {/* Power Information Panel - Mobile Optimized */}
            <div className="jk-card-dark p-4 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                <span>Power Info</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wide">Power</p>
                  <p className="text-2xl sm:text-4xl font-bold text-yellow-400 mt-1 sm:mt-2">
                    {bmsData?.power ? `${Math.abs(bmsData.power).toFixed(0)}W` : "0W"}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {bmsData?.power > 0 ? "Charging" : bmsData?.power < 0 ? "Discharging" : "Standby"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wide">Energy</p>
                  <p className="text-2xl sm:text-4xl font-bold text-green-400 mt-1 sm:mt-2">12.5kWh</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Today</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wide">Efficiency</p>
                  <p className="text-2xl sm:text-4xl font-bold text-blue-400 mt-1 sm:mt-2">94%</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">System</p>
                </div>
              </div>
            </div>

            {/* System Status Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="jk-card p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-jk-primary" />
                  <span>System Status</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Connection</p>
                    <p
                      className={`font-bold text-sm sm:text-base ${
                        connectionQuality === "Excellent"
                          ? "text-jk-success"
                          : connectionQuality === "Good"
                            ? "text-jk-warning"
                            : "text-jk-danger"
                      }`}
                    >
                      {connectionQuality}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Update</p>
                    <p className="font-mono text-xs sm:text-sm text-gray-600">{formatTime(lastUpdate)}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Balancing</p>
                    <p
                      className={`font-bold text-sm sm:text-base ${bmsData?.balancing ? "text-jk-warning" : "text-jk-success"}`}
                    >
                      {bmsData?.balancing ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Protection</p>
                    <p className="font-bold text-sm sm:text-base text-jk-success">Normal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cells" && <CellGrid cellVoltages={bmsData?.cell_voltages || []} isMobile={isMobile} />}

        {activeTab === "charts" && <PowerChart bmsData={bmsData} isMobile={isMobile} />}

        {activeTab === "settings" && (
          <SettingsPanel
            onSendCommand={publishCommand}
            onSendOTA={publishOTA}
            isConnected={isConnected}
            isMobile={isMobile}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  )
}

export default JKBMSApp
