import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

export function MotionToggle() {
  const [userPaused, setUserPaused] = useState(() => {
    try {
      return localStorage.getItem('va-motion') === 'paused'
    } catch {
      return false
    }
  })
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const paused = reduced || userPaused
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'running'
    try {
      localStorage.setItem('va-motion', userPaused ? 'paused' : 'running')
    } catch {
      /* A paused state still works without persistence. */
    }
    window.dispatchEvent(new Event('portfolio-motion'))
  }, [paused, userPaused])
  const label = reduced
    ? 'Motion reduced by your system settings'
    : paused
      ? 'Enable visual motion'
      : 'Pause visual motion'
  return (
    <button
      type="button"
      className="icon-button motion-toggle"
      aria-label={label}
      title={label}
      disabled={reduced}
      onClick={() => setUserPaused(!userPaused)}
    >
      {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
    </button>
  )
}
