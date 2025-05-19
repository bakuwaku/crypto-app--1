import type { Crypto } from "@/types/crypto"
import { formatCurrency, formatPercentage } from "@/lib/format"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CryptoItemProps {
  crypto: Crypto
}

export default function CryptoItem({ crypto }: CryptoItemProps) {
  const priceChange = Number.parseFloat(crypto.changePercent24Hr)
  const isPositive = priceChange >= 0

  return (
    <Link href={`/charts/${crypto.id}`} className="block hover:bg-muted/50 transition-colors rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm text-muted-foreground w-8">{crypto.rank}</div>
          <div>
            <div className="font-semibold">{crypto.name}</div>
            <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono">{formatCurrency(crypto.priceUsd)}</div>
          <div
            className={cn(
              "text-sm flex items-center justify-end gap-1",
              isPositive ? "text-green-500" : "text-red-500",
            )}
          >
            {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {formatPercentage(crypto.changePercent24Hr)}
          </div>
        </div>
      </div>
    </Link>
  )
}
