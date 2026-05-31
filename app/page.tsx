'use client'

import { useState } from 'react'
import { translations, Lang } from '@/lib/i18n'
import { ScrollGlobe } from '@/components/ui/landing-page'

const APP_STORE_URL = '#'

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const t = translations[lang]
  const s = t.sections

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

  const sections = [
    {
      id: 'hero',
      badge: s.hero.badge,
      title: s.hero.title,
      subtitle: s.hero.subtitle,
      description: s.hero.description,
      note: s.hero.disclaimer,
      align: 'left' as const,
      actions: [
        {
          label: s.hero.actions.download,
          variant: 'primary' as const,
          onClick: () => window.open(APP_STORE_URL, '_self'),
        },
        {
          label: s.hero.actions.waitlist,
          variant: 'secondary' as const,
          onClick: () => setShowWaitlist(true),
        },
      ],
    },
    {
      id: 'voice',
      badge: s.voice.badge,
      title: s.voice.title,
      description: s.voice.description,
      align: 'center' as const,
    },
    {
      id: 'features',
      badge: s.features.badge,
      title: s.features.title,
      subtitle: s.features.subtitle,
      description: s.features.description,
      align: 'left' as const,
      features: s.features.items.map((item) => ({
        title: item.title,
        description: item.description,
      })),
    },
    {
      id: 'download',
      badge: s.download.badge,
      title: s.download.title,
      subtitle: s.download.subtitle,
      description: s.download.description,
      align: 'center' as const,
      actions: [
        {
          label: s.download.actions.download,
          variant: 'primary' as const,
          onClick: () => window.open(APP_STORE_URL, '_self'),
        },
        {
          label: s.download.actions.stayUpdated,
          variant: 'secondary' as const,
          onClick: () => setShowWaitlist(true),
        },
      ],
    },
  ]

  return (
    <div className="relative bg-black">
      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-black/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight text-white">
            Anon<span className="text-primary">Walks</span>
          </span>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
              {(['en', 'tr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    lang === l ? 'bg-primary text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <a
              href={APP_STORE_URL}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-accent text-white text-sm font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {t.nav.cta}
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <ScrollGlobe
        sections={sections}
        className="pt-16"
      />

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base text-white">
              Anon<span className="text-primary">Walks</span>
            </span>
            <span className="text-white/20 text-sm">—</span>
            <span className="text-white/40 text-sm">{t.footer.tagline}</span>
          </div>
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} AnonWalks. {t.footer.rights}
          </p>
        </div>
      </footer>

      {/* Waitlist overlay */}
      {showWaitlist && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowWaitlist(false)}
        >
          <div className="w-full sm:max-w-md bg-[#111] border border-white/10 rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {t.waitlist.title}
              </h3>
              <button
                onClick={() => { setShowWaitlist(false); setStatus('idle'); setEmail('') }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-lg leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              {t.waitlist.description}
            </p>

            {status === 'success' ? (
              <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-medium">
                <span>✓</span> {t.download.success}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && subscribe()}
                  placeholder={t.download.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none focus:border-primary/60 transition-colors"
                />
                <button
                  onClick={subscribe}
                  disabled={status === 'loading'}
                  className="w-full px-6 py-3.5 rounded-xl bg-primary hover:bg-accent disabled:opacity-50 text-white font-semibold text-sm transition-colors duration-200"
                >
                  {status === 'loading' ? '...' : t.download.cta}
                </button>
              </div>
            )}

            {status === 'error' && (
              <p className="text-red-400 text-sm mt-3">{t.download.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
