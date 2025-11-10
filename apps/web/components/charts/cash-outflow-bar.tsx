"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function CashOutflowBar({ data }: { data: any[] }) {
  return (
    <div className="border rounded-lg p-4 h-80">
      <p className="text-sm font-semibold mb-2">Cash Outflow Forecast</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
