import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'

// Progressive enhancement: content stays visible when motion or observers are unavailable.
export function RouteMotion() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])
  useEffect(() => {
    if (!document.startViewTransition) return
    let transition: ViewTransition | undefined
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        preference.matches ||
        document.documentElement.dataset.motion === 'paused'
      )
        return
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.hash.startsWith('#/')
      )
        return
      const to = url.hash.slice(1)
      if (to === window.location.hash.slice(1)) return
      event.preventDefault()
      transition?.skipTransition()
      transition = document.startViewTransition(async () => {
        flushSync(() => navigateRef.current(to))
        // Lazy routes must resolve before capturing the destination frame.
        await new Promise<void>((resolve) => {
          let timer = 0
          const ready = () => !!document.querySelector('main h1')?.getClientRects().length
          const observer = new MutationObserver(() => {
            if (!ready()) return
            observer.disconnect()
            clearTimeout(timer)
            resolve()
          })
          if (ready()) return resolve()
          observer.observe(document.getElementById('main-content')!, {
            childList: true,
            subtree: true,
          })
          timer = window.setTimeout(() => {
            observer.disconnect()
            resolve()
          }, 1200)
        })
      })
      void transition.finished.catch(() => {})
    }
    document.addEventListener('click', click, true)
    return () => {
      document.removeEventListener('click', click, true)
      transition?.skipTransition()
    }
  }, [])
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main || !('IntersectionObserver' in window) || !Element.prototype.animate) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let seen = new WeakSet<Element>()
    const animations = new Set<Animation>()
    const selector =
      '.page-heading, .hero-copy, .hero-blueprint, .section-heading, .project-card, .approach-grid > article, .career-list > a, .contact-band, .timeline-item, .architecture-list > article, .publication-card, .writing-card, .talk-row, .education-grid > article, .leadership-grid > article, .contact-option, .about-card, .result-cards > div'
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          if (
            preference.matches ||
            document.documentElement.dataset.motion === 'paused' ||
            entry.target.contains(document.activeElement)
          )
            return
          const animation = entry.target.animate(
            [
              { opacity: 0.35, translate: '0 26px', scale: '0.985' },
              { opacity: 1, translate: '0 0', scale: '1' },
            ],
            {
              duration: 700,
              delay: (index % 4) * 65,
              easing: 'cubic-bezier(.16,1,.3,1)',
            },
          )
          animations.add(animation)
          void animation.finished.catch(() => {}).finally(() => animations.delete(animation))
        })
      },
      { threshold: 0.08 },
    )
    function discover() {
      if (preference.matches || document.documentElement.dataset.motion === 'paused') return
      main!.querySelectorAll(selector).forEach((element) => {
        if (seen.has(element)) return
        seen.add(element)
        observer.observe(element)
      })
    }
    function changePreference() {
      if (preference.matches || document.documentElement.dataset.motion === 'paused') {
        observer.disconnect()
        animations.forEach((animation) => animation.cancel())
      } else {
        seen = new WeakSet<Element>()
        discover()
      }
    }
    discover()
    const mutations = new MutationObserver(discover)
    mutations.observe(main, { childList: true, subtree: true })
    preference.addEventListener('change', changePreference)
    window.addEventListener('portfolio-motion', changePreference)
    return () => {
      observer.disconnect()
      mutations.disconnect()
      animations.forEach((animation) => animation.cancel())
      preference.removeEventListener('change', changePreference)
      window.removeEventListener('portfolio-motion', changePreference)
    }
  }, [pathname])
  return null
}
