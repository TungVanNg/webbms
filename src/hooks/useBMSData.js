"use client"

import { useState, useEffect } from "react"
import { useMQTT } from "./useMQTT"

export const useBMSData = () => {
  const { messages, topics, isConnected } = useMQTT()
  const [bmsData, setBmsData] = useState(null)
  const [deviceStatus, setDeviceStatus] = useState("offline")
  const [lastUpdate, setLastUpdate] = useState(null)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Process BMS data
    if (messages[topics.DATA]) {
      const data = messages[topics.DATA].data
      setBmsData(data)
      setLastUpdate(new Date(messages[topics.DATA].timestamp))

      // Check for alerts
      const newAlerts = []

      if (data.voltage < 40) {
        newAlerts.push({ type: "danger", message: "Low voltage warning" })
      }
      if (data.voltage > 58) {
        newAlerts.push({ type: "danger", message: "High voltage warning" })
      }
      if (data.temperature > 45) {
        newAlerts.push({ type: "warning", message: "High temperature warning" })
      }
      if (data.soc < 20) {
        newAlerts.push({ type: "warning", message: "Low battery warning" })
      }

      // Check cell voltage imbalance
      if (data.cell_voltages && data.cell_voltages.length > 0) {
        const maxCell = Math.max(...data.cell_voltages)
        const minCell = Math.min(...data.cell_voltages)
        if (maxCell - minCell > 0.1) {
          newAlerts.push({ type: "warning", message: "Cell imbalance detected" })
        }
      }

      setAlerts(newAlerts)
    }

    // Process device status
    if (messages[topics.STATUS]) {
      const statusData = messages[topics.STATUS].data
      setDeviceStatus(
        statusData.status === "heartbeat" || statusData.status === "online" ? "online" : statusData.status,
      )
    }
  }, [messages, topics])

  // Auto-detect offline status
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdate && Date.now() - lastUpdate.getTime() > 60000) {
        setDeviceStatus("offline")
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [lastUpdate])

  const getStatusColor = () => {
    switch (deviceStatus) {
      case "online":
      case "heartbeat":
        return "success"
      case "offline":
        return "danger"
      default:
        return "warning"
    }
  }

  const getConnectionQuality = () => {
    if (!isConnected) return "Poor"
    if (!lastUpdate) return "No Data"

    const timeDiff = Date.now() - lastUpdate.getTime()
    if (timeDiff < 10000) return "Excellent"
    if (timeDiff < 30000) return "Good"
    if (timeDiff < 60000) return "Fair"
    return "Poor"
  }

  return {
    bmsData,
    deviceStatus,
    lastUpdate,
    alerts,
    isConnected,
    statusColor: getStatusColor(),
    connectionQuality: getConnectionQuality(),
  }
}
