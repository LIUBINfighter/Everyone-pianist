import * as Tone from 'tone';
import { AudioSettings, defaultAudioSettings } from './types';

// 添加和弦类型的类型定义
type ChordQuality = 'major' | 'minor' | 'dominant7';

class AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private isInitialized: boolean = false;
  private settings: AudioSettings;

  constructor(initialSettings: AudioSettings = defaultAudioSettings) {
    this.settings = initialSettings;
  }

  private createSynth() {
    if (typeof window === 'undefined') return null;
    
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: this.settings.oscillatorType
      },
      envelope: {
        attack: this.settings.attack,
        decay: this.settings.decay,
        sustain: this.settings.sustain,
        release: this.settings.release
      }
    }).toDestination();
  }

  // 更新设置
  updateSettings(newSettings: AudioSettings) {
    this.settings = newSettings;
    
    // 更新合成器参数
    if (this.synth) {
      this.synth.set({
        oscillator: {
          type: newSettings.oscillatorType
        },
        envelope: {
          attack: newSettings.attack,
          decay: newSettings.decay,
          sustain: newSettings.sustain,
          release: newSettings.release
        }
      });

      this.synth.volume.value = newSettings.volume;
    }
  }

  // 初始化音频引擎
  private async initialize() {
    if (!this.isInitialized) {
      if (typeof window === 'undefined') return;
      
      if (!this.synth) {
        this.synth = this.createSynth();
      }
      
      await Tone.start();
      await Tone.context.resume();
      this.isInitialized = true;
    }
  }

  // 播放音符，支持时值设置
  async playNote(note: string, duration: string = '8n') {
    try {
      if (!note || !duration) {
        console.warn('Invalid note or duration:', { note, duration })
        return
      }

      await this.initialize();
      if (!this.synth) return;

      this.synth.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error('Error playing note:', { error, note, duration });
    }
  }

  // 停止所有声音
  stopAll() {
    try {
      if (this.synth) {
        this.synth.releaseAll();
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  // 添加和弦播放方法
  async playChord(notes: string[], duration: string = '8n') {
    try {
      await this.initialize();
      
      // 同时触发多个音符
      if (this.synth) {
        this.synth.triggerAttackRelease(notes, duration);
      }
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  }

  // 修改和弦工具方法的类型声明
  getChordNotes(root: string, quality: ChordQuality): string[] {
    // 定义和弦音程映射
    const chordMap: Record<ChordQuality, number[]> = {
      'major': [0, 4, 7],         // 大三和弦
      'minor': [0, 3, 7],         // 小三和弦
      'dominant7': [0, 4, 7, 10], // 属七和弦
    };

    const intervals = chordMap[quality] || chordMap['major'];
    return intervals.map(interval => this.transposeNote(root, interval));
  }

  // 添加音符移调方法的实现
  private transposeNote(root: string, semitones: number): string {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // 解析根音符
    const noteName = root.slice(0, -1);  // 移除八度数字
    const octave = parseInt(root.slice(-1));
    
    // 获取根音符在音阶中的位置
    const rootIndex = notes.indexOf(noteName);
    if (rootIndex === -1) return root; // 如果找不到根音符，返回原始音符
    
    // 计算新音符的位置
    let newIndex = rootIndex + semitones;
    let newOctave = octave;
    
    // 处理跨越八度的情况
    while (newIndex >= 12) {
      newIndex -= 12;
      newOctave++;
    }
    while (newIndex < 0) {
      newIndex += 12;
      newOctave--;
    }
    
    return `${notes[newIndex]}${newOctave}`;
  }
}

// 创建单例实例
let audioEngineInstance: AudioEngine | null = null;

// 导出获取实例的函数
export function getAudioEngine(): AudioEngine {
  if (typeof window === 'undefined') {
    throw new Error('AudioEngine can only be used in browser environment');
  }
  
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  
  return audioEngineInstance;
}

// 导出便捷访问实例
export const audioEngine = typeof window !== 'undefined' ? getAudioEngine() : null; 