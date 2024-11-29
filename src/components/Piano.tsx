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
    if (isPlaying) return

    const currentNote = currentSong.notes[currentNoteIndex]
    if (currentNote) {
      setIsPlaying(true)
      
      try {
        // 播放当前音符
        audioEngine.playNote(currentNote.pitch, currentNote.duration)
        
        // 立即更新到下一个音符
        setCurrentNoteIndex(prev => 
          prev < currentSong.notes.length - 1 ? prev + 1 : 0
        )
        
        // 非常短的延迟后允许下一次按键
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
      audioEngine.stopAll()
    }
  }, [playCurrentNote, pressedKeys])

  // 渲染乐谱显示
  const renderNotes = () => {
    return currentSong.notes.map((note, index) => (
      <div
        key={index}
        className={`
          inline-block px-2 py-1 m-1 rounded
          ${index === currentNoteIndex ? 'bg-blue-500 text-white' : 'bg-gray-100'}
          ${index < currentNoteIndex ? 'bg-gray-300' : ''}
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
    audioEngine.updateSettings(newSettings)
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
    </div>
  )
} 