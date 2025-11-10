export type Stats = {
  totalSpendYTD: number
  totalInvoices: number
  documentsUploaded: number
  avgInvoiceValue: number
}

export type InvoiceTrendPoint = {
  month: string
  invoiceCount: number
  totalValue: number
}

export type VendorSpend = {
  vendor: string
  totalSpend: number
}

export type CategorySpend = {
  category: string
  totalSpend: number
}

export type CashOutflow = {
  date: string
  amount: number
}

export type Invoice = {
  id: string
  vendor: string
  invoiceNumber: string
  date: string
  amount: number
  status: string
}

export type ChatResponse = {
  sql: string
  data: any[]
}
