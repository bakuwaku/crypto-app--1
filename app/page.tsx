import { getTopCryptos } from "@/lib/api"
import CryptoItem from "@/components/crypto-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export default async function HomePage() {
  const cryptos = await getTopCryptos(10)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Tracker</h1>
        <p className="text-muted-foreground">Track prices and set alerts for your favorite cryptocurrencies</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Cryptocurrencies</CardTitle>
            <CardDescription>Based on market capitalization</CardDescription>
          </div>
          <Link href="/charts">
            <Button variant="outline" size="sm" className="gap-1">
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 divide-y">
            {cryptos.map((crypto) => (
              <CryptoItem key={crypto.id} crypto={crypto} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Charts</CardTitle>
            <CardDescription>View detailed price charts for any cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Link href="/charts">
              <Button>View Charts</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Alerts</CardTitle>
            <CardDescription>Set up alerts for price movements</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Link href="/alerts">
              <Button>Manage Alerts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
