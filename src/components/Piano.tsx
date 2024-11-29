"use client"

import React, { useEffect, useState } from 'react'
import { audioEngine } from '@/lib/audio'
import { twinkleStar } from '@/lib/songs/demo'
import { Note } from '@/lib/types'

export const Piano: React.FC = () => {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // 处理任意按键事件
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 防止连续快速按键
      if (isPlaying) return
      
      // 播放当前音符
      const currentNote = twinkleStar.notes[currentNoteIndex]
      if (currentNote) {
        setIsPlaying(true)
        audioEngine.playNote(currentNote.pitch, currentNote.duration)
        
        // 更新到下一个音符
        setCurrentNoteIndex(prev => 
          prev < twinkleStar.notes.length - 1 ? prev + 1 : 0
        )
        
        // 音符播放完成后重置状态
        setTimeout(() => {
          setIsPlaying(false)
        }, 250) // 添加适当的延迟以防止连续触发
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentNoteIndex, isPlaying])

  // 渲染乐谱显示
  const renderNotes = () => {
    return twinkleStar.notes.map((note, index) => (
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
        <h2 className="text-2xl font-bold mb-4">{twinkleStar.title}</h2>
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
          <p>当前进度: {currentNoteIndex + 1} / {twinkleStar.notes.length}</p>
          <p>状态: {isPlaying ? '播放中' : '等待按键'}</p>
        </div>
      </div>
    </div>
  )
} 