"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/chat", label: "Chat with Data", icon: MessageSquare },
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-60 border-r bg-muted/10 p-4">
      <h2 className="text-xl font-bold mb-6">Flowbit</h2>
      <nav className="space-y-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted",
              path === href && "bg-muted font-semibold"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
