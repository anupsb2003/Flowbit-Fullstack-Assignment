"use client"
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"

export default function CategoryPie({ data }: { data: any[] }) {
  return (
    <div className="border rounded-lg p-4 h-80">
      <p className="text-sm font-semibold mb-2">Spend by Category</p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="totalSpend" nameKey="category" outerRadius={120} label />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
