import * as Tone from 'tone';

class AudioEngine {
  private synth: Tone.Synth;

  constructor() {
    this.synth = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
  }

  // 播放音符，支持时值设置
  playNote(note: string, duration: string = '8n') {
    this.synth.triggerAttackRelease(note, duration);
  }
}

// 导出单例实例
export const audioEngine = new AudioEngine(); 