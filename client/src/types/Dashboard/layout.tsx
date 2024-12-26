import { DashboardNav } from '@/components/dashboard/nav'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

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