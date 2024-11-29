"use client"

import React from 'react'
import { useTheme } from 'next-themes'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-4 right-4 p-2 rounded-lg bg-gray-800 dark:bg-gray-200 transition-colors"
      aria-label="切换主题"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  )
} 