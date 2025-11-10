"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function VendorSpendBar({ data }: { data: any[] }) {
  return (
    <div className="border rounded-lg p-4 h-80">
      <p className="text-sm font-semibold mb-2">Top 10 Vendors by Spend</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
          <XAxis type="number" />
          <YAxis dataKey="vendor" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="totalSpend" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
