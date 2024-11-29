export interface Note {
  pitch: string;    // 音高，例如 'C4', 'D4' 等
  duration: string; // 音符时值，例如 '4n'(四分音符), '8n'(八分音符)
}

export interface Song {
  title: string;
  tempo: number;
  notes: Note[];
} 