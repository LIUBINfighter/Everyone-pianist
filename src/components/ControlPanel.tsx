"use client"

import React, { useState } from 'react'
import { AudioSettings } from '@/lib/types'
import { Song } from '@/lib/types'
import { SongUploader } from './SongUploader'
import { AudioSettingsPanel } from './AudioSettings'

interface ControlPanelProps {
  onSongAdd: (song: Song) => void
  audioSettings: AudioSettings
  onSettingsChange: (settings: AudioSettings) => void
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onSongAdd,
  audioSettings,
  onSettingsChange,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {/* 设置按钮 */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg 
                   hover:bg-white/20 transition-colors text-white
                   shadow-lg"
      >
        ⚙️ 音频设置
      </button>

      {/* 歌曲上传器 */}
      <SongUploader onSongAdd={onSongAdd} />

      {/* 设置面板 */}
      <AudioSettingsPanel
        settings={audioSettings}
        onSettingsChange={onSettingsChange}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}