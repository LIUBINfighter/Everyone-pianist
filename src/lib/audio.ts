import * as Tone from 'tone';
import { AudioSettings, defaultAudioSettings } from './types';

class AudioEngine {
  private synth: Tone.PolySynth;
  private isInitialized: boolean = false;
  private settings: AudioSettings;

  constructor(initialSettings: AudioSettings = defaultAudioSettings) {
    this.settings = initialSettings;
    this.synth = this.createSynth();
  }

  private createSynth() {
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

  // 初始化音频引擎
  private async initialize() {
    if (!this.isInitialized) {
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

      // 确保音频引擎已初始化
      await this.initialize();

      // 播放音符并让它自然结束
      this.synth.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error('Error playing note:', { error, note, duration });
    }
  }

  // 停止所有声音
  stopAll() {
    try {
      this.synth.releaseAll();
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  // 添加和弦播放方法
  async playChord(notes: string[], duration: string = '8n') {
    try {
      await this.initialize();
      
      // 同时触发多个音符
      this.synth.triggerAttackRelease(notes, duration);
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  }

  // 添加和弦工具方法
  getChordNotes(root: string, quality: string): string[] {
    // 根据和弦类型返回对应的音符数组
    const chordMap = {
      'major': [0, 4, 7],         // 大三和弦
      'minor': [0, 3, 7],         // 小三和弦
      'dominant7': [0, 4, 7, 10], // 属七和弦
      // 可以添加更多和弦类型...
    };

    const intervals = chordMap[quality] || chordMap['major'];
    return intervals.map(interval => this.transposeNote(root, interval));
  }

  private transposeNote(note: string, semitones: number): string {
    // 实现音符移调的逻辑
    // ...
  }
}

// 导出单例实例
export const audioEngine = new AudioEngine(); 