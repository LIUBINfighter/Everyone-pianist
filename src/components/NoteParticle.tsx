interface NoteParticleProps {
  note: string;
  x: number;
  y: number;
  color: string;
}

export const NoteParticle: React.FC<NoteParticleProps> = ({ note, x, y, color }) => {
  return (
    <div 
      className="absolute pointer-events-none animate-fade-out"
      style={{ 
        left: x,
        top: y,
        color: color,
      }}
    >
      <div className="animate-float text-2xl">
        {note}
      </div>
    </div>
  );
}; 