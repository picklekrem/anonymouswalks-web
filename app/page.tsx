'use client'

import { useState, useEffect } from 'react'
import { translations, Lang } from '@/lib/i18n'

// Replace with actual App Store URL when available
const APP_STORE_URL = '#'

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const t = translations[lang]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
    <div className="relative min-h-screen bg-background text-primary overflow-x-hidden">
      {/* Background glows */}
      <div className="glow-orb w-[600px] h-[600px] bg-accent/20 top-[-200px] left-[-200px]" />
      <div className="glow-orb w-[400px] h-[400px] bg-accent/10 top-[60%] right-[-150px]" />

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">
            Anon<span className="text-accent">Walks</span>
          </span>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-surface rounded-full p-1 border border-border">
              {(['en', 'tr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    lang === l
                      ? 'bg-accent text-white'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <a
              href={APP_STORE_URL}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-accent hover:bg-accent-light text-white text-sm font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {t.nav.cta}
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t.hero.badge}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            {t.hero.title}
            <br />
            <span className="gradient-text">{t.hero.titleAccent}</span>
          </h1>

          <p className="text-secondary text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
            {t.hero.subtitle}
          </p>

          {/* App Store button */}
          <a
            href={APP_STORE_URL}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-black/60 leading-none mb-0.5 uppercase tracking-wide">
                {lang === 'en' ? 'Download on the' : 'İndir'}
              </div>
              <div className="text-base font-bold text-black leading-none">App Store</div>
            </div>
          </a>

          <p className="text-tertiary text-xs mt-4">
            {lang === 'en' ? 'Free · iOS 16+' : 'Ücretsiz · iOS 16+'}
          </p>
        </div>

        {/* Right — Phone Mockup */}
        <div className="flex-shrink-0 animate-float">
          <PhoneMockup lang={lang} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative max-w-6xl mx-auto px-6 py-24">
        <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-4">
          {t.features.title}
        </h2>
        <p className="reveal text-secondary text-center mb-16 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Built for people who want real connection without the noise of social media.'
            : 'Sosyal medyanın gürültüsü olmadan gerçek bağlantı isteyenler için yapıldı.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {t.features.items.map((item, i) => (
            <div
              key={i}
              className="reveal p-6 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-all duration-300 group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-secondary text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative bg-surface/30 border-y border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="reveal text-3xl sm:text-4xl font-bold text-center mb-16">
            {t.howItWorks.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="reveal flex flex-col items-center text-center" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="w-14 h-14 rounded-full border-2 border-accent/50 bg-accent/10 flex items-center justify-center font-bold text-accent text-lg mb-5 animate-pulse-glow">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ── */}
      <section id="download" className="relative max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="glow-orb w-[500px] h-[500px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative">
          <h2 className="reveal text-4xl sm:text-5xl font-bold mb-4">
            {t.download.title}
          </h2>
          <p className="reveal text-secondary text-lg mb-10 leading-relaxed">
            {t.download.subtitle}
          </p>

          {/* Big App Store button */}
          <div className="reveal flex justify-center mb-12">
            <a
              href={APP_STORE_URL}
              className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-white hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-white/20 hover:scale-[1.03] active:scale-[0.98]"
            >
              <svg className="w-9 h-9 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-black/60 leading-none mb-1 uppercase tracking-wide">
                  {lang === 'en' ? 'Download on the' : 'İndir'}
                </div>
                <div className="text-xl font-bold text-black leading-none">App Store</div>
              </div>
            </a>
          </div>

          {/* Newsletter */}
          <div className="reveal">
            <p className="text-tertiary text-sm mb-4">{t.download.newsletterLabel}</p>

            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-success/10 border border-success/30 text-success font-medium">
                <span>✓</span> {t.download.success}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && subscribe()}
                  placeholder={t.download.placeholder}
                  className="flex-1 px-4 py-3.5 rounded-xl bg-surface border border-border text-primary placeholder-secondary text-sm outline-none focus:border-accent/60 transition-colors"
                />
                <button
                  onClick={subscribe}
                  disabled={status === 'loading'}
                  className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface/80 border border-border disabled:opacity-50 text-primary font-semibold text-sm transition-colors duration-200 whitespace-nowrap"
                >
                  {status === 'loading' ? '...' : t.download.cta}
                </button>
              </div>
            )}

            {status === 'error' && (
              <p className="text-destructive text-sm mt-3">{t.download.error}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base">
              Anon<span className="text-accent">Walks</span>
            </span>
            <span className="text-tertiary text-sm">—</span>
            <span className="text-secondary text-sm">{t.footer.tagline}</span>
          </div>
          <p className="text-tertiary text-sm">
            © {new Date().getFullYear()} AnonWalks. {t.footer.rights}
          </p>
        </div>
      </footer>
    </div>
  )
}

// ── Phone Mockup Component ──────────────────────────────────────────────

function PhoneMockup({ lang }: { lang: Lang }) {
  const isEN = lang === 'en'

  return (
    <div className="relative w-[260px] h-[520px]">
      <div className="absolute inset-0 bg-accent/20 rounded-[44px] blur-3xl scale-90" />

      <div className="relative w-full h-full rounded-[44px] border-2 border-accent/40 bg-[#0a0a0a] overflow-hidden shadow-2xl animate-pulse-glow">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />

        <div className="pt-12 px-5 pb-6 h-full flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-secondary mb-1">
              {isEN ? 'How are you feeling tonight?' : 'Bu gece nasıl hissediyorsun?'}
            </p>
          </div>

          <div className="flex rounded-xl bg-[#111] border border-[#1c1c1c] overflow-hidden text-center">
            <div className="flex-1 py-2">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-[11px] font-semibold">3</span>
              </div>
              <p className="text-[9px] text-secondary">{isEN ? 'online' : 'çevrimiçi'}</p>
            </div>
            <div className="w-px bg-[#1c1c1c]" />
            <div className="flex-1 py-2">
              <p className="text-[11px] font-semibold mb-0.5">1</p>
              <p className="text-[9px] text-secondary">{isEN ? 'connected' : 'bağlı'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#111] border border-success/40">
            <span className="text-success text-xs">✓</span>
            <div>
              <p className="text-[10px] font-medium text-success">
                {isEN ? 'Matching open' : 'Eşleşme açık'}
              </p>
              <p className="text-[9px] text-secondary">
                {isEN ? 'Closes at 00:00 · 2h 14m left' : '00:00\'da kapanır · 2s 14dk kaldı'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111] border border-accent/50">
              <span className="text-base">🎙️</span>
              <div>
                <p className="text-[11px] font-semibold">{isEN ? 'Talk' : 'Konuş'}</p>
                <p className="text-[9px] text-secondary">
                  {isEN ? 'I want to share something' : 'Paylaşmak istiyorum'}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111] border border-[#1c1c1c]">
              <span className="text-base">🎧</span>
              <div>
                <p className="text-[11px] font-semibold">{isEN ? 'Listen' : 'Dinle'}</p>
                <p className="text-[9px] text-secondary">
                  {isEN ? 'I want to hear someone' : 'Birini dinlemek istiyorum'}
                </p>
              </div>
            </div>
          </div>

          <div className="h-9 rounded-xl bg-white flex items-center justify-center">
            <p className="text-[11px] font-bold text-black">
              {isEN ? 'Start Matching' : 'Eşleşmeye Başla'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
