import { API } from "@/lib/api"
import { MetricCard } from "@/web/components/cards/metric-card"
import InvoiceTrendLine from "@/web/components/charts/invoice-trend-line"
import VendorSpendBar from "@/web/components/charts/vendor-spend-bar"
import CategoryPie from "@/web/components/charts/category-pie"
import CashOutflowBar from "@/web/components/charts/cash-outflow-bar"
import InvoicesTable from "@/web/components/data-table/invoices-table"

export default async function DashboardPage() {
  const [stats, trends, vendors, categories, cash] = await Promise.all([
    API.stats(),
    API.invoiceTrends(),
    API.vendorTop10(),
    API.categorySpend(),
    API.cashOutflow(),
  ])

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Spend (YTD)" value={stats.totalSpendYTD} format="currency" />
        <MetricCard title="Invoices Processed" value={stats.totalInvoices} />
        <MetricCard title="Documents Uploaded" value={stats.documentsUploaded} />
        <MetricCard title="Average Invoice Value" value={stats.avgInvoiceValue} format="currency" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <InvoiceTrendLine data={trends} />
        <VendorSpendBar data={vendors} />
        <CategoryPie data={categories} />
        <CashOutflowBar data={cash} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Invoices</h2>
        <InvoicesTable />
      </section>
    </div>
  )
}
