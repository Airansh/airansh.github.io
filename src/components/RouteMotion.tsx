import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Progressive enhancement: content stays visible when motion or observers are unavailable.
export function RouteMotion() {
  const { pathname } = useLocation()
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main || !('IntersectionObserver' in window) || !Element.prototype.animate) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let seen = new WeakSet<Element>()
    const animations = new Set<Animation>()
    const selector =
      '.section-heading, .project-card, .approach-grid > article, .career-list > a, .contact-band, .timeline-item, .architecture-list > article, .publication-card, .writing-card, .talk-row, .education-grid > article, .leadership-grid > article, .contact-option, .about-card, .result-cards > div'
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
          const animation = entry.target.animate([{ translate: '0 14px' }, { translate: '0 0' }], {
            duration: 480,
            delay: (index % 3) * 45,
            easing: 'cubic-bezier(.2,.65,.3,1)',
          })
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
