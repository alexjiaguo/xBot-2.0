'use client'

import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            AI 运营平台控制台
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <UserCircleIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
