"use client"

import { useState } from "react"
import { Send, Download, RefreshCw, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

const SettingsPanel = ({ onSendCommand, onSendOTA, isConnected }) => {
  const [otaUrl, setOtaUrl] = useState("")
  const [customCommand, setCustomCommand] = useState("")

  const handleCommand = (command) => {
    if (!isConnected) {
      toast.error("MQTT not connected")
      return
    }
    onSendCommand(command)
  }

  const handleOTA = () => {
    if (!otaUrl.trim()) {
      toast.error("Please enter OTA URL")
      return
    }
    if (!isConnected) {
      toast.error("MQTT not connected")
      return
    }
    onSendOTA(otaUrl)
    setOtaUrl("")
  }

  const handleCustomCommand = () => {
    if (!customCommand.trim()) {
      toast.error("Please enter a command")
      return
    }
    handleCommand(customCommand)
    setCustomCommand("")
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h3>
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg ${
            isConnected ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700"
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-success-500" : "bg-danger-500"}`} />
          <span className="font-medium">
            {isConnected ? "Connected to MQTT Broker" : "Disconnected from MQTT Broker"}
          </span>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Commands</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleCommand("STATUS")}
            disabled={!isConnected}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-primary-200 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-primary-700">Request Status</span>
          </button>

          <button
            onClick={() => handleCommand("RESTART")}
            disabled={!isConnected}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-warning-200 rounded-lg hover:bg-warning-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <AlertTriangle className="w-5 h-5 text-warning-600" />
            <span className="font-medium text-warning-700">Restart Device</span>
          </button>
        </div>
      </div>

      {/* Custom Command */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Command</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            placeholder="Enter custom command..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            onKeyPress={(e) => e.key === "Enter" && handleCustomCommand()}
          />
          <button
            onClick={handleCustomCommand}
            disabled={!isConnected || !customCommand.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* OTA Update */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">OTA Firmware Update</h3>
        <div className="space-y-4">
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5" />
              <div className="text-sm text-warning-700">
                <p className="font-medium">Warning: OTA Update</p>
                <p>
                  This will restart the device and may cause temporary disconnection. Make sure the firmware URL is
                  correct.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <input
              type="url"
              value={otaUrl}
              onChange={(e) => setOtaUrl(e.target.value)}
              placeholder="https://example.com/firmware.bin"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={handleOTA}
              disabled={!isConnected || !otaUrl.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">MQTT Server:</span>
            <span className="font-mono text-gray-900">800183b566f44f8b814485f15e6f0a9d.s1.eu.hivemq.cloud</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">WebSocket Port:</span>
            <span className="font-mono text-gray-900">8884</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Topics:</span>
            <span className="font-mono text-gray-900">bms/data, bms/status, bms/logs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Client ID:</span>
            <span className="font-mono text-gray-900">WebApp_{"{random}"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
