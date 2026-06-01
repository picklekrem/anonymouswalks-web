'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { translations, Lang } from '@/lib/i18n'

const APP_STORE_URL = '#'

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function Reveal({ children, delay = 0, className = '' }: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Hero visual: concentric pulsing rings (sound waves) ─────────────────────
function VoiceOrb() {
  return (
    <>
      <style>{`
        @keyframes ringOut {
          0%   { transform: scale(0.9); opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes orbPulse {
          0%,100% { box-shadow: 0 0 0 0 #6E56CF44, 0 0 40px #6E56CF55; }
          50%      { box-shadow: 0 0 0 16px #6E56CF00, 0 0 70px #6E56CF88; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ring, .orb { animation: none !important; }
        }
      `}</style>
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: 320, height: 320 }}
        aria-hidden="true"
      >
        {/* Ambient background glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 320, height: 320,
            background: 'radial-gradient(circle, #6E56CF22 0%, transparent 70%)',
          }}
        />
        {/* Rings */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="ring absolute rounded-full border border-[#6E56CF]"
            style={{
              width: 86 + i * 46,
              height: 86 + i * 46,
              opacity: 0,
              animation: `ringOut 3.6s ease-out ${i * 0.72}s infinite`,
            }}
          />
        ))}
        {/* Center orb */}
        <div
          className="orb relative z-10 rounded-full flex items-center justify-center"
          style={{
            width: 80, height: 80,
            background: 'linear-gradient(135deg, #8b7cf8 0%, #6E56CF 100%)',
            animation: 'orbPulse 2.8s ease-in-out infinite',
          }}
        >
          {/* Mic icon */}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8"  y1="22" x2="16" y2="22" />
          </svg>
        </div>
      </div>
    </>
  )
}

// ─── Feature card icons ───────────────────────────────────────────────────────
const FEATURE_ICONS = [
  // Anonymous — person with strikethrough
  <svg key="a" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 21a7.5 7.5 0 0 0-11 0" />
    <circle cx="12" cy="9" r="4" />
    <line x1="2" y1="2" x2="22" y2="22" strokeOpacity="0.55" />
  </svg>,
  // Voice only — mic
  <svg key="b" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8"  y1="22" x2="16" y2="22" />
  </svg>,
  // Safe space — shield check
  <svg key="c" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>,
]

// ─── Shared badge component ───────────────────────────────────────────────────
function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6E56CF]/30 bg-[#6E56CF]/10 text-[#8b7cf8] text-xs font-medium tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8b7cf8] animate-pulse flex-shrink-0" />
      {children}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const t = translations[lang]
  const s = t.sections

  function closeWaitlist() {
    setShowWaitlist(false)
    setStatus('idle')
    setEmail('')
  }

  async function subscribe() {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-black/75">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight">
            Anon<span className="text-[#8b7cf8]">Talks</span>
          </span>
          <div className="flex items-center gap-3">
            {/* EN/TR switcher */}
            <div className="flex bg-white/[0.06] rounded-full p-0.5 border border-white/[0.08]">
              {(['en', 'tr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    lang === l
                      ? 'bg-[#6E56CF] text-white shadow-sm'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {/* Download CTA — hidden on mobile */}
            <a
              href={APP_STORE_URL}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#6E56CF] hover:bg-[#8b7cf8] text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {t.nav.cta}
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Right-side ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 55% 55% at 75% 50%, #6E56CF1a 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 w-full py-24">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-8">

            {/* Content */}
            <div className="flex-1 lg:max-w-[520px] flex flex-col gap-6 items-start">
              <Reveal>
                <Badge>{s.hero.badge}</Badge>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl font-bold leading-[1.06] tracking-tight">
                  {s.hero.title}
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #8b7cf8 0%, #6E56CF 70%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {s.hero.subtitle}
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="text-white/50 text-lg leading-relaxed">
                  {s.hero.description}
                </p>
              </Reveal>

              {/* Not a dating app */}
              <Reveal delay={180}>
                <div className="flex items-center gap-2 text-white/25 text-xs border border-white/[0.07] rounded-full px-3 py-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
                  </svg>
                  {s.hero.disclaimer}
                </div>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={220}>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={APP_STORE_URL}
                    className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#6E56CF] hover:bg-[#8b7cf8] text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
                    style={{ boxShadow: '0 8px 32px #6E56CF35' }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    {s.hero.actions.download}
                  </a>
                  <button
                    onClick={() => setShowWaitlist(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 hover:border-[#6E56CF]/40 hover:bg-white/[0.04] text-white/70 hover:text-white font-medium text-sm transition-all duration-200 cursor-pointer"
                  >
                    {s.hero.actions.waitlist}
                  </button>
                </div>
              </Reveal>

              {/* Stats */}
              <Reveal delay={280}>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/25">
                  {s.hero.stats.map((stat, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#6E56CF]" />
                      {stat}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Visual */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <VoiceOrb />
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── VOICE SECTION ───────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <Reveal>
            <Badge>{s.voice.badge}</Badge>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1]">
              {s.voice.title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-white/50 text-lg leading-relaxed">
              {s.voice.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── NOT A DATING APP ────────────────────────────────────────────────── */}
      <section className="pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] px-7 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row items-start gap-5">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#f87171" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-base sm:text-lg mb-1.5 tracking-tight">
                  {t.notDating.heading}
                </p>
                <p className="text-white/45 text-sm leading-relaxed max-w-xl">
                  {t.notDating.body}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="mb-14">
            <Reveal><Badge>{s.features.badge}</Badge></Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1]">
                {s.features.title}{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #8b7cf8 0%, #6E56CF 70%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {s.features.subtitle}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 text-white/50 text-lg leading-relaxed max-w-lg">
                {s.features.description}
              </p>
            </Reveal>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {s.features.items.map((feature, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/[0.07] bg-[#080808] hover:border-[#6E56CF]/30 hover:bg-[#0c0a12] transition-all duration-300 p-7 group cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-[#6E56CF]/10 border border-[#6E56CF]/15 flex items-center justify-center text-[#8b7cf8] mb-5 group-hover:bg-[#6E56CF]/18 transition-colors duration-300">
                    {FEATURE_ICONS[i]}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── DOWNLOAD CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        {/* Bottom ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 50% 110%, #6E56CF18 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <Reveal><Badge>{s.download.badge}</Badge></Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1]">
              {s.download.title}
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #8b7cf8 0%, #6E56CF 70%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {s.download.subtitle}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-white/50 text-lg leading-relaxed">
              {s.download.description}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={APP_STORE_URL}
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#6E56CF] hover:bg-[#8b7cf8] text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
                style={{ boxShadow: '0 8px 32px #6E56CF35' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {s.download.actions.download}
              </a>
              <button
                onClick={() => setShowWaitlist(true)}
                className="flex items-center justify-center px-7 py-4 rounded-xl border border-white/10 hover:border-[#6E56CF]/40 hover:bg-white/[0.04] text-white/70 hover:text-white font-medium text-sm transition-all duration-200 cursor-pointer"
              >
                {s.download.actions.stayUpdated}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm">
              Anon<span className="text-[#8b7cf8]">Talks</span>
            </span>
            <span className="text-white/10 select-none">—</span>
            <span className="text-white/30 text-sm">{t.footer.tagline}</span>
          </div>
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} AnonTalks. {t.footer.rights}
          </p>
        </div>
      </footer>

      {/* ── WAITLIST MODAL ──────────────────────────────────────────────────── */}
      {showWaitlist && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeWaitlist() }}
        >
          <div className="w-full sm:max-w-sm bg-[#0c0c0c] border border-white/[0.09] rounded-t-3xl sm:rounded-2xl p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">{t.waitlist.title}</h3>
              <button
                onClick={closeWaitlist}
                aria-label="Close"
                className="w-7 h-7 rounded-full bg-white/[0.07] hover:bg-white/[0.14] flex items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="11" y2="11" />
                  <line x1="11" y1="1" x2="1" y2="11" />
                </svg>
              </button>
            </div>

            <p className="text-white/35 text-sm mb-5 leading-relaxed">
              {t.waitlist.description}
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.download.success}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && subscribe()}
                  placeholder={t.download.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white placeholder-white/20 text-sm outline-none focus:border-[#6E56CF]/50 transition-colors"
                />
                <button
                  onClick={subscribe}
                  disabled={status === 'loading'}
                  className="w-full px-5 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#8b7cf8] disabled:opacity-50 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
                >
                  {status === 'loading' ? '...' : t.download.cta}
                </button>
              </div>
            )}

            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2.5">{t.download.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
