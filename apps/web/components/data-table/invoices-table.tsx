"use client"
import { useEffect, useState } from "react"
import { API } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"

export default function InvoicesTable() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    API.invoices().then((res) => setInvoices(res.rows || []))
  }, [])

  const filtered = invoices.filter(
    (i) =>
      i.vendor.toLowerCase().includes(search.toLowerCase()) ||
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Invoice #</TableCell>
              <TableCell className="text-right">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.vendor}</TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.invoiceNumber}</TableCell>
                <TableCell className="text-right">${row.amount}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
