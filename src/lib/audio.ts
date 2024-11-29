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
}

// 导出单例实例
export const audioEngine = new AudioEngine(); 