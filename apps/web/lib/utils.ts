export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export function formatCurrency(value: number, currency: string = "USD") {
  return value.toLocaleString("en-US", { style: "currency", currency })
}

export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function sortBy<T>(array: T[], key: keyof T, desc = false): T[] {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return desc ? 1 : -1
    if (a[key] > b[key]) return desc ? -1 : 1
    return 0
  })
}
