import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

// A decorative companion inside the existing chat button, with no extra tab stop.
export default function RobotCompanion() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
    } catch {
      return
    }
    element.appendChild(renderer.domElement)
    element.dataset.renderer = 'webgl'
    renderer.setClearColor(0, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30)
    camera.position.set(0, 0, 6.7)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8884a4, 2.6))
    const key = new THREE.DirectionalLight(0xffffff, 3)
    key.position.set(-3, 5, 6)
    const rim = new THREE.DirectionalLight(0xc6b6ff, 1.8)
    rim.position.set(4, 1, -2)
    scene.add(key, rim)
    const shell = new THREE.MeshPhysicalMaterial({
      color: 0xf4f4f6,
      metalness: 0.08,
      roughness: 0.28,
      clearcoat: 0.7,
      clearcoatRoughness: 0.22,
    })
    const bezel = new THREE.MeshPhysicalMaterial({
      color: 0x11151c,
      metalness: 0.12,
      roughness: 0.23,
      clearcoat: 1,
    })
    const joint = new THREE.MeshStandardMaterial({
      color: 0x9397a4,
      metalness: 0.55,
      roughness: 0.35,
    })
    const accent = new THREE.MeshStandardMaterial({
      color: 0xb3a3de,
      metalness: 0.3,
      roughness: 0.35,
    })
    const robot = new THREE.Group()
    const head = new THREE.Group()
    const left = new THREE.Group()
    const right = new THREE.Group()
    const box = (w: number, h: number, d: number, radius: number) =>
      new RoundedBoxGeometry(w, h, d, 5, radius)
    // Extruded silhouettes keep the face corners soft independently of shell depth.
    const cushion = (w: number, h: number, depth: number, radius: number, bevel: number) => {
      const shape = new THREE.Shape()
      const x = -w / 2,
        y = -h / 2
      shape.moveTo(x + radius, y)
      shape.lineTo(x + w - radius, y)
      shape.quadraticCurveTo(x + w, y, x + w, y + radius)
      shape.lineTo(x + w, y + h - radius)
      shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
      shape.lineTo(x + radius, y + h)
      shape.quadraticCurveTo(x, y + h, x, y + h - radius)
      shape.lineTo(x, y + radius)
      shape.quadraticCurveTo(x, y, x + radius, y)
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        steps: 1,
        curveSegments: 16,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: bevel,
        bevelThickness: bevel,
      })
      geometry.center()
      return geometry
    }
    const mesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      parent: THREE.Object3D,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const object = new THREE.Mesh(geometry, material)
      object.position.set(x, y, z)
      parent.add(object)
      return object
    }
    mesh(cushion(2.02, 1.83, 0.72, 0.6, 0.09), shell, head)
    mesh(cushion(1.76, 1.43, 0.11, 0.42, 0.035), bezel, head, 0, 0.04, 0.46)
    for (const sign of [-1, 1]) {
      const ear = mesh(
        new THREE.SphereGeometry(0.23, 20, 16),
        shell,
        head,
        sign * 0.71,
        0.88,
        -0.05,
      )
      ear.scale.set(0.78, 1.35, 0.8)
      ear.rotation.z = -sign * 0.4
      mesh(box(0.08, 0.3, 0.18, 0.035), accent, head, sign * 1.02, -0.04, 0.06)
    }
    // The LED display is drawn locally; no images, fonts, or external model requests.
    const display = document.createElement('canvas')
    display.width = 384
    display.height = 320
    const context = display.getContext('2d')
    const texture = new THREE.CanvasTexture(display)
    texture.colorSpace = THREE.SRGBColorSpace
    const faceMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    mesh(new THREE.PlaneGeometry(1.64, 1.35), faceMaterial, head, 0, 0.04, 0.586)
    const drawFace = (time: number, attentive: boolean) => {
      if (!context) return
      const ctx = context
      ctx.clearRect(0, 0, 384, 320)
      ctx.fillStyle = '#11151b'
      ctx.beginPath()
      ctx.roundRect(0, 0, 384, 320, 90)
      ctx.fill()
      const cycle = time % 12
      const wink = cycle > 7.1 && cycle < 8.1
      const delighted = attentive || (cycle > 3.5 && cycle < 6.4)
      const blinkPhase = time % 4.6
      const blink = Math.max(0.08, 1 - Math.max(0, 1 - Math.abs(blinkPhase - 3.1) / 0.13))
      ctx.strokeStyle = '#f4ffff'
      ctx.fillStyle = '#f4ffff'
      ctx.lineCap = 'round'
      ctx.lineWidth = 12
      ctx.shadowColor = '#c7edff'
      ctx.shadowBlur = 15
      for (const [index, x] of [117, 267].entries()) {
        if (delighted || (wink && index === 1)) {
          ctx.beginPath()
          ctx.moveTo(x - 25, 144)
          ctx.quadraticCurveTo(x, 109, x + 25, 144)
          ctx.stroke()
        } else {
          const h = 61 * blink
          ctx.beginPath()
          ctx.roundRect(x - 24, 135 - h / 2, 48, h, Math.min(14, h / 2))
          ctx.fill()
        }
      }
      ctx.beginPath()
      ctx.moveTo(157, 220)
      ctx.quadraticCurveTo(192, delighted ? 261 : 246, 227, 220)
      ctx.quadraticCurveTo(192, 229, 157, 220)
      ctx.fill()
      ctx.shadowBlur = 0
      if (delighted || wink) {
        ctx.fillStyle = '#d4b5f7'
        ctx.globalAlpha = 0.55
        for (const x of [72, 312]) {
          ctx.beginPath()
          ctx.ellipse(x, 192, 18, 8, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
      // A subtle LED matrix gives the expression the reference's illuminated texture.
      ctx.fillStyle = '#11151b'
      ctx.globalAlpha = 0.24
      for (let y = 0; y < 320; y += 4) ctx.fillRect(0, y, 384, 1)
      ctx.globalAlpha = 1
      texture.needsUpdate = true
    }
    // Floating mitts have visible knuckles and segmented index fingers.
    for (const [hand, sign] of [
      [left, -1],
      [right, 1],
    ] as const) {
      mesh(box(0.39, 0.44, 0.27, 0.14), shell, hand)
      mesh(box(0.19, 0.15, 0.025, 0.04), accent, hand, 0, 0.025, 0.14)
      const thumb = mesh(box(0.14, 0.28, 0.18, 0.065), shell, hand, -sign * 0.23, -0.01, 0.07)
      thumb.rotation.z = sign * 0.5
      for (let i = 0; i < 3; i++) {
        const x = -0.12 + i * 0.115
        if (sign < 0) {
          mesh(box(0.095, 0.23 + i * 0.025, 0.14, 0.045), shell, hand, x, 0.26, 0)
          mesh(box(0.085, 0.1, 0.12, 0.04), shell, hand, x, 0.43 + i * 0.025, 0)
          mesh(new THREE.SphereGeometry(0.042, 10, 8), joint, hand, x, 0.35 + i * 0.015, 0.035)
        } else {
          mesh(box(0.1, 0.16, 0.2, 0.045), shell, hand, x - 0.04, -0.22, 0.06)
        }
      }
      if (sign > 0) {
        mesh(box(0.12, 0.26, 0.15, 0.055), shell, hand, 0.13, -0.3, 0)
        mesh(new THREE.SphereGeometry(0.057, 12, 10), joint, hand, 0.13, -0.45, 0)
        mesh(box(0.115, 0.26, 0.14, 0.055), shell, hand, 0.13, -0.58, 0)
      }
    }
    left.position.set(-1.43, -0.13, 0.06)
    right.position.set(1.4, -0.35, 0.1)
    left.rotation.z = 0.35
    right.rotation.z = 0.08
    head.rotation.set(-0.025, -0.12, 0)
    robot.add(head, left, right)
    scene.add(robot)
    drawFace(0, false)
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    const launcher = element.closest('button')!
    let frame = 0,
      last = 0,
      elapsed = 0,
      lastFace = -1,
      visible = true,
      contextLost = false
    let targetX = 0,
      targetY = 0,
      pointerX = 0,
      pointerY = 0,
      attentive = false
    let modalOpen = !!document.querySelector('dialog[open]')
    const running = () =>
      visible &&
      !document.hidden &&
      !modalOpen &&
      !contextLost &&
      !preference.matches &&
      document.documentElement.dataset.motion !== 'paused'
    const render = () => {
      if (!contextLost) renderer.render(scene, camera)
    }
    const pose = () => {
      pointerX += (targetX - pointerX) * 0.08
      pointerY += (targetY - pointerY) * 0.08
      const bounce = Math.sin(elapsed * 2.4)
      robot.position.set(Math.sin(elapsed * 0.85) * 0.065, bounce * 0.12, 0)
      robot.rotation.z = Math.sin(elapsed * 1.2) * 0.045
      head.rotation.set(
        -0.025 + pointerY * 0.08,
        -0.12 + pointerX * 0.13,
        Math.sin(elapsed * 0.9) * 0.035,
      )
      const wave = elapsed % 12 < 3 ? Math.sin(elapsed * 7) * 0.2 : 0
      left.rotation.z = 0.35 + wave
      left.position.y = -0.13 + Math.sin(elapsed * 2.4 + 0.6) * 0.07
      const point = (Math.sin(elapsed * (attentive ? 5 : 2.4)) + 1) / 2
      right.position.y = -0.35 - point * (attentive ? 0.21 : 0.1)
      right.rotation.z = 0.08 + Math.sin(elapsed * 1.8) * 0.06
      if (elapsed - lastFace > 1 / 20) {
        drawFace(elapsed, attentive)
        lastFace = elapsed
      }
    }
    const tick = (time: number) => {
      frame = 0
      if (!running()) return
      if (time - last >= 1000 / 30) {
        elapsed += last ? Math.min((time - last) / 1000, 0.05) : 0
        last = time
        pose()
        render()
      }
      frame = requestAnimationFrame(tick)
    }
    const refresh = () => {
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
      render()
      if (running()) frame = requestAnimationFrame(tick)
    }
    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (!width || !height) return
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      refresh()
    }
    const pointer = (event: PointerEvent) => {
      if (!running() || !fine.matches || event.pointerType !== 'mouse') return
      targetX = (event.clientX / innerWidth) * 2 - 1
      targetY = (event.clientY / innerHeight) * 2 - 1
    }
    const attention = () => {
      attentive = launcher.matches(':hover, :focus-visible')
      if (running()) {
        drawFace(elapsed, attentive)
        render()
      }
    }
    const size = new ResizeObserver(resize)
    size.observe(element)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      refresh()
    })
    observer.observe(element)
    const modals = new MutationObserver(() => {
      modalOpen = !!document.querySelector('dialog[open]')
      refresh()
    })
    modals.observe(document.body, { attributes: true, attributeFilter: ['open'], subtree: true })
    const lost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      renderer.domElement.hidden = true
      delete element.dataset.renderer
      refresh()
    }
    const restored = () => {
      contextLost = false
      renderer.domElement.hidden = false
      element.dataset.renderer = 'webgl'
      texture.needsUpdate = true
      refresh()
    }
    renderer.domElement.addEventListener('webglcontextlost', lost)
    renderer.domElement.addEventListener('webglcontextrestored', restored)
    window.addEventListener('pointermove', pointer, { passive: true })
    window.addEventListener('portfolio-motion', refresh)
    document.addEventListener('visibilitychange', refresh)
    preference.addEventListener('change', refresh)
    for (const event of ['pointerenter', 'pointerleave', 'focusin', 'focusout'])
      launcher.addEventListener(event, attention)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      size.disconnect()
      observer.disconnect()
      modals.disconnect()
      window.removeEventListener('pointermove', pointer)
      window.removeEventListener('portfolio-motion', refresh)
      document.removeEventListener('visibilitychange', refresh)
      preference.removeEventListener('change', refresh)
      for (const event of ['pointerenter', 'pointerleave', 'focusin', 'focusout'])
        launcher.removeEventListener(event, attention)
      renderer.domElement.removeEventListener('webglcontextlost', lost)
      renderer.domElement.removeEventListener('webglcontextrestored', restored)
      const geometries = new Set<THREE.BufferGeometry>()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) geometries.add(object.geometry)
      })
      geometries.forEach((geometry) => geometry.dispose())
      ;[shell, bezel, joint, accent, faceMaterial].forEach((material) => material.dispose())
      texture.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      delete element.dataset.renderer
    }
  }, [])
  return (
    <div ref={host} className="robot-companion" aria-hidden="true">
      <span className="robot-fallback">
        <span className="robot-face">
          <i />
          <b />
          <em />
        </span>
        <span className="robot-hand robot-hand-left" />
        <span className="robot-hand robot-hand-right" />
      </span>
    </div>
  )
}
