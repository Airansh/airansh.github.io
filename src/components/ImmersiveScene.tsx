import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

// Decorative geometry only: the document and its controls never depend on WebGL.
export default function ImmersiveScene({ companion = false }: { companion?: boolean }) {
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
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(companion ? 32 : 42, 1, 0.1, 60)
    camera.position.z = companion ? 8 : 10
    scene.add(new THREE.HemisphereLight(0xe8e0ff, 0x332455, 3))
    const key = new THREE.DirectionalLight(0xffffff, 4)
    key.position.set(-3, 5, 7)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x6ce8ff, 5)
    rim.position.set(4, 0, -3)
    scene.add(rim)
    const violet = new THREE.MeshStandardMaterial({
      color: 0x9b78ee,
      metalness: 0.64,
      roughness: 0.3,
    })
    const silver = new THREE.MeshStandardMaterial({
      color: 0xd8d9f5,
      metalness: 0.52,
      roughness: 0.24,
    })
    const dark = new THREE.MeshStandardMaterial({
      color: 0x101629,
      metalness: 0.4,
      roughness: 0.25,
    })
    const glow = new THREE.MeshStandardMaterial({
      color: 0x8beaff,
      emissive: 0x3db8df,
      emissiveIntensity: 1.5,
      roughness: 0.25,
    })
    const mesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      parent: THREE.Object3D,
      position = [0, 0, 0],
    ) => {
      const object = new THREE.Mesh(geometry, material)
      object.position.set(position[0], position[1], position[2])
      parent.add(object)
      return object
    }
    const box = (w: number, h: number, d: number, radius = 0.14) =>
      new RoundedBoxGeometry(w, h, d, 3, radius)
    const sculpture = new THREE.Group()
    const crystal = new THREE.Group()
    const satellite = new THREE.Group()
    const head = new THREE.Group()
    const arm = new THREE.Group()
    let stars: THREE.Points | undefined
    if (companion) {
      const robot = sculpture
      mesh(box(1.05, 0.86, 0.64), silver, robot, [0, -0.4, 0])
      mesh(box(0.44, 0.28, 0.08, 0.05), dark, robot, [0, -0.35, 0.34])
      mesh(new THREE.SphereGeometry(0.075, 12, 10), glow, robot, [0, -0.35, 0.41])
      robot.add(head)
      head.position.y = 0.56
      mesh(box(1.38, 1, 0.83, 0.22), silver, head)
      mesh(box(1.15, 0.65, 0.12, 0.18), dark, head, [0, -0.015, 0.43])
      for (const x of [-0.29, 0.29]) {
        mesh(box(0.13, 0.23, 0.06, 0.055), glow, head, [x, 0.015, 0.51])
        mesh(new THREE.SphereGeometry(0.18, 16, 12), violet, head, [x < 0 ? -0.75 : 0.75, 0, 0])
      }
      mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 10), violet, head, [0, 0.61, 0])
      mesh(new THREE.SphereGeometry(0.09, 12, 10), glow, head, [0, 0.79, 0])
      for (const x of [-0.32, 0.32]) {
        mesh(new THREE.SphereGeometry(0.12, 12, 10), violet, robot, [x, -0.96, 0])
        mesh(box(0.32, 0.3, 0.47, 0.1), silver, robot, [x, -1.13, 0.06])
      }
      mesh(new THREE.SphereGeometry(0.16, 12, 10), violet, robot, [-0.64, -0.15, 0])
      const left = mesh(box(0.23, 0.65, 0.26, 0.1), silver, robot, [-0.78, -0.4, 0])
      left.rotation.z = -0.3
      robot.add(arm)
      arm.position.set(0.61, -0.12, 0)
      mesh(new THREE.SphereGeometry(0.17, 12, 10), violet, arm)
      const upper = mesh(box(0.25, 0.62, 0.26, 0.1), silver, arm, [0.24, -0.14, 0])
      upper.rotation.z = 0.9
      mesh(new THREE.SphereGeometry(0.14, 12, 10), violet, arm, [0.43, -0.35, 0])
      mesh(box(0.24, 0.48, 0.25, 0.1), silver, arm, [0.49, -0.61, 0])
      mesh(box(0.12, 0.38, 0.13, 0.05), glow, arm, [0.49, -0.99, 0.02])
      robot.rotation.set(-0.05, -0.24, -0.08)
      robot.position.set(-0.12, 0.05, 0)
      scene.add(robot)
    } else {
      const core = mesh(new THREE.IcosahedronGeometry(0.54, 0), violet, sculpture)
      core.rotation.z = 0.3
      for (let i = 0; i < 3; i++) {
        const ring = mesh(
          new THREE.TorusGeometry(1.13 + i * 0.16, 0.028, 8, 80),
          i === 1 ? glow : silver,
          sculpture,
        )
        ring.rotation.set(i * 0.9 + 0.4, i * 0.65, i * 0.4)
      }
      for (let i = 0; i < 3; i++) {
        const shard = mesh(
          new THREE.OctahedronGeometry(0.58 - i * 0.1),
          i === 1 ? silver : violet,
          crystal,
          [(i - 1) * 0.48, i === 1 ? 0.38 : -0.12, 0],
        )
        shard.scale.y = 1.85
        shard.rotation.set(0.15, i * 0.6, (i - 1) * -0.3)
      }
      mesh(new THREE.TorusKnotGeometry(0.48, 0.115, 80, 10, 2, 3), silver, satellite)
      const particleGeometry = new THREE.BufferGeometry()
      const points = new Float32Array(70 * 3)
      for (let i = 0; i < 70; i++) {
        // Deterministic positions avoid jumps during resizing and theme changes.
        points.set([Math.sin(i * 127.1) * 10, Math.cos(i * 311.7) * 5, -2 - (i % 5)], i * 3)
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
      stars = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: 0xaba1e8,
          size: 0.022,
          transparent: true,
          opacity: 0.55,
        }),
      )
      scene.add(sculpture, crystal, satellite, stars)
    }
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0,
      last = 0,
      elapsed = 0,
      visible = true
    let targetX = 0,
      targetY = 0,
      pointerX = 0,
      pointerY = 0,
      scroll = 0
    let modalOpen = !!document.querySelector('dialog[open]')
    const running = () =>
      visible &&
      !document.hidden &&
      !modalOpen &&
      !preference.matches &&
      document.documentElement.dataset.motion !== 'paused'
    const render = () => renderer.render(scene, camera)
    const pose = () => {
      pointerX += (targetX - pointerX) * 0.06
      pointerY += (targetY - pointerY) * 0.06
      if (companion) {
        sculpture.position.y = 0.05 + Math.sin(elapsed * 1.4) * 0.075
        head.rotation.set(pointerY * 0.12, pointerX * 0.25, Math.sin(elapsed * 0.7) * 0.035)
        arm.rotation.z = Math.sin(elapsed * 1.2) * 0.08
      } else {
        sculpture.rotation.set(
          elapsed * 0.075 + pointerY * 0.1,
          elapsed * 0.12 + pointerX * 0.2,
          0.2,
        )
        crystal.rotation.y = -elapsed * 0.1 + pointerX * 0.15
        satellite.rotation.set(elapsed * 0.12, elapsed * 0.17, 0)
        camera.position.x = pointerX * 0.12
        camera.position.y = -pointerY * 0.1 - scroll * 0.14
        if (stars) stars.rotation.z = elapsed * 0.005
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
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      if (!companion) {
        const span = Math.tan(THREE.MathUtils.degToRad(21)) * 10 * camera.aspect
        sculpture.position.set(span * 0.94, 1.6, 0)
        crystal.position.set(-span * 0.96, -1.4, -0.4)
        satellite.position.set(-span * 1.02, 2.8, -1)
      }
      refresh()
    }
    const pointer = (event: PointerEvent) => {
      if (!running() || !fine.matches || event.pointerType !== 'mouse') return
      targetX = (event.clientX / innerWidth) * 2 - 1
      targetY = (event.clientY / innerHeight) * 2 - 1
    }
    const onScroll = () => {
      if (running()) scroll = Math.min(scrollY / innerHeight, 8)
    }
    const theme = () => {
      const light = document.documentElement.dataset.theme === 'light'
      violet.color.set(light ? 0x7545cc : 0x9b78ee)
      silver.color.set(light ? 0xaab0ce : 0xd8d9f5)
      refresh()
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
      visible = false
      delete element.dataset.renderer
      refresh()
    }
    renderer.domElement.addEventListener('webglcontextlost', lost)
    window.addEventListener('pointermove', pointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('portfolio-motion', refresh)
    window.addEventListener('portfolio-theme', theme)
    preference.addEventListener('change', refresh)
    document.addEventListener('visibilitychange', refresh)
    theme()
    resize()
    return () => {
      cancelAnimationFrame(frame)
      size.disconnect()
      observer.disconnect()
      modals.disconnect()
      window.removeEventListener('pointermove', pointer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('portfolio-motion', refresh)
      window.removeEventListener('portfolio-theme', theme)
      preference.removeEventListener('change', refresh)
      document.removeEventListener('visibilitychange', refresh)
      renderer.domElement.removeEventListener('webglcontextlost', lost)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material: THREE.Material) => material.dispose())
        }
      })
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      delete element.dataset.renderer
    }
  }, [companion])
  return (
    <div
      ref={host}
      className={companion ? 'robot-companion' : 'immersive-scene'}
      aria-hidden="true"
    >
      {companion ? (
        <span className="robot-fallback">
          <i />
          <b />
          <em />
        </span>
      ) : (
        <span className="scene-fallback">
          <i />
          <b />
          <em />
        </span>
      )}
    </div>
  )
}
