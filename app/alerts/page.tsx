import { getTopCryptos } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AlertsList from "@/components/alerts-list"
import CreateAlertForm from "@/components/create-alert-form"

export default async function AlertsPage() {
  const cryptos = await getTopCryptos(100)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Price Alerts</h1>
        <p className="text-muted-foreground">Set up alerts for cryptocurrency price movements</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Alert</CardTitle>
            <CardDescription>Set up a new price alert for a cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateAlertForm cryptos={cryptos} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Alerts</CardTitle>
            <CardDescription>Manage your existing price alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertsList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
