import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

export function MetricCard({
  title,
  value,
  format,
}: {
  title: string
  value: number
  format?: "currency"
}) {
  const display =
    format === "currency"
      ? value.toLocaleString(undefined, { style: "currency", currency: "USD" })
      : value.toLocaleString()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{display}</p>
      </CardContent>
    </Card>
  )
}
