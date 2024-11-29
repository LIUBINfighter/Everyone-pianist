export interface Note {
  pitch: string;    // 音高，例如 'C4', 'D4' 等
  duration: string; // 音符时值，例如 '4n'(四分音符), '8n'(八分音符)
}

export interface Song {
  title: string;
  tempo: number;
  notes: Note[];
}

export interface AudioSettings {
  volume: number;        // 音量 (-60 到 0)
  attack: number;        // 起音时间
  decay: number;         // 衰减时间
  sustain: number;       // 持续音量
  release: number;       // 释放时间
  oscillatorType: 'sine' | 'square' | 'triangle' | 'sawtooth'; // 振荡器类型
}

export const defaultAudioSettings: AudioSettings = {
  volume: -12,
  attack: 0.005,
  decay: 0.1,
  sustain: 0.3,
  release: 0.8,
  oscillatorType: 'sine'
}; 