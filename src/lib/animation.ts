export interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  life: number
  isPlayed?: boolean
}

export class ParticleSystem {
  private particles: Particle[] = []
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private readonly LINE_X = this.width * 0.3

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

  addNoteParticle(x: number, y: number, note: string) {
    const hue = Math.random() * 360;
    const color = `hsl(${hue}, 70%, 80%)`;
    
    this.particles.push({
      x,
      y,
      size: 20,
      speedX: (Math.random() - 0.5) * 2,
      speedY: -2 - Math.random() * 2,
      color,
      alpha: 1,
      life: 1,
      note,
      rotation: (Math.random() - 0.5) * 30,
    });
  }

  addBubbleNote(y: number, isPlayed: boolean = false) {
    const x = isPlayed ? this.LINE_X : this.width
    const hue = isPlayed ? 120 : 200
    
    this.particles.push({
      x,
      y,
      size: 15,
      speedX: -2,
      speedY: 0,
      color: `hsla(${hue}, 70%, 70%, 0.8)`,
      alpha: 1,
      life: 1,
      isPlayed
    })
  }

  update() {
    this.particles = this.particles.filter(p => p.life > 0)

    this.particles.forEach(p => {
      p.x += p.speedX
      
      if (!p.isPlayed && p.x <= this.LINE_X) {
        p.isPlayed = true
        p.color = `hsla(120, 70%, 70%, 0.8)`
      }

      p.life -= 0.003
      p.alpha = p.life
    })
  }

  draw() {
    this.ctx.save()
    
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    this.ctx.lineWidth = 2
    this.ctx.moveTo(this.LINE_X, 0)
    this.ctx.lineTo(this.LINE_X, this.height)
    this.ctx.stroke()

    this.particles.forEach(p => {
      this.ctx.globalAlpha = p.alpha
      this.ctx.fillStyle = p.color
      
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.beginPath()
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      this.ctx.arc(p.x - p.size/3, p.y - p.size/3, p.size/4, 0, Math.PI * 2)
      this.ctx.fill()
    })
    
    this.ctx.restore()
  }

  clear() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, 'rgba(0, 0, 20, 0.95)')
    gradient.addColorStop(1, 'rgba(0, 0, 40, 0.95)')
    
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
  }
} 