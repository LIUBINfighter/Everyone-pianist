"use client"

import React, { useEffect, useState } from 'react'
import { audioEngine } from '@/lib/audio'
import { songs } from '@/lib/songs/demo'
import { Song } from '@/lib/types'

export const Piano: React.FC = () => {
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        {/* 歌曲选择器 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">选择乐曲</h3>
          <div className="flex gap-2">
            {songs.map((song) => (
              <button
                key={song.title}
                onClick={() => handleSongChange(song)}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${currentSong.title === song.title
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-blue-100'}
                `}
              >
                {song.title}
              </button>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">{currentSong.title}</h2>
        <p className="text-gray-600 mb-4">
          按任意键演奏下一个音符
        </p>
        
        {/* 乐谱显示区域 */}
        <div className="mb-6 p-4 bg-white rounded-lg overflow-x-auto">
          <div className="flex flex-wrap">
            {renderNotes()}
          </div>
        </div>

        {/* 播放状态 */}
        <div className="text-sm text-gray-500">
          <p>当前进度: {currentNoteIndex + 1} / {currentSong.notes.length}</p>
          <p>状态: {isPlaying ? '播放中' : '等待按键'}</p>
          <p>速度: {currentSong.tempo} BPM</p>
        </div>
      </div>
    </div>
  )
} 