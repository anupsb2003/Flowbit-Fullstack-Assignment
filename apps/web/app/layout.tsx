import './globals.css'
import { Sidebar } from '@/web/components/shell/app-sidebar'
import { Header } from '@/web/components/shell/app-header'

export const metadata = {
  title: 'Flowbit Analytics',
  description: 'Interactive analytics dashboard with chat-based data insights',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
