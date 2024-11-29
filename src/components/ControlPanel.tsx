"use client"

import { useState } from 'react'
import { AudioSettings, Song } from '@/lib/types'
import { AudioSettingsPanel } from './AudioSettings'
import { SongUploader } from './SongUploader'

interface ControlPanelProps {
  onSongAdd: (song: Song) => void
  audioSettings: AudioSettings
  onSettingsChange: (settings: AudioSettings) => void
}

export const ControlPanel = ({ onSongAdd, audioSettings, onSettingsChange }: ControlPanelProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <SongUploader onSongAdd={onSongAdd} />
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-full transition-all"
      >
        ⚙️ 音频设置
      </button>

      <AudioSettingsPanel
        settings={audioSettings}
        onSettingsChange={onSettingsChange}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
} 