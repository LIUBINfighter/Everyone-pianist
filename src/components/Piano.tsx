"use client"

import React, { useEffect, useState } from 'react'
import { audioEngine } from '@/lib/audio'
import { songs as defaultSongs } from '@/lib/songs/demo'
import { Song } from '@/lib/types'
import { SongUploader } from './SongUploader'
import { DemoTag } from './DemoTag'

export const Piano: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(defaultSongs)
  const [currentSong, setCurrentSong] = useState<Song>(songs[0])
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // 处理歌曲切换
  const handleSongChange = (song: Song) => {
    setCurrentSong(song)
    setCurrentNoteIndex(0)
    setIsPlaying(false)
  }
  
  // 处理任意按键事件
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 防止连续快速按键
      if (isPlaying) return
      
      // 播放当前音符
      const currentNote = currentSong.notes[currentNoteIndex]
      if (currentNote) {
        setIsPlaying(true)
        audioEngine.playNote(currentNote.pitch, currentNote.duration)
        
        // 更新到下一个音符
        setCurrentNoteIndex(prev => 
          prev < currentSong.notes.length - 1 ? prev + 1 : 0
        )
        
        // 音符播放完成后重置状态
        setTimeout(() => {
          setIsPlaying(false)
        }, 250)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentNoteIndex, isPlaying, currentSong])

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

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <DemoTag />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-theme">
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
      </div>
    </div>
  )
} 