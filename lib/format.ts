export function formatCurrency(value: string | number, maximumFractionDigits = 2): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(numValue)
}

export function formatNumber(value: string | number, maximumFractionDigits = 2): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(numValue)
}

export function formatPercentage(value: string | number): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(numValue / 100)
}
