import { Song } from '../types'

// 小星星
export const twinkleStar: Song = {
  title: "小星星",
  tempo: 120,
  notes: [
    { pitch: 'C4', duration: '4n' },
    { pitch: 'C4', duration: '4n' },
    { pitch: 'G4', duration: '4n' },
    { pitch: 'G4', duration: '4n' },
    { pitch: 'A4', duration: '4n' },
    { pitch: 'A4', duration: '4n' },
    { pitch: 'G4', duration: '2n' },
    { pitch: 'F4', duration: '4n' },
    { pitch: 'F4', duration: '4n' },
    { pitch: 'E4', duration: '4n' },
    { pitch: 'E4', duration: '4n' },
    { pitch: 'D4', duration: '4n' },
    { pitch: 'D4', duration: '4n' },
    { pitch: 'C4', duration: '2n' },
  ]
}

// 生日快乐
export const happyBirthday: Song = {
  title: "生日快乐",
  tempo: 120,
  notes: [
    { pitch: 'C4', duration: '8n' },
    { pitch: 'C4', duration: '8n' },
    { pitch: 'D4', duration: '4n' },
    { pitch: 'C4', duration: '4n' },
    { pitch: 'F4', duration: '4n' },
    { pitch: 'E4', duration: '2n' },
    { pitch: 'C4', duration: '8n' },
    { pitch: 'C4', duration: '8n' },
    { pitch: 'D4', duration: '4n' },
    { pitch: 'C4', duration: '4n' },
    { pitch: 'G4', duration: '4n' },
    { pitch: 'F4', duration: '2n' },
  ]
}

// 定义钢琴的完整音域（从 A0 到 C8）
export const PIANO_NOTES = [
  'A0', 'A#0', 'B0',
  'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
  'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
  'C8'
] as const;

// 音域测试歌曲
export const pianoRangeTest: Song = {
  title: "音域测试",
  tempo: 300,
  notes: PIANO_NOTES.slice(24).map(note => ({  // 从 C3 开始
    pitch: note,
    duration: '8n'
  }))
};

// 导出所有歌曲
export const songs: Song[] = [
  twinkleStar,
  happyBirthday,
  pianoRangeTest,
]; 