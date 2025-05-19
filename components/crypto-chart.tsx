"use client"

import type { CryptoHistory } from "@/types/crypto"
import { formatCurrency } from "@/lib/format"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CryptoChartProps {
  data: CryptoHistory[]
}

export default function CryptoChart({ data }: CryptoChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.time).toLocaleDateString(),
    price: Number.parseFloat(item.priceUsd),
  }))

  return (
    <ChartContainer
      config={{
        price: {
          label: "Price",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickMargin={10}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis tickFormatter={(value) => formatCurrency(value, 0)} width={80} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="price" stroke="var(--color-price)" fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
