"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function InvoiceTrendLine({ data }: { data: any[] }) {
  return (
    <div className="border rounded-lg p-4 h-80">
      <p className="text-sm font-semibold mb-2">Invoice Volume + Value Trend</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="invoiceCount" stroke="#3b82f6" />
          <Line type="monotone" dataKey="totalValue" stroke="#f97316" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
