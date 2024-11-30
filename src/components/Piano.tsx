"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { audioEngine } from '@/lib/audio'
import { songs as defaultSongs } from '@/lib/songs/demo'
import { Song } from '@/lib/types'
import { SongUploader } from './SongUploader'
import { DemoTag } from './DemoTag'
import { AudioSettingsPanel } from './AudioSettings'
import { AudioSettings, defaultAudioSettings } from '@/lib/types'

export const Piano: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(defaultSongs)
  const [currentSong, setCurrentSong] = useState<Song>(songs[0])
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pressedKeys, setPressedKeys] = useState(new Set<string>())
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(defaultAudioSettings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // 处理歌曲切换
  const handleSongChange = (song: Song) => {
    setCurrentSong(song)
    setCurrentNoteIndex(0)
    setIsPlaying(false)
  }

  // 播放当前音符
  const playCurrentNote = useCallback(async () => {
    if (isPlaying || !audioEngine) return  // 添加 audioEngine 检查

    const currentNote = currentSong.notes[currentNoteIndex]
    if (currentNote) {
      setIsPlaying(true)
      
      try {
        // 判断是单音符还是和弦
        if (Array.isArray(currentNote.pitch)) {
          // 播放和弦
          audioEngine?.playChord(currentNote.pitch, currentNote.duration)
        } else {
          // 播放单音符
          audioEngine?.playNote(currentNote.pitch, currentNote.duration)
        }
        
        setCurrentNoteIndex(prev => 
          prev < currentSong.notes.length - 1 ? prev + 1 : 0
        )
        
        setTimeout(() => {
          setIsPlaying(false)
        }, 10)
      } catch (error) {
        console.error('Failed to play note:', error)
        setIsPlaying(false)
      }
    }
  }, [currentNoteIndex, currentSong.notes, isPlaying])

  // 处理按键事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('键盘按下:', {
        code: event.code,
        key: event.key,
        repeat: event.repeat
      });
      // 如果按键已经被按下，则忽略
      if (pressedKeys.has(event.code)) return
      
      // 添加新按下的键
      setPressedKeys(prev => new Set(prev).add(event.code))
      
      // 播放音符
      playCurrentNote()
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // 移除释放的键
      setPressedKeys(prev => {
        const next = new Set(prev)
        next.delete(event.code)
        return next
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      audioEngine?.stopAll()
    }
  }, [playCurrentNote, pressedKeys])

  // 渲染乐谱显示
  const renderNotes = () => {
    return currentSong.notes.map((note, index) => (
      <div
        key={index}
        className={`
          inline-block px-2 py-1 m-1 rounded
          ${index === currentNoteIndex ? 'bg-blue-500 text-white dark:text-white' : 'bg-gray-100 dark:text-black'}
          ${index < currentNoteIndex ? 'bg-gray-300 dark:bg-gray-700 ' : ''}
        `}
      >
        {note.pitch}
      </div>
    ))
  }

  // 处理添加新歌曲
  const handleAddSong = (newSong: Song) => {
    setSongs(prev => [...prev, newSong])
  }

  // 处理设置更新
  const handleSettingsChange = (newSettings: AudioSettings) => {
    setAudioSettings(newSettings)
    audioEngine?.updateSettings(newSettings)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <DemoTag />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-theme">
        {/* 添加设置按钮 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ⚙️ 音频设置
          </button>
        </div>

        {/* 歌曲选择器和上传按钮 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold dark:text-gray-200">选择乐曲</h3>
            <SongUploader onSongAdd={handleAddSong} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {songs.map((song) => (
              <button
                key={song.title}
                onClick={() => handleSongChange(song)}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${currentSong.title === song.title
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600'}
                `}
              >
                {song.title}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 dark:text-white">{currentSong.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          按任意键演奏下一个音符
        </p>
        
        {/* 乐谱显示区域 */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto">
          <div className="flex flex-wrap">
            {renderNotes()}
          </div>
        </div>

        {/* 播放状态 */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>当前进度: {currentNoteIndex + 1} / {currentSong.notes.length}</p>
          <p>状态: {isPlaying ? '播放中' : '等待按键'}</p>
          <p>速度: {currentSong.tempo} BPM</p>
        </div>

        {/* 设置面板 */}
        <AudioSettingsPanel
          settings={audioSettings}
          onSettingsChange={handleSettingsChange}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
      
      {/* 添加 GitHub 链接 */}
      <a
        href="https://github.com/你的用户名/仓库名"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        aria-label="GitHub repository"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  )
} 