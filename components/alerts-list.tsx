"use client"

import { useAlerts } from "@/contexts/alerts-context"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon, BellOffIcon, TrashIcon } from "lucide-react"

export default function AlertsList() {
  const { alerts, removeAlert } = useAlerts()

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <BellOffIcon className="h-12 w-12 mb-4" />
        <p>You don't have any alerts set up yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">
              {alert.cryptoName} ({alert.cryptoSymbol})
            </div>
            <div className="flex items-center gap-1 text-sm">
              {alert.isAbove ? (
                <ArrowUpIcon className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 text-red-500" />
              )}
              <span>
                Alert when price goes {alert.isAbove ? "above" : "below"} {formatCurrency(alert.targetPrice)}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeAlert(alert.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
