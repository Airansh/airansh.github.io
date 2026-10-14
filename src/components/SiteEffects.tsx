import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const surfaces =
  '.project-card, .publication-card, .writing-card, .education-grid article, .contact-option, .about-card'
export function SiteEffects() {
  const progress = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    let scrollFrame = 0,
      pointerFrame = 0
    let active: HTMLElement | null = null
    let x = 0,
      y = 0
    const reset = () => {
      if (active) {
        delete active.dataset.pointer
        active.style.removeProperty('--tilt-x')
        active.style.removeProperty('--tilt-y')
        active = null
      }
      cancelAnimationFrame(pointerFrame)
      pointerFrame = 0
    }
    const updateProgress = () => {
      scrollFrame = 0
      const distance = document.documentElement.scrollHeight - innerHeight
      progress.current?.style.setProperty(
        '--progress',
        String(distance > 0 ? Math.min(1, scrollY / distance) : 0),
      )
    }
    const scroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress)
    }
    const paintPointer = () => {
      pointerFrame = 0
      if (!active) return
      const rect = active.getBoundingClientRect()
      const px = Math.max(0, Math.min(1, (x - rect.left) / rect.width))
      const py = Math.max(0, Math.min(1, (y - rect.top) / rect.height))
      active.dataset.pointer = 'active'
      active.style.setProperty('--pointer-x', `${px * 100}%`)
      active.style.setProperty('--pointer-y', `${py * 100}%`)
      active.style.setProperty('--tilt-x', `${(0.5 - py) * 4}deg`)
      active.style.setProperty('--tilt-y', `${(px - 0.5) * 4}deg`)
    }
    const pointer = (event: PointerEvent) => {
      if (
        event.pointerType !== 'mouse' ||
        !fine.matches ||
        preference.matches ||
        document.documentElement.dataset.motion === 'paused'
      )
        return
      const target = (event.target as Element).closest<HTMLElement>(surfaces)
      if (!target) {
        reset()
        return
      }
      if (target !== active) {
        reset()
        active = target
      }
      x = event.clientX
      y = event.clientY
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer)
    }
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scroll)
    resize?.observe(document.body)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    window.addEventListener('portfolio-motion', reset)
    preference.addEventListener('change', reset)
    main.addEventListener('pointermove', pointer, { passive: true })
    main.addEventListener('pointerleave', reset)
    scroll()
    return () => {
      resize?.disconnect()
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', scroll)
      window.removeEventListener('portfolio-motion', reset)
      preference.removeEventListener('change', reset)
      main.removeEventListener('pointermove', pointer)
      main.removeEventListener('pointerleave', reset)
      cancelAnimationFrame(scrollFrame)
      reset()
    }
  }, [pathname])
  return <div ref={progress} className="reading-progress" aria-hidden="true" />
}
