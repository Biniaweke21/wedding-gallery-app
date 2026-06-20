'use client'

import { useState, useEffect } from 'react'

export default function TibebBorder({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const [revealed, setRevealed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setReducedMotion(true)
      setRevealed(true)
      return
    }
    const timer = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const containerStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        clipPath: revealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
        transition: revealed ? 'clip-path 900ms cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
      }

  return (
    <div style={containerStyle} className={className}>
      <svg
        width="100%"
        height="46"
        viewBox="0 0 680 46"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="tibeb-pattern" x="0" y="0" width="32" height="46" patternUnits="userSpaceOnUse">
            <path d="M0,8 L8,2 L16,8 L24,2 L32,8" fill="none" stroke="#b8860b" strokeWidth="2" />
            <rect x="6" y="0" width="4" height="4" fill="#6b1f2e" transform="rotate(45 8 2)" />
            <rect x="22" y="0" width="4" height="4" fill="#6b1f2e" transform="rotate(45 24 2)" />
            <path d="M0,23 L8,17 L16,23 L24,17 L32,23" fill="none" stroke="#1a1410" strokeWidth="1.5" />
            <path d="M0,29 L8,23 L16,29 L24,23 L32,29" fill="none" stroke="#b8860b" strokeWidth="1.5" />
            <path d="M0,38 L8,44 L16,38 L24,44 L32,38" fill="none" stroke="#b8860b" strokeWidth="2" />
            <rect x="6" y="42" width="4" height="4" fill="#6b1f2e" transform="rotate(45 8 44)" />
            <rect x="22" y="42" width="4" height="4" fill="#6b1f2e" transform="rotate(45 24 44)" />
          </pattern>
        </defs>
        <rect width="680" height="46" fill="url(#tibeb-pattern)" />
      </svg>
    </div>
  )
}
