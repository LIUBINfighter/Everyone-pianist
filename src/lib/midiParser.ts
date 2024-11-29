import { Midi } from '@tonejs/midi'
import { Song, Note } from './types'

interface MidiNote {
  name: string
  octave: number
  duration: number
}

// 将 MIDI 时值转换为 Tone.js 时值
function convertDuration(duration: number): string {
  // MIDI 时值通常是以拍为单位
  // 我们需要将其转换为 Tone.js 支持的时值表示
  if (duration >= 4) return '1n'  // 全音符
  if (duration >= 2) return '2n'  // 二分音符
  if (duration >= 1) return '4n'  // 四分音符
  if (duration >= 0.5) return '8n'  // 八分音符
  if (duration >= 0.25) return '16n'  // 十六分音符
  return '32n'  // 更短的音符统一处理为三十二分音符
}

export async function parseMidiFile(file: File): Promise<Song> {
  // 读取文件数据
  const arrayBuffer = await file.arrayBuffer()
  const midi = new Midi(arrayBuffer)

  // 获取第一个轨道的音符
  const track = midi.tracks[0]
  
  if (!track || track.notes.length === 0) {
    throw new Error('MIDI 文件没有包含有效的音符')
  }
  
  // 转换音符格式
  const notes: Note[] = track.notes.map((note: MidiNote) => ({
    pitch: note.name + note.octave, // 例如: 'C4'
    duration: convertDuration(note.duration)  // 转换为 Tone.js 时值格式
  }))

  // 移除文件扩展名
  const title = file.name.replace(/\.(mid|midi)$/i, '')

  return {
    title,
    tempo: midi.header.tempos[0]?.bpm || 120,
    notes: notes.filter(note => note.pitch && note.duration) // 过滤掉无效音符
  }
} 