import { useEffect, useId, useRef, useState } from 'react'
import { RotateCcw, RotateCw, Shapes } from 'lucide-react'

const names = ['Sphere', 'Torus', 'Helix']
const columns = 32,
  rows = 10,
  count = columns * rows
const geometry = names.map((_, form) => {
  const points = new Float32Array(count * 3)
  const edges: number[] = []
  for (let i = 0; i < count; i++) {
    const u = ((i % columns) / columns) * Math.PI * 2
    const v = (Math.floor(i / columns) / (rows - 1)) * Math.PI
    let x: number, y: number, z: number
    if (form === 0) {
      x = Math.sin(v) * Math.cos(u)
      y = Math.cos(v)
      z = Math.sin(v) * Math.sin(u)
    } else if (form === 1) {
      const ring = (Math.floor(i / columns) / rows) * Math.PI * 2
      const radius = 0.7 + 0.27 * Math.cos(ring)
      x = radius * Math.cos(u)
      y = 0.27 * Math.sin(ring)
      z = radius * Math.sin(u)
    } else {
      const step = Math.floor(i / 2) / (count / 2 - 1)
      const angle = step * Math.PI * 5 + (i % 2) * Math.PI
      x = 0.63 * Math.cos(angle)
      y = (step - 0.5) * 1.8
      z = 0.63 * Math.sin(angle)
    }
    points.set([x, y, z], i * 3)
    if (form === 2) {
      if (i < count - 2) edges.push(i, i + 2)
      if (i % 2 === 0 && i % 8 === 0) edges.push(i, i + 1)
    } else {
      edges.push(i, Math.floor(i / columns) * columns + ((i + 1) % columns))
      if (i + columns < count) edges.push(i, i + columns)
      else if (form === 1) edges.push(i, i % columns)
    }
  }
  return { points, edges }
})

export function OrbitalVisual() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const pose = useRef({ x: -0.28, y: 0.45 })
  const paint = useRef<(() => void) | null>(null)
  const [form, setForm] = useState(0)
  const instruction = useId()
  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const model = geometry[form]
    const projected = new Float32Array(count * 3)
    let width = 0,
      height = 0,
      visible = true,
      frame = 0
    let lastTick = 0,
      lastPaint = 0,
      accent = '#baa0ff'
    let drag: { x: number; y: number; id: number } | null = null
    const running = () =>
      visible &&
      !document.hidden &&
      !preference.matches &&
      document.documentElement.dataset.motion !== 'paused'
    const colors = () => {
      accent =
        getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#baa0ff'
    }
    const render = () => {
      if (!width || !height) return
      context.clearRect(0, 0, width, height)
      const radius = Math.min(width * 0.47, height * 0.43)
      const cx = width / 2,
        cy = height / 2
      const cosY = Math.cos(pose.current.y),
        sinY = Math.sin(pose.current.y)
      const cosX = Math.cos(pose.current.x),
        sinX = Math.sin(pose.current.x)
      for (let i = 0; i < count; i++) {
        const x = model.points[i * 3],
          y = model.points[i * 3 + 1],
          z = model.points[i * 3 + 2]
        const rx = x * cosY + z * sinY,
          rz = z * cosY - x * sinY
        const ry = y * cosX - rz * sinX,
          depth = y * sinX + rz * cosX
        const perspective = 3.5 / (3.5 - depth)
        projected.set(
          [cx + rx * radius * perspective, cy + ry * radius * perspective, depth],
          i * 3,
        )
      }
      context.strokeStyle = accent
      context.lineWidth = 0.7
      for (const front of [false, true]) {
        context.globalAlpha = front ? 0.42 : 0.13
        context.beginPath()
        for (let i = 0; i < model.edges.length; i += 2) {
          const a = model.edges[i] * 3,
            b = model.edges[i + 1] * 3
          if (projected[a + 2] + projected[b + 2] >= 0 !== front) continue
          context.moveTo(projected[a], projected[a + 1])
          context.lineTo(projected[b], projected[b + 1])
        }
        context.stroke()
      }
      context.fillStyle = accent
      for (let i = 0; i < count; i += 13) {
        const depth = projected[i * 3 + 2]
        context.globalAlpha = 0.35 + (depth + 1) * 0.2
        context.beginPath()
        context.arc(
          projected[i * 3],
          projected[i * 3 + 1],
          1.25 + (depth + 1) * 0.65,
          0,
          Math.PI * 2,
        )
        context.fill()
      }
      context.globalAlpha = 1
    }
    const tick = (time: number) => {
      frame = 0
      if (!running()) return
      if (lastTick) pose.current.y += Math.min(0.05, (time - lastTick) / 1000) * 0.16
      lastTick = time
      if (time - lastPaint >= 1000 / 30) {
        render()
        lastPaint = time
      }
      frame = requestAnimationFrame(tick)
    }
    const refresh = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lastTick = 0
      render()
      if (running()) frame = requestAnimationFrame(tick)
    }
    const resize = () => {
      const rect = element.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(devicePixelRatio || 1, 2)
      element.width = Math.round(width * ratio)
      element.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      refresh()
    }
    const theme = () => {
      colors()
      render()
    }
    const start = (event: PointerEvent) => {
      if (event.button !== 0) return
      drag = { x: event.clientX, y: event.clientY, id: event.pointerId }
      element.setPointerCapture(event.pointerId)
      element.dataset.dragging = 'true'
    }
    const move = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return
      pose.current.y += (event.clientX - drag.x) * 0.008
      pose.current.x = Math.max(
        -1.2,
        Math.min(1.2, pose.current.x + (event.clientY - drag.y) * 0.006),
      )
      drag.x = event.clientX
      drag.y = event.clientY
      render()
    }
    const end = () => {
      drag = null
      delete element.dataset.dragging
    }
    const keyboard = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
      event.preventDefault()
      if (event.key === 'ArrowLeft') pose.current.y -= 0.22
      if (event.key === 'ArrowRight') pose.current.y += 0.22
      if (event.key === 'ArrowUp') pose.current.x -= 0.15
      if (event.key === 'ArrowDown') pose.current.x += 0.15
      render()
    }
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              refresh()
            },
            { threshold: 0.01 },
          )
    const size = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    observer?.observe(element)
    size?.observe(element)
    window.addEventListener('resize', resize)
    element.addEventListener('pointerdown', start)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerup', end)
    element.addEventListener('pointercancel', end)
    element.addEventListener('lostpointercapture', end)
    element.addEventListener('keydown', keyboard)
    window.addEventListener('portfolio-motion', refresh)
    window.addEventListener('portfolio-theme', theme)
    document.addEventListener('visibilitychange', refresh)
    preference.addEventListener('change', refresh)
    paint.current = render
    colors()
    resize()
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      size?.disconnect()
      window.removeEventListener('resize', resize)
      paint.current = null
      element.removeEventListener('pointerdown', start)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerup', end)
      element.removeEventListener('pointercancel', end)
      element.removeEventListener('lostpointercapture', end)
      element.removeEventListener('keydown', keyboard)
      window.removeEventListener('portfolio-motion', refresh)
      window.removeEventListener('portfolio-theme', theme)
      document.removeEventListener('visibilitychange', refresh)
      preference.removeEventListener('change', refresh)
    }
  }, [form])
  const rotate = (direction: number) => {
    pose.current.y += direction * 0.25
    paint.current?.()
  }
  return (
    <div className="orbital-stage">
      <div className="orbital-scene">
        <canvas
          ref={canvas}
          className="orbital-canvas"
          tabIndex={0}
          role="img"
          aria-label={`Interactive 3D ${names[form].toLowerCase()} visual`}
          aria-describedby={instruction}
        />
        <p className="sr-only" id={instruction}>
          Drag the visual or use arrow keys to rotate it. The header motion control pauses automatic
          rotation.
        </p>
      </div>
      <span className="orbital-hint" aria-hidden="true">
        Drag to explore
      </span>
      <div className="orbital-controls" role="group" aria-label="3D visual controls">
        <button
          type="button"
          className="orbital-form"
          aria-label={`Change 3D form, currently ${names[form]}`}
          onClick={() => setForm((form + 1) % names.length)}
        >
          <Shapes size={16} aria-hidden="true" />
          <span aria-live="polite">{names[form]}</span>
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Rotate visual left"
          onClick={() => rotate(-1)}
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Rotate visual right"
          onClick={() => rotate(1)}
        >
          <RotateCw size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
