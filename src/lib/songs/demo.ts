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

// 导出所有歌曲
export const songs: Song[] = [
  twinkleStar,
  happyBirthday,
] 