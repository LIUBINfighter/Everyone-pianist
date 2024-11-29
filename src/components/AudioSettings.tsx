"use client"

import React from 'react'
import { AudioSettings } from '@/lib/types'

interface AudioSettingsProps {
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsPanel: React.FC<AudioSettingsProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof AudioSettings, value: number | string) => {
    onSettingsChange({
      ...settings,
      [key]: typeof value === 'string' ? value : Number(value)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-[90vw]">
        <h3 className="text-xl font-bold mb-4 dark:text-white">音频设置</h3>
        
        {/* 音量设置 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
            音量 ({settings.volume}dB)
          </label>
          <input
            type="range"
            min="-60"
            max="0"
            value={settings.volume}
            onChange={(e) => handleChange('volume', e.target.value)}
            className="w-full"
          />
        </div>

        {/* 包络设置 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              起音时间 ({settings.attack}s)
            </label>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={settings.attack}
              onChange={(e) => handleChange('attack', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              衰减时间 ({settings.decay}s)
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={settings.decay}
              onChange={(e) => handleChange('decay', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              持续音量 ({settings.sustain})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.sustain}
              onChange={(e) => handleChange('sustain', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              释放时间 ({settings.release}s)
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={settings.release}
              onChange={(e) => handleChange('release', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* 振荡器类型 */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
            音色
          </label>
          <select
            value={settings.oscillatorType}
            onChange={(e) => handleChange('oscillatorType', e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="sine">正弦波</option>
            <option value="square">方波</option>
            <option value="triangle">三角波</option>
            <option value="sawtooth">锯齿波</option>
          </select>
        </div>

        {/* 按钮 */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}; 