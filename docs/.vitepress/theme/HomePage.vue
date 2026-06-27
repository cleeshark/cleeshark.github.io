<template>
  <main class="home-shell">
    <section class="kinetic-hero" @pointermove="handlePointerMove" @pointerleave="handlePointerLeave">
      <canvas ref="canvasRef" class="kinetic-canvas" aria-hidden="true"></canvas>
      <div class="hero-content">
        <p class="hero-kicker">cleeshark.github.io</p>
        <h1>好想下班...</h1>
        <p class="hero-copy">玩游戏，看电影，写代码，把值得留下的东西写成文章。</p>
        <div class="hero-actions">
          <a class="hero-button primary" href="/posts/">开始阅读</a>
          <a class="hero-button secondary" href="/archives/">查看归档</a>
        </div>
      </div>
      <div class="hero-metrics" aria-label="站点概览">
        <div>
          <strong>02</strong>
          <span>已发布文章</span>
        </div>
        <div>
          <strong>VitePress</strong>
          <span>自动部署</span>
        </div>
        <div>
          <strong>OpenHarmony</strong>
          <span>最新主题</span>
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="section-heading">
        <p>Latest</p>
        <h2>最新文章</h2>
      </div>
      <div class="article-grid">
        <a class="article-card featured" href="/posts/oh-openharmony-build-tool">
          <span class="card-label">工具 / OpenHarmony</span>
          <h3>oh：一个面向 OpenHarmony 的编译命令管理工具</h3>
          <p>梳理 oh 的安装、编译封装、多源码目录管理、同步流程、历史记录和资源查看能力。</p>
          <span class="card-link">阅读文章</span>
        </a>
        <a class="article-card" href="/posts/hello-world">
          <span class="card-label">随笔 / 博客</span>
          <h3>Hello world</h3>
          <p>这个博客的新起点。以后会放一些游戏、电影、代码和日常记录。</p>
          <span class="card-link">阅读文章</span>
        </a>
      </div>
    </section>

    <section class="home-section compact-section">
      <a class="route-card" href="/posts/">
        <span>Posts</span>
        <strong>文章列表</strong>
      </a>
      <a class="route-card" href="/archives/">
        <span>Archive</span>
        <strong>时间归档</strong>
      </a>
      <a class="route-card" href="/about/">
        <span>About</span>
        <strong>关于我</strong>
      </a>
    </section>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)
let animationFrame = 0
let particles = []
let context
let width = 0
let height = 0
let pointer = { x: -1000, y: -1000, active: false }

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  canvas.width = Math.floor(width * ratio)
  canvas.height = Math.floor(height * ratio)
  context = canvas.getContext('2d')
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  createParticles()
}

function createParticles() {
  const count = Math.max(42, Math.min(96, Math.floor(width / 18)))
  particles = Array.from({ length: count }, (_, index) => {
    const angle = index * 2.399963
    const radius = Math.sqrt(index / count) * Math.min(width, height) * 0.48
    return {
      x: width * 0.52 + Math.cos(angle) * radius,
      y: height * 0.52 + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: 1.4 + Math.random() * 2.8,
      mass: 0.7 + Math.random() * 1.4
    }
  })
}

function step() {
  if (!context) return
  context.clearRect(0, 0, width, height)

  const centerX = width * 0.58
  const centerY = height * 0.46

  for (const p of particles) {
    const dx = centerX - p.x
    const dy = centerY - p.y
    p.vx += dx * 0.00018 * p.mass
    p.vy += dy * 0.00018 * p.mass

    if (pointer.active) {
      const px = p.x - pointer.x
      const py = p.y - pointer.y
      const distance = Math.max(24, Math.hypot(px, py))
      if (distance < 180) {
        const force = (180 - distance) / 180
        p.vx += (px / distance) * force * 1.8
        p.vy += (py / distance) * force * 1.8
      }
    }

    p.vx *= 0.965
    p.vy *= 0.965
    p.x += p.vx
    p.y += p.vy

    if (p.x < -20) p.x = width + 20
    if (p.x > width + 20) p.x = -20
    if (p.y < -20) p.y = height + 20
    if (p.y > height + 20) p.y = -20
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i]
      const b = particles[j]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (distance < 118) {
        context.strokeStyle = `rgba(37, 99, 235, ${0.18 * (1 - distance / 118)})`
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(a.x, a.y)
        context.lineTo(b.x, b.y)
        context.stroke()
      }
    }
  }

  for (const p of particles) {
    const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6)
    glow.addColorStop(0, 'rgba(37, 99, 235, 0.72)')
    glow.addColorStop(0.45, 'rgba(20, 184, 166, 0.24)')
    glow.addColorStop(1, 'rgba(37, 99, 235, 0)')
    context.fillStyle = glow
    context.beginPath()
    context.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
    context.fill()

    context.fillStyle = 'rgba(248, 250, 252, 0.92)'
    context.beginPath()
    context.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    context.fill()
  }

  animationFrame = requestAnimationFrame(step)
}

function handlePointerMove(event) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  pointer = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    active: true
  }
}

function handlePointerLeave() {
  pointer.active = false
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  animationFrame = requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationFrame)
})
</script>
