'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  CircleStackIcon as DatabaseIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: '概览', href: '/', icon: HomeIcon },
  { name: '知识库管理', href: '/knowledge', icon: DatabaseIcon },
  { name: '对话管理', href: '/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Prompt 管理', href: '/prompts', icon: DocumentTextIcon },
  { name: 'Agent 管理', href: '/agents', icon: UserGroupIcon },
  { name: '评测与监控', href: '/evaluation', icon: BeakerIcon },
  { name: '分析报告', href: '/analytics', icon: ChartBarIcon },
  { name: '权限管理', href: '/permissions', icon: ShieldCheckIcon },
  { name: '系统设置', href: '/settings', icon: CogIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">xBot 2.0</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
