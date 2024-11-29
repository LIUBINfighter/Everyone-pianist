import { useEffect, useRef } from 'react';

interface VisualizerProps {
  notes: string[];
}

const Visualizer: React.FC<VisualizerProps> = ({ notes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制音符可视化效果
    notes.forEach((note, index) => {
      ctx.fillStyle = `hsl(${index * 30}, 70%, 50%)`;
      ctx.fillRect(index * 50, 100, 40, 40);
    });
  }, [notes]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="border border-gray-300"
    />
  );
};

export default Visualizer; 