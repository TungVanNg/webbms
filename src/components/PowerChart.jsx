"use client"

import { useState, useEffect } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, Zap, Battery, Thermometer } from "lucide-react"

const PowerChart = ({ bmsData }) => {
  const [chartData, setChartData] = useState([])
  const [activeChart, setActiveChart] = useState("power")

  useEffect(() => {
    if (bmsData) {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now(),
        voltage: bmsData.voltage || 0,
        current: bmsData.current || 0,
        power: bmsData.power || 0,
        soc: bmsData.soc || 0,
        temperature: bmsData.temperature || 0,
      }

      setChartData((prev) => {
        const updated = [...prev, newDataPoint]
        // Keep only last 50 data points
        return updated.slice(-50)
      })
    }
  }, [bmsData])

  const chartConfigs = {
    power: {
      title: "Power Monitoring",
      icon: <Zap className="w-6 h-6" />,
      color: "#f59e0b",
      dataKey: "power",
      unit: "W",
    },
    voltage: {
      title: "Voltage Monitoring",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "#3b82f6",
      dataKey: "voltage",
      unit: "V",
    },
    soc: {
      title: "State of Charge",
      icon: <Battery className="w-6 h-6" />,
      color: "#10b981",
      dataKey: "soc",
      unit: "%",
    },
    temperature: {
      title: "Temperature",
      icon: <Thermometer className="w-6 h-6" />,
      color: "#ef4444",
      dataKey: "temperature",
      unit: "°C",
    },
  }

  const currentConfig = chartConfigs[activeChart]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Chart Selection */}
      <div className="jk-card p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-jk-primary" />
          <span>Real-time Analytics</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(chartConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveChart(key)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                activeChart === key
                  ? "border-jk-primary bg-jk-primary text-white shadow-lg"
                  : "border-gray-200 hover:border-jk-primary hover:bg-jk-primary/5"
              }`}
            >
              <div className="flex items-center space-x-3">
                {config.icon}
                <div className="text-left">
                  <p className="font-semibold">{config.title}</p>
                  <p className="text-sm opacity-75">
                    {bmsData?.[config.dataKey]?.toFixed(1) || "0"} {config.unit}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="jk-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
            {currentConfig.icon}
            <span>{currentConfig.title}</span>
          </h4>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="text-2xl font-bold" style={{ color: currentConfig.color }}>
              {bmsData?.[currentConfig.dataKey]?.toFixed(2) || "0"} {currentConfig.unit}
            </p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${activeChart}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} interval="preserveStartEnd" />
              <YAxis stroke="#6b7280" fontSize={12} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
                labelStyle={{ color: "#d1d5db" }}
              />
              <Area
                type="monotone"
                dataKey={currentConfig.dataKey}
                stroke={currentConfig.color}
                strokeWidth={3}
                fill={`url(#gradient-${activeChart})`}
                dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: currentConfig.color, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="jk-card p-6 text-center">
          <h5 className="text-sm text-gray-600 uppercase tracking-wide mb-2">24H Average</h5>
          <p className="text-3xl font-bold text-jk-primary">
            {chartData.length > 0
              ? (
                  chartData.reduce((sum, item) => sum + (item[currentConfig.dataKey] || 0), 0) / chartData.length
                ).toFixed(2)
              : "0"}{" "}
            {currentConfig.unit}
          </p>
        </div>

        <div className="jk-card p-6 text-center">
          <h5 className="text-sm text-gray-600 uppercase tracking-wide mb-2">Peak Value</h5>
          <p className="text-3xl font-bold text-green-600">
            {chartData.length > 0
              ? Math.max(...chartData.map((item) => item[currentConfig.dataKey] || 0)).toFixed(2)
              : "0"}{" "}
            {currentConfig.unit}
          </p>
        </div>

        <div className="jk-card p-6 text-center">
          <h5 className="text-sm text-gray-600 uppercase tracking-wide mb-2">Data Points</h5>
          <p className="text-3xl font-bold text-gray-700">{chartData.length}</p>
        </div>
      </div>
    </div>
  )
}

export default PowerChart
