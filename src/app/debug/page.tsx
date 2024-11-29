import { Piano } from '@/components/Piano'

export default function DebugPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">调试界面</h1>
      <Piano />
    </main>
  )
} 