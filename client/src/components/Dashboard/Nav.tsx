'use client'

import { Bell, Search, Settings } from 'lucide-react'
import Link from 'next/link'

export function DashboardNav() {
  return (
    <header className="h-16 border-b bg-white dark:bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search templates..."
              className="w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-4 py-2 text-sm outline-none focus:border-[#27AE60] focus:ring-1 focus:ring-[#27AE60]"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-[#27AE60] text-white flex items-center justify-center">
            U
          </div>
        </div>
      </div>
    </header>
  )
}