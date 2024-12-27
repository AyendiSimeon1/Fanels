import { DashboardNav } from '@/components/Dashboard/Nav'
import { DashboardSidebar } from '@/components/Dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardNav />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}