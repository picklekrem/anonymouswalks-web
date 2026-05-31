'use client'

import React from 'react'

const PRIMARY = '#6E56CF'
const ACCENT = '#8b7cf8'
const BARS = 40

// Deterministic — no Math.random() to avoid hydration mismatch
const BAR_CONFIG = Array.from({ length: BARS }, (_, i) => {
  const t = i / (BARS - 1)
  // Bell curve: tall in the middle, short at edges
  const height = Math.sin(t * Math.PI) * 90 + 14
  // Varied durations & delays via primes to de-sync bars
  const duration = 0.5 + (i % 11) * 0.11
  const delay = (i % 13) * 0.072
  return { height, duration, delay }
})

const Waveform: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes waveBar {
          0%   { transform: scaleY(0.12); opacity: 0.25; }
          100% { transform: scaleY(1);    opacity: 1;    }
        }
      `}</style>

      <div
        style={{ width: 340, height: 220 }}
        className="flex items-center justify-center"
      >
        <div className="flex items-center gap-[4px]" style={{ height: 160 }}>
          {BAR_CONFIG.map((bar, i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: bar.height,
                borderRadius: 4,
                background: `linear-gradient(to top, ${PRIMARY}, ${ACCENT})`,
                boxShadow: `0 0 8px ${PRIMARY}70`,
                animation: `waveBar ${bar.duration}s ease-in-out ${bar.delay}s infinite alternate`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Waveform
