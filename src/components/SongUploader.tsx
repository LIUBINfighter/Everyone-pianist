"use client"

import React, { useState } from 'react'
import { Song } from '@/lib/types'
import { parseMidiFile } from '@/lib/midiParser'

interface SongUploaderProps {
  onSongAdd: (song: Song) => void
}

export const SongUploader: React.FC<SongUploaderProps> = ({ onSongAdd }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError('')

    try {
      if (file.name.endsWith('.mid') || file.name.endsWith('.midi')) {
        // 处理 MIDI 文件
        const song = await parseMidiFile(file)
        onSongAdd(song)
        setIsOpen(false)
      } else if (file.name.endsWith('.json')) {
        // 处理 JSON 文件
        const text = await file.text()
        const song: Song = JSON.parse(text)
        
        if (!validateSong(song)) {
          throw new Error('无效的乐谱格式')
        }

        onSongAdd(song)
        setIsOpen(false)
      } else {
        throw new Error('不支持的文件格式')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件处理出错')
    } finally {
      setIsLoading(false)
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
        解析乐谱
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4 dark:text-white">上传乐谱</h3>
            
            {/* 文件上传 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                上传 MIDI 或 JSON 文件 <br />
                目前文件在前端直接解码<br />
                之后会开放后端下载社区midi
              </label>
              <input
                type="file"
                accept=".mid,.midi,.json"
                onChange={handleFileUpload}
                className="w-full border dark:border-gray-600 rounded p-2 dark:bg-gray-700 dark:text-gray-200"
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
              )}
              {isLoading && (
                <p className="text-blue-500 dark:text-blue-400 text-sm mt-1">
                  正在处理文件...
                </p>
              )}
            </div>

            {/* 支持的格式说明 */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 dark:text-gray-200">支持的格式：</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>MIDI 文件 (.mid, .midi)</li>
                <li>JSON 文件 (.json)</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
                disabled={isLoading}
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