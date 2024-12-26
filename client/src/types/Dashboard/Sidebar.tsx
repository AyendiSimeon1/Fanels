'use client'

import { 
  Home, 
  FolderOpen, 
  History, 
  Settings, 
  HelpCircle,
  FilePresentation,
  PlusCircle
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  title: string
  href: string
  icon: typeof Home
}

const navItems: NavItem[] = [
  { title: 'Overview', href: '/dashboard', icon: Home },
  { title: 'Templates', href: '/dashboard/templates', icon: FilePresentation },
  { title: 'My Presentations', href: '/dashboard/presentations', icon: FolderOpen },
  { title: 'History', href: '/dashboard/history', icon: History },
]

const bottomNavItems: NavItem[] = [
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  { title: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href
    const Icon = item.icon
    
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
          isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50' : ''
        }`}
      >
        <Icon className="h-5 w-5" />
        {item.title}
      </Link>
    )
  }

  return (
    <div className="w-64 border-r bg-white dark:bg-gray-900">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <FilePresentation className="h-6 w-6 text-[#27AE60]" />
          <span>AI Slides</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 p-6">
        <button className="w-full flex items-center justify-center gap-2 bg-[#27AE60] text-white rounded-lg px-3 py-2 hover:bg-[#219653] transition-colors">
          <PlusCircle className="h-5 w-5" />
          New Presentation
        </button>
        <div className="space-y-1 mt-4">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
        <div className="mt-auto pt-4 border-t space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}