import { Piano } from '@/components/Piano'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">在线钢琴</h1>
      <Piano />
    </main>
  )
}
