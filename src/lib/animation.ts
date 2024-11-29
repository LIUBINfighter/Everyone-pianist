export interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  life: number
}

export class ParticleSystem {
  private particles: Particle[] = []
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  addParticles(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 8,
        speedY: (Math.random() - 0.5) * 8 - 2,
        color,
        alpha: 1,
        life: 1
      })
    }
  }

  update() {
    this.particles = this.particles.filter(p => p.life > 0)

    this.particles.forEach(p => {
      p.x += p.speedX
      p.y += p.speedY
      p.speedY += 0.1 // 重力
      p.life -= 0.02
      p.alpha = p.life
      p.size *= 0.99
    })
  }

  draw() {
    this.ctx.save()
    this.particles.forEach(p => {
      this.ctx.globalAlpha = p.alpha
      this.ctx.fillStyle = p.color
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      this.ctx.fill()
    })
    this.ctx.restore()
  }

  clear() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }
} 