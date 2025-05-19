"use client"

import type React from "react"

import type { Crypto } from "@/types/crypto"
import { useAlerts } from "@/contexts/alerts-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/format"

interface CreateAlertFormProps {
  cryptos: Crypto[]
}

export default function CreateAlertForm({ cryptos }: CreateAlertFormProps) {
  const { addAlert } = useAlerts()
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [targetPrice, setTargetPrice] = useState("")
  const [isAbove, setIsAbove] = useState<boolean>(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCrypto || !targetPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(targetPrice)
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    addAlert({
      cryptoId: selectedCrypto.id,
      cryptoName: selectedCrypto.name,
      cryptoSymbol: selectedCrypto.symbol,
      targetPrice: price,
      isAbove,
    })

    toast({
      title: "Alert Created",
      description: `You will be alerted when ${selectedCrypto.name} goes ${isAbove ? "above" : "below"} ${formatCurrency(price)}`,
    })

    // Reset form
    setSelectedCrypto(null)
    setTargetPrice("")
    setIsAbove(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="crypto">Cryptocurrency</Label>
        <Select
          value={selectedCrypto?.id || ""}
          onValueChange={(value) => {
            const crypto = cryptos.find((c) => c.id === value)
            setSelectedCrypto(crypto || null)

            // Set a default target price based on current price
            if (crypto) {
              const currentPrice = Number.parseFloat(crypto.priceUsd)
              setTargetPrice(currentPrice.toString())
            }
          }}
        >
          <SelectTrigger id="crypto">
            <SelectValue placeholder="Select a cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            {cryptos.map((crypto) => (
              <SelectItem key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Target Price (USD)</Label>
        <Input
          id="price"
          type="number"
          step="0.000001"
          min="0"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="Enter target price"
        />
      </div>

      <div className="space-y-2">
        <Label>Alert Condition</Label>
        <RadioGroup
          value={isAbove ? "above" : "below"}
          onValueChange={(value) => setIsAbove(value === "above")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="above" id="above" />
            <Label htmlFor="above">Price goes above target</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="below" id="below" />
            <Label htmlFor="below">Price goes below target</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full">
        Create Alert
      </Button>
    </form>
  )
}
