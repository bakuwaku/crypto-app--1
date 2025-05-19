import { getCryptoById, getCryptoHistory } from "@/lib/api"
import { formatCurrency, formatPercentage } from "@/lib/format"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { notFound } from "next/navigation"
import CryptoChart from "@/components/crypto-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CryptoPageProps {
  params: {
    id: string
  }
}

export default async function CryptoPage({ params }: CryptoPageProps) {
  const crypto = await getCryptoById(params.id)

  if (!crypto) {
    notFound()
  }

  const history = await getCryptoHistory(params.id)
  const priceChange = Number.parseFloat(crypto.changePercent24Hr)
  const isPositive = priceChange >= 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{crypto.name}</h1>
          <span className="text-muted-foreground font-mono">({crypto.symbol})</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-mono">{formatCurrency(crypto.priceUsd)}</div>
          <div className={cn("flex items-center gap-1 text-lg", isPositive ? "text-green-500" : "text-red-500")}>
            {isPositive ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
            {formatPercentage(crypto.changePercent24Hr)}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
          <CardDescription>Historical price data (daily interval)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <CryptoChart data={history} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(crypto.marketCapUsd)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(crypto.volumeUsd24Hr)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {Number.parseFloat(crypto.supply).toLocaleString()} {crypto.symbol}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{crypto.rank}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
