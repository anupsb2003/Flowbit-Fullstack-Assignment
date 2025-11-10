const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001"

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const API = {
  stats: () => get<Stats>("/stats"),
  invoiceTrends: () => get<InvoiceTrendPoint[]>("/invoice-trends"),
  vendorTop10: () => get<VendorSpend[]>("/vendors/top10"),
  categorySpend: () => get<CategorySpend[]>("/category-spend"),
  cashOutflow: () => get<CashOutflow[]>("/cash-outflow"),
  invoices: () => get<{ rows: Invoice[] }>("/invoices"),

  chat: async (prompt: string) => {
    const res = await fetch(`${BASE}/chat-with-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
}

// Import these interfaces from ./types.ts
import { Stats, InvoiceTrendPoint, VendorSpend, CategorySpend, CashOutflow, Invoice } from "./types"
