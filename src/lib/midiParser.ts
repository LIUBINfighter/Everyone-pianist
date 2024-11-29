import { Midi } from '@tonejs/midi'
import { Song, Note } from './types'

interface MidiNote {
  name: string
  octave: number
  duration: number
  time: number
  velocity: number
  midi: number
}

// 将 MIDI 音符号转换为音高名称
function getMidiNoteName(midiNote: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const octave = Math.floor(midiNote / 12) - 1
  const noteName = notes[midiNote % 12]
  return `${noteName}${octave}`
}

// 将 MIDI 时值转换为 Tone.js 时值
function convertDuration(duration: number): string {
  // 更精确的时值转换
  if (duration >= 4) return '1n'      // 全音符
  if (duration >= 2) return '2n'      // 二分音符
  if (duration >= 1) return '4n'      // 四分音符
  if (duration >= 0.5) return '8n'    // 八分音符
  if (duration >= 0.25) return '16n'  // 十六分音符
  return '32n'                        // 三十二分音符
}

// 规范化音符格式
function normalizeNote(note: any): Note {
  try {
    // 检查必要的属性
    if (!note || typeof note.midi !== 'number' || typeof note.duration !== 'number') {
      console.warn('Invalid note data:', note)
      throw new Error('Invalid note data')
    }

    // 使用 MIDI 音符号获取音高名称
    const pitch = getMidiNoteName(note.midi)
    const duration = convertDuration(note.duration)

    console.log('Normalized note:', { original: note, normalized: { pitch, duration } })
    return { pitch, duration }
  } catch (error) {
    console.error('Error normalizing note:', { note, error })
    throw error
  }
}

export async function parseMidiFile(file: File): Promise<Song> {
  try {
    // 读取文件数据
    const arrayBuffer = await file.arrayBuffer()
    const midi = new Midi(arrayBuffer)

    console.log('Parsed MIDI file:', midi)

    // 获取第一个有音符的轨道
    const track = midi.tracks.find(t => t.notes && t.notes.length > 0)
    
    if (!track || !track.notes || track.notes.length === 0) {
      throw new Error('MIDI 文件没有包含有效的音符')
    }

    console.log('Selected track:', track)

    // 按时间排序音符
    const sortedNotes = [...track.notes].sort((a, b) => a.time - b.time)
    
    // 转换音符格式
    const notes: Note[] = []
    for (const note of sortedNotes) {
      try {
        const normalizedNote = normalizeNote(note)
        notes.push(normalizedNote)
      } catch (error) {
        console.warn('Skipping invalid note:', note)
      }
    }

    if (notes.length === 0) {
      throw new Error('没有找到有效的音符')
    }

    // 移除文件扩展名
    const title = file.name.replace(/\.(mid|midi)$/i, '')

    const song = {
      title,
      tempo: midi.header.tempos[0]?.bpm || 120,
      notes
    }

    console.log('Created song:', song)
    return song
  } catch (error) {
    console.error('Error parsing MIDI file:', error)
    throw new Error('无法解析 MIDI 文件')
  }
} 