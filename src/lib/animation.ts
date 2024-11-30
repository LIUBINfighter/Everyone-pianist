export class ParticleSystem {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private particles: Particle[] = [];

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  // 添加音符气泡
  addBubbleNote(y: number, isPlayed: boolean = false) {
    const particle = new Particle(
      this.width / 2,  // x坐标居中
      y,               // 传入的y坐标
      isPlayed ? '#4CAF50' : '#2196F3', // 已播放和未播放的颜色
      isPlayed ? 40 : 30  // 已播放的气泡稍大
    );
    this.particles.push(particle);
  }

  // 清除画布
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // 更新所有粒子
  update() {
    this.particles = this.particles.filter(particle => particle.isAlive());
    this.particles.forEach(particle => particle.update());
  }

  // 绘制所有粒子
  draw() {
    this.particles.forEach(particle => particle.draw(this.ctx));
  }
}

class Particle {
  private x: number;
  private y: number;
  private color: string;
  private size: number;
  private alpha: number = 1;
  private velocity = {
    x: (Math.random() - 0.5) * 2,
    y: -Math.random() * 2
  };

  constructor(x: number, y: number, color: string, size: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  isAlive(): boolean {
    return this.alpha > 0;
  }
}