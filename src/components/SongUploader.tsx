"use client"

import React, { useState } from 'react'
import { Song } from '@/lib/types'

interface SongUploaderProps {
  onSongAdd: (song: Song) => void
}

export const SongUploader: React.FC<SongUploaderProps> = ({ onSongAdd }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string>('')

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const song: Song = JSON.parse(text)
      
      // 验证歌曲数据
      if (!validateSong(song)) {
        throw new Error('无效的乐谱格式')
      }

      onSongAdd(song)
      setIsOpen(false)
      setError('')
    } catch (err) {
      setError('文件格式错误，请上传有效的 JSON 乐谱文件')
    }
  }

  // 验证歌曲数据结构
  const validateSong = (song: any): song is Song => {
    return (
      typeof song.title === 'string' &&
      typeof song.tempo === 'number' &&
      Array.isArray(song.notes) &&
      song.notes.every((note: any) =>
        typeof note.pitch === 'string' &&
        typeof note.duration === 'string'
      )
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        上传乐谱
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4 dark:text-white">上传乐谱</h3>
            
            {/* 文件上传 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                上传 JSON 文件
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full border dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-gray-200"
              />
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* 示例格式 */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 dark:text-gray-200">JSON 格式示例：</h4>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs dark:text-gray-300">
{`{
  "title": "歌曲名称",
  "tempo": 120,
  "notes": [
    { "pitch": "C4", "duration": "4n" },
    { "pitch": "D4", "duration": "4n" }
  ]
}`}
              </pre>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 