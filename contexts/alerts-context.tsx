"use client"

import type React from "react"

import type { Alert } from "@/types/crypto"
import { createContext, useContext, useEffect, useState } from "react"

interface AlertsContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, "id" | "createdAt">) => void
  removeAlert: (id: string) => void
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined)

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  // Load alerts from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem("crypto-alerts")
    if (savedAlerts) {
      try {
        const parsedAlerts = JSON.parse(savedAlerts)
        // Convert date strings back to Date objects
        const alertsWithDates = parsedAlerts.map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
        }))
        setAlerts(alertsWithDates)
      } catch (error) {
        console.error("Failed to parse saved alerts:", error)
      }
    }
  }, [])

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("crypto-alerts", JSON.stringify(alerts))
  }, [alerts])

  const addAlert = (newAlert: Omit<Alert, "id" | "createdAt">) => {
    const alert: Alert = {
      ...newAlert,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setAlerts((prev) => [...prev, alert])
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  return <AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>{children}</AlertsContext.Provider>
}

export function useAlerts() {
  const context = useContext(AlertsContext)
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertsProvider")
  }
  return context
}
