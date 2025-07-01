"use client"

import { useState, useEffect, useRef } from "react"
import mqtt from "mqtt"
import toast from "react-hot-toast"

const MQTT_CONFIG = {
  host: "800183b566f44f8b814485f15e6f0a9d.s1.eu.hivemq.cloud",
  port: 8884,
  protocol: "wss",
  username: "0971969218",
  password: "Bmsjk0971969218",
  clientId: `WebApp_${Math.random().toString(16).substr(2, 8)}`,
}

const TOPICS = {
  DATA: "bms/data",
  STATUS: "bms/status",
  LOGS: "bms/logs",
  COMMAND: "bms/command",
  OTA: "bms/ota",
}

export const useMQTT = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState({})
  const [connectionStatus, setConnectionStatus] = useState("Disconnected")
  const clientRef = useRef(null)

  useEffect(() => {
    const connectMQTT = () => {
      try {
        const client = mqtt.connect(`${MQTT_CONFIG.protocol}://${MQTT_CONFIG.host}:${MQTT_CONFIG.port}`, {
          clientId: MQTT_CONFIG.clientId,
          username: MQTT_CONFIG.username,
          password: MQTT_CONFIG.password,
          clean: true,
          reconnectPeriod: 5000,
          connectTimeout: 30000,
          keepalive: 60,
        })

        client.on("connect", () => {
          console.log("MQTT Connected")
          setIsConnected(true)
          setConnectionStatus("Connected")
          toast.success("MQTT Connected")

          // Subscribe to all topics
          Object.values(TOPICS).forEach((topic) => {
            client.subscribe(topic, (err) => {
              if (err) {
                console.error(`Failed to subscribe to ${topic}:`, err)
                toast.error(`Failed to subscribe to ${topic}`)
              } else {
                console.log(`Subscribed to ${topic}`)
              }
            })
          })
        })

        client.on("message", (topic, message) => {
          try {
            const data = JSON.parse(message.toString())
            setMessages((prev) => ({
              ...prev,
              [topic]: {
                data,
                timestamp: new Date().toISOString(),
              },
            }))

            // Handle specific message types
            if (topic === TOPICS.LOGS) {
              const level = data.level?.toLowerCase()
              if (level === "error") {
                toast.error(`BMS Error: ${data.message}`)
              } else if (level === "warn") {
                toast.error(`BMS Warning: ${data.message}`, { icon: "⚠️" })
              }
            }

            if (topic === TOPICS.STATUS && data.status === "online") {
              toast.success("BMS Device Online")
            }
          } catch (error) {
            console.error("Failed to parse MQTT message:", error)
            setMessages((prev) => ({
              ...prev,
              [topic]: {
                data: message.toString(),
                timestamp: new Date().toISOString(),
              },
            }))
          }
        })

        client.on("error", (error) => {
          console.error("MQTT Error:", error)
          setConnectionStatus("Error")
          toast.error("MQTT Connection Error")
        })

        client.on("disconnect", () => {
          console.log("MQTT Disconnected")
          setIsConnected(false)
          setConnectionStatus("Disconnected")
          toast.error("MQTT Disconnected")
        })

        client.on("reconnect", () => {
          console.log("MQTT Reconnecting...")
          setConnectionStatus("Reconnecting")
        })

        clientRef.current = client
      } catch (error) {
        console.error("MQTT Connection Error:", error)
        toast.error("Failed to connect to MQTT")
      }
    }

    connectMQTT()

    return () => {
      if (clientRef.current) {
        clientRef.current.end()
      }
    }
  }, [])

  const publishCommand = (command) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish(TOPICS.COMMAND, command, (err) => {
        if (err) {
          toast.error("Failed to send command")
        } else {
          toast.success(`Command sent: ${command}`)
        }
      })
    } else {
      toast.error("MQTT not connected")
    }
  }

  const publishOTA = (url) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish(TOPICS.OTA, url, (err) => {
        if (err) {
          toast.error("Failed to send OTA command")
        } else {
          toast.success("OTA update initiated")
        }
      })
    } else {
      toast.error("MQTT not connected")
    }
  }

  return {
    isConnected,
    connectionStatus,
    messages,
    publishCommand,
    publishOTA,
    topics: TOPICS,
  }
}
