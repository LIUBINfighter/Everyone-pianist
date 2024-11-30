"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { audioEngine, getAudioEngine } from '@/lib/audio'
import { ParticleSystem } from '@/lib/animation'
import { Song, Note, AudioSettings, defaultAudioSettings } from '@/lib/types'
import { songs as defaultSongs } from '@/lib/songs/demo'
import { ControlPanel } from './ControlPanel'

export const PerformanceView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const animationFrameRef = useRef<number>()
  const [currentSong, setCurrentSong] = useState<Song>(defaultSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)

  // 添加新的状态
  const [songs, setSongs] = useState<Song[]>(defaultSongs)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(defaultAudioSettings)
  const [isAudioInitialized, setIsAudioInitialized] = useState(false)

  // 添加按键状态追踪
  const pressedKeysRef = useRef<Set<string>>(new Set())
  const lastPlayTimeRef = useRef<number>(0)
  const minPlayInterval = 100 // 最小播放间隔(ms)

  // 初始化画布和粒子系统
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布尺寸
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particleSystemRef.current = new ParticleSystem(
        ctx,
        canvas.width,
        canvas.height
      )
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // 动画循环
    const animate = () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.clear()
        particleSystemRef.current.update()
        particleSystemRef.current.draw()
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // 初始化时生成所有音符的气泡
  useEffect(() => {
    if (!particleSystemRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const totalNotes = currentSong.notes.length;
    const verticalSpacing = canvas.height / (totalNotes + 1);
    
    // 为每个符创建一个气泡
    currentSong.notes.forEach((_, index) => {
      const y = verticalSpacing * (index + 1);
      particleSystemRef.current?.addBubbleNote(y);
    });
  }, [currentSong]);

  // 修改播放动画逻辑
  const playNoteWithAnimation = useCallback(async (note: Note, index: number) => {
    if (!particleSystemRef.current || !canvasRef.current || !audioEngine) return;

    const canvas = canvasRef.current;
    const verticalSpacing = canvas.height / (currentSong.notes.length + 1);
    const y = verticalSpacing * (index + 1);

    // 添加已播放的气泡
    particleSystemRef.current.addBubbleNote(y, true);

    // 播放音符
    try {
      if (Array.isArray(note.pitch)) {
        await audioEngine.playChord(note.pitch, note.duration);
      } else {
        await audioEngine.playNote(note.pitch, note.duration);
      }
    } catch (error) {
      console.error('播放音符失败:', error);
    }
  }, [currentSong.notes.length]);

  // 处理按键事件
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // 如果按键已经被按下,则忽略
      if (pressedKeysRef.current.has(e.code)) {
        return
      }

      // 检查是否满足最小播放间隔
      const now = Date.now()
      if (now - lastPlayTimeRef.current < minPlayInterval) {
        return
      }

      // 记录按键状态
      pressedKeysRef.current.add(e.code)
      
      if (isPlaying) return
      
      const currentNote = currentSong.notes[currentNoteIndex]
      if (!currentNote) return

      setIsPlaying(true)
      lastPlayTimeRef.current = now

      try {
        await playNoteWithAnimation(currentNote, currentNoteIndex)
        setCurrentNoteIndex(prev => 
          prev < currentSong.notes.length - 1 ? prev + 1 : 0
        )
        setTimeout(() => setIsPlaying(false), minPlayInterval)
      } catch (error) {
        console.error('播放失败:', error)
        setIsPlaying(false)
      }
    }

    // 处理按键释放
    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeysRef.current.delete(e.code)
    }

    // 处理页面失焦时清理按键状态
    const handleBlur = () => {
      pressedKeysRef.current.clear()
      setIsPlaying(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [currentNoteIndex, currentSong.notes, isPlaying, playNoteWithAnimation])

  // 添加处理函数
  const handleSongAdd = (newSong: Song) => {
    setSongs(prev => [...prev, newSong])
    setCurrentSong(newSong)  // 可选：自动切换到新添加的歌曲
    setCurrentNoteIndex(0)   // 重置音符索引
  }

  const handleSettingsChange = useCallback((newSettings: AudioSettings) => {
    setAudioSettings(newSettings);
    try {
      if (isAudioInitialized) {
        const engine = getAudioEngine();
        engine.updateSettings(newSettings);
      }
    } catch (error) {
      console.error('更新音频设置失败:', error);
    }
  }, [isAudioInitialized]);

  // 初始化音频引擎
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !isAudioInitialized) {
        const engine = getAudioEngine();
        setIsAudioInitialized(true);
        // 初始化时应用当前设置
        engine.updateSettings(audioSettings);
      }
    } catch (error) {
      console.error('初始化音频引擎失败:', error);
    }
  }, [audioSettings, isAudioInitialized]);

  return (
    <div className="fixed inset-0 bg-music-gradient">
      {/* 添加控制面板 */}
      <ControlPanel
        onSongAdd={handleSongAdd}
        audioSettings={audioSettings}
        onSettingsChange={handleSettingsChange}
      />

      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* 添加歌曲选择器 */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {songs.map((song) => (
          <button
            key={song.title}
            onClick={() => {
              setCurrentSong(song)
              setCurrentNoteIndex(0)
            }}
            className={`
              px-4 py-2 rounded-full transition-all
              ${currentSong.title === song.title
                ? 'bg-white text-black'
                : 'bg-gray-800/50 hover:bg-gray-800/70 text-white'}
            `}
          >
            {song.title}
          </button>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center z-10">
        <h1 className="text-4xl font-bold mb-4">{currentSong.title}</h1>
        <p className="text-xl opacity-70">按任意键演奏</p>
        <p className="mt-2 text-sm opacity-50">
          当前进度: {currentNoteIndex + 1} / {currentSong.notes.length}
        </p>
      </div>
    </div>
  )
} 