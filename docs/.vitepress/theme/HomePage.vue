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
      <div class="hero-panel" aria-label="站点概览">
        <div class="hero-metrics">
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
        <div class="hero-status">
          <span>Now writing</span>
          <strong>工具、系统、电影和游戏</strong>
        </div>
      </div>
    </section>

    <section class="home-section lead-section">
      <div class="section-heading">
        <p>Latest</p>
        <h2>最近写了什么</h2>
      </div>
      <div class="article-layout">
        <a class="article-card featured" href="/posts/oh-openharmony-build-tool">
          <span class="card-label">工具 / OpenHarmony</span>
          <h3>oh：一个面向 OpenHarmony 的编译命令管理工具</h3>
          <p>梳理 oh 的安装、编译封装、多源码目录管理、同步流程、历史记录和资源查看能力。</p>
          <span class="card-link">阅读文章</span>
        </a>
        <div class="article-list-panel">
          <a class="article-row" href="/posts/hello-world">
            <span>随笔</span>
            <strong>Hello world</strong>
          </a>
          <a class="article-row" href="/archives/">
            <span>归档</span>
            <strong>按时间浏览所有内容</strong>
          </a>
          <a class="article-row" href="/posts/">
            <span>文章</span>
            <strong>进入完整列表</strong>
          </a>
        </div>
      </div>
    </section>

    <section class="home-section topic-section">
      <div class="section-heading narrow-heading">
        <p>Channels</p>
        <h2>这里会写哪些东西</h2>
      </div>
      <div class="topic-grid">
        <a class="topic-tile blue" href="/posts/oh-openharmony-build-tool">
          <span>01</span>
          <strong>代码和工具</strong>
          <p>命令行、工程化、构建系统，以及实际开发中能省时间的小工具。</p>
        </a>
        <a class="topic-tile green" href="/posts/">
          <span>02</span>
          <strong>系统和问题</strong>
          <p>遇到的问题、定位过程、解决方案和后续复盘。</p>
        </a>
        <a class="topic-tile amber" href="/archives/">
          <span>03</span>
          <strong>游戏和电影</strong>
          <p>不只写技术，也留一些输入后的整理和观察。</p>
        </a>
      </div>
    </section>

    <section class="home-section rhythm-section">
      <div class="section-heading">
        <p>Pulse</p>
        <h2>近期状态</h2>
      </div>
      <div class="rhythm-grid">
        <div class="rhythm-item">
          <span class="rhythm-date">2026.06</span>
          <strong>博客重建</strong>
          <p>从旧的静态产物迁移到 VitePress，接入 GitHub Actions 自动部署。</p>
        </div>
        <div class="rhythm-item">
          <span class="rhythm-date">2026.06</span>
          <strong>第一篇工具文档</strong>
          <p>整理 `oh` 项目的使用方式和实现思路，作为新博客的第一篇正式文章。</p>
        </div>
        <div class="rhythm-item muted">
          <span class="rhythm-date">Next</span>
          <strong>继续补内容</strong>
          <p>后续会把日常开发、影音记录和游戏体验慢慢补进来。</p>
        </div>
      </div>
    </section>

    <section class="home-section route-section">
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
let time = 0

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
  const count = Math.max(90, Math.min(180, Math.floor(width / 9)))
  particles = Array.from({ length: count }, (_, index) => {
    const group = index % 4
    const anchors = [
      { x: width * 0.2, y: height * 0.28 },
      { x: width * 0.72, y: height * 0.22 },
      { x: width * 0.62, y: height * 0.68 },
      { x: width * 0.28, y: height * 0.72 }
    ]
    const anchor = anchors[group]
    const angle = index * 2.399963 + group * 0.8
    const radius = 48 + Math.random() * Math.min(width, height) * 0.24
    return {
      x: anchor.x + Math.cos(angle) * radius,
      y: anchor.y + Math.sin(angle) * radius,
      vx: Math.cos(angle + Math.PI / 2) * (0.25 + Math.random() * 0.45),
      vy: Math.sin(angle + Math.PI / 2) * (0.25 + Math.random() * 0.45),
      size: 1.2 + Math.random() * 2.6,
      mass: 0.7 + Math.random() * 1.5,
      hue: group,
      phase: Math.random() * Math.PI * 2,
      orbit: 36 + Math.random() * 110,
      anchor
    }
  })
}

function step() {
  if (!context) return
  time += 0.012
  context.clearRect(0, 0, width, height)
  drawFieldWash()

  context.save()
  context.globalCompositeOperation = 'lighter'

  for (const p of particles) {
    const anchorX = p.anchor.x + Math.cos(time * 0.9 + p.phase) * p.orbit
    const anchorY = p.anchor.y + Math.sin(time * 0.7 + p.phase) * p.orbit * 0.58
    const dx = anchorX - p.x
    const dy = anchorY - p.y
    const swirl = Math.atan2(dy, dx) + Math.PI / 2
    const wave = Math.sin(time * 2.2 + p.phase + p.x * 0.006 + p.y * 0.004)

    p.vx += dx * 0.00042 * p.mass
    p.vy += dy * 0.00042 * p.mass
    p.vx += Math.cos(swirl) * 0.018 + Math.cos(wave + p.phase) * 0.026
    p.vy += Math.sin(swirl) * 0.018 + Math.sin(wave - p.phase) * 0.026

    if (pointer.active) {
      const px = p.x - pointer.x
      const py = p.y - pointer.y
      const distance = Math.max(24, Math.hypot(px, py))
      if (distance < 220) {
        const force = (220 - distance) / 220
        p.vx += (px / distance) * force * 2.2
        p.vy += (py / distance) * force * 2.2
      }
    }

    p.vx *= 0.94
    p.vy *= 0.94
    p.x += p.vx
    p.y += p.vy

    if (p.x < -40) p.x = width + 40
    if (p.x > width + 40) p.x = -40
    if (p.y < -40) p.y = height + 40
    if (p.y > height + 40) p.y = -40
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i]
      const b = particles[j]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (distance < 104) {
        const alpha = 0.2 * (1 - distance / 104)
        context.strokeStyle = a.hue === b.hue
          ? `rgba(37, 99, 235, ${alpha})`
          : `rgba(20, 184, 166, ${alpha * 0.55})`
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(a.x, a.y)
        context.lineTo(b.x, b.y)
        context.stroke()
      }
    }
  }

  for (const p of particles) {
    const colors = [
      ['rgba(37, 99, 235, 0.72)', 'rgba(37, 99, 235, 0)'],
      ['rgba(20, 184, 166, 0.66)', 'rgba(20, 184, 166, 0)'],
      ['rgba(245, 158, 11, 0.52)', 'rgba(245, 158, 11, 0)'],
      ['rgba(14, 165, 233, 0.64)', 'rgba(14, 165, 233, 0)']
    ][p.hue]
    const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6)
    glow.addColorStop(0, colors[0])
    glow.addColorStop(0.45, 'rgba(248, 250, 252, 0.18)')
    glow.addColorStop(1, colors[1])
    context.fillStyle = glow
    context.beginPath()
    context.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2)
    context.fill()

    context.fillStyle = 'rgba(248, 250, 252, 0.92)'
    context.beginPath()
    context.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    context.fill()
  }

  context.restore()
  animationFrame = requestAnimationFrame(step)
}

function drawFieldWash() {
  const gradient = context.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, 'rgba(37, 99, 235, 0.035)')
  gradient.addColorStop(0.45, 'rgba(20, 184, 166, 0.04)')
  gradient.addColorStop(1, 'rgba(245, 158, 11, 0.03)')
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)

  for (let i = 0; i < 5; i += 1) {
    const x = width * (0.16 + i * 0.18) + Math.cos(time + i) * 18
    const y = height * (0.2 + (i % 3) * 0.22) + Math.sin(time * 1.3 + i) * 22
    context.strokeStyle = `rgba(15, 23, 42, ${0.025 + i * 0.004})`
    context.lineWidth = 1
    context.beginPath()
    context.arc(x, y, 70 + i * 26, time + i, time + i + Math.PI * 1.2)
    context.stroke()
  }
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
