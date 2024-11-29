"use client"

import { useEffect, useRef, useState } from 'react'
import { audioEngine } from '@/lib/audio'
import { Song, Note } from '@/lib/types'
import { songs as defaultSongs } from '@/lib/songs/demo'

export const PerformanceView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentSong, setCurrentSong] = useState<Song>(defaultSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)

  // 动画相关状态
  const [particles, setParticles] = useState<any[]>([])
  const animationFrameRef = useRef<number>()

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 处理窗口大小变化
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 处理按键事件
  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (isPlaying) return
      
      const currentNote = currentSong.notes[currentNoteIndex]
      if (!currentNote) return

      setIsPlaying(true)

      try {
        // 播放音符
        if (Array.isArray(currentNote.pitch)) {
          await audioEngine.playChord(currentNote.pitch, currentNote.duration)
        } else {
          await audioEngine.playNote(currentNote.pitch, currentNote.duration)
        }

        // 添加动画粒子
        addParticles(currentNote)

        // 更新音符索引
        setCurrentNoteIndex(prev => 
          prev < currentSong.notes.length - 1 ? prev + 1 : 0
        )

        setTimeout(() => setIsPlaying(false), 10)
      } catch (error) {
        console.error('播放失败:', error)
        setIsPlaying(false)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [currentNoteIndex, currentSong.notes, isPlaying])

  // 添加动画粒子
  const addParticles = (note: Note) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const newParticles = Array.from({ length: 10 }, () => ({
      x: centerX,
      y: centerY,
      size: Math.random() * 5 + 2,
      speedX: (Math.random() - 0.5) * 10,
      speedY: (Math.random() - 0.5) * 10,
      color: `hsl(${Math.random() * 360}, 70%, 70%)`,
      alpha: 1
    }))

    setParticles(prev => [...prev, ...newParticles])
  }

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const updatedParticles = particles.map(particle => ({
        ...particle,
        x: particle.x + particle.speedX,
        y: particle.y + particle.speedY,
        alpha: particle.alpha - 0.01,
        size: particle.size * 0.99
      })).filter(particle => particle.alpha > 0)

      updatedParticles.forEach(particle => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      setParticles(updatedParticles)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [particles])

  return (
    <div className="fixed inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">{currentSong.title}</h1>
        <p className="text-xl opacity-70">按任意键演奏</p>
      </div>
    </div>
  )
} 