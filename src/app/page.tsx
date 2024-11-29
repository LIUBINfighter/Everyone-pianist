import { Piano } from '@/components/Piano'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Everyone Piano!</h1>
      <h2 className="text-1xl font-bold mb-1">人人可成为钢琴家，Play your own midi!</h2>
      <Piano />
    </main>
  )
}
