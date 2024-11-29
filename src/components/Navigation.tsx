"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navigation = () => {
  const pathname = usePathname()
  const isDebug = pathname === '/debug'

  return (
    <div className="fixed top-4 left-4 z-50">
      <Link
        href={isDebug ? '/' : '/debug'}
        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-full transition-all"
      >
        {isDebug ? '返回演奏界面' : '调试界面'}
      </Link>
    </div>
  )
} 