import { getTopCryptos } from "@/lib/api"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercentage } from "@/lib/format"
import { ArrowDownIcon, ArrowUpIcon, BarChart3Icon } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function ChartsPage() {
  const cryptos = await getTopCryptos(20)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Charts</h1>
        <p className="text-muted-foreground">Select a cryptocurrency to view detailed price charts</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cryptos.map((crypto) => {
          const priceChange = Number.parseFloat(crypto.changePercent24Hr)
          const isPositive = priceChange >= 0

          return (
            <Link key={crypto.id} href={`/charts/${crypto.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-muted-foreground">{crypto.rank}</div>
                      <CardTitle className="text-lg">{crypto.name}</CardTitle>
                    </div>
                    <div className="text-muted-foreground font-mono">{crypto.symbol}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xl">{formatCurrency(crypto.priceUsd)}</div>
                    <div className={cn("flex items-center gap-1", isPositive ? "text-green-500" : "text-red-500")}>
                      {isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                      {formatPercentage(crypto.changePercent24Hr)}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center text-muted-foreground">
                    <BarChart3Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
