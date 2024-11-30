"use client"

import React from 'react'
import { useTheme } from 'next-themes'

export const ThemeToggle: React.FC = () => {
  // 添加mounted状态来处理hydration
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // 在客户端挂载后再渲染内容
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 在挂载前返回占位符
  if (!mounted) {
    return (
      <button 
        className="fixed top-4 right-4 p-2 rounded-lg bg-gray-800 dark:bg-gray-200 transition-colors"
        aria-label="切换主题"
      >
        <span className="opacity-0">🌙</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-4 right-4 p-2 rounded-lg bg-gray-800 dark:bg-gray-200 transition-colors"
      aria-label="切换主题"
    >
      <span>{theme === 'dark' ? '🌞' : '🌙'}</span>
    </button>
  )
} 