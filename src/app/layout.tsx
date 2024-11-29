import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Navigation } from '@/components/Navigation'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem={true}
        >
          <Navigation />
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
