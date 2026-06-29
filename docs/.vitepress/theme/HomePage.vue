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
