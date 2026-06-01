'use client'

import { useState } from 'react'

const APP_STORE_URL = '#'

type Lang = 'tr' | 'en'

const copy = {
  tr: {
    lang: 'EN',
    hook: 'Az önce bir stiker okuttun.',
    appName: 'AnonymousTalks',
    tagline: 'Yabancılarla sesli konuş. Tamamen anonim.',
    emotional: {
      heading: 'Bazen, seni hiç tanımayan biri seni en iyi anlayan oluyor.',
      body: 'Arkadaşlarına veya ailene söyleyemediklerini, seni hiç görmeyecek birine anlatabilirsin. Yargı yok. Geçmiş yok. Sadece iki ses.',
    },
    notDating: {
      tag: 'Dating uygulaması değil',
      heading: 'Bu bir dating uygulaması değil.',
      body: 'Burada flört yok, partner arama yok, buluşma yok. Buradaki insanlar sadece gerçekten konuşmak istiyor. Bu kadar.',
      items: [
        'Profil yok, fotoğraf yok, isim yok',
        'Konuşmayı istediğin an bitirebilirsin',
        'Kimse seni bulamaz, takip edemez',
      ],
    },
    howItWorks: {
      heading: 'Nasıl çalışır?',
      steps: [
        { n: '1', text: 'Uygulamayı aç, rolünü seç: konuşmak mı, dinlemek mi?' },
        { n: '2', text: 'Anonim olarak seninle eşleşmek isteyen biriyle bağlanırsın.' },
        { n: '3', text: 'Sadece sesiniz. Ne isim, ne yüz, ne geçmiş.' },
      ],
    },
    cta: {
      download: "App Store'dan Ücretsiz İndir",
      waitlist: 'Bekleme Listesine Katıl',
    },
    waitlistModal: {
      title: 'Güncel Kal',
      body: 'Yakında iOS\'ta yayında. E-postanı bırak, haber verelim.',
      placeholder: 'eposta@adresin.com',
      btn: 'Abone Ol',
      success: 'Abone oldun! Gelişmelerden haberdar edeceğiz.',
      error: 'Bir şeyler ters gitti. Tekrar dene.',
    },
    footer: 'AnonymousTalks · Tamamen anonim · iOS',
  },
  en: {
    lang: 'TR',
    hook: 'You just scanned a sticker.',
    appName: 'AnonymousTalks',
    tagline: 'Talk to strangers. Voice only. Fully anonymous.',
    emotional: {
      heading: "Sometimes, someone who doesn't know you understands you best.",
      body: "You can tell a stranger things you can't tell the people in your life. No judgment. No history. Just two voices.",
    },
    notDating: {
      tag: 'Not a dating app',
      heading: 'This is not a dating app.',
      body: "No flirting, no finding a partner, no meetups. The people here actually just want to talk. That's it.",
      items: [
        'No profiles, no photos, no names',
        'End any conversation instantly',
        "Nobody can find you or track you",
      ],
    },
    howItWorks: {
      heading: 'How it works',
      steps: [
        { n: '1', text: 'Open the app and choose your role: talk or listen?' },
        { n: '2', text: "You get connected with someone who wants to talk, anonymously." },
        { n: '3', text: 'Just your voices. No names, no faces, no history.' },
      ],
    },
    cta: {
      download: 'Download Free on App Store',
      waitlist: 'Join Waitlist',
    },
    waitlistModal: {
      title: 'Stay Updated',
      body: "Coming soon to iOS. Drop your email and we'll let you know.",
      placeholder: 'your@email.com',
      btn: 'Subscribe',
      success: "You're subscribed! We'll keep you in the loop.",
      error: 'Something went wrong. Try again.',
    },
    footer: 'AnonymousTalks · Fully anonymous · iOS',
  },
} as const

export default function QRPage() {
  const [lang, setLang] = useState<Lang>('tr')
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const t = copy[lang]

  function closeModal() { setShowWaitlist(false); setStatus('idle'); setEmail('') }

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

      {/* ── STICKY TOP BAR ─────────────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 h-14 border-b border-white/[0.06] backdrop-blur-xl bg-black/80">
        <span className="font-bold text-sm tracking-tight">
          Anon<span className="text-[#8b7cf8]">Talks</span>
        </span>
        <button
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          className="text-xs font-semibold text-white/40 hover:text-white border border-white/10 hover:border-white/25 rounded-full px-3 py-1.5 transition-all cursor-pointer"
        >
          {t.lang}
        </button>
      </div>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 pb-32 text-center relative">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 60%, #6E56CF20 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center gap-5">
          {/* Hook */}
          <p className="text-white/35 text-sm tracking-wide">
            {t.hook}
          </p>

          {/* App name */}
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 30%, #8b7cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t.appName}
          </h1>

          {/* Mic rings visual */}
          <MicRings />

          {/* Tagline */}
          <p className="text-white/60 text-base leading-relaxed">
            {t.tagline}
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-white/20">
          <span className="text-xs tracking-widest uppercase">scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: 'bounce 1.5s ease-in-out infinite' }}
            aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── EMOTIONAL ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-sm mx-auto">
          <blockquote
            className="text-2xl font-bold leading-snug tracking-tight mb-5"
            style={{
              background: 'linear-gradient(135deg, #ffffff 40%, #8b7cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            "{t.emotional.heading}"
          </blockquote>
          <p className="text-white/50 text-base leading-relaxed">
            {t.emotional.body}
          </p>
        </div>
      </section>

      {/* ── NOT A DATING APP ───────────────────────────────────────────────── */}
      <section className="px-6 py-16 border-t border-white/[0.06]">
        <div className="max-w-sm mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/8 text-red-400 text-xs font-semibold mb-5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
            </svg>
            {t.notDating.tag}
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-3 text-white">
            {t.notDating.heading}
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-6">
            {t.notDating.body}
          </p>

          {/* Checklist */}
          <ul className="flex flex-col gap-3">
            {t.notDating.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/55">
                <span className="w-5 h-5 rounded-full bg-[#6E56CF]/15 border border-[#6E56CF]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                    stroke="#8b7cf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="px-6 py-16 border-t border-white/[0.06]">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold tracking-tight mb-8 text-white">
            {t.howItWorks.heading}
          </h2>
          <ol className="flex flex-col gap-6">
            {t.howItWorks.steps.map((step) => (
              <li key={step.n} className="flex items-start gap-4">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-[#8b7cf8]"
                  style={{ background: 'linear-gradient(135deg, #6E56CF22, #8b7cf822)', border: '1px solid #6E56CF33' }}
                >
                  {step.n}
                </span>
                <p className="text-white/60 text-sm leading-relaxed pt-1">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── DOWNLOAD CTA SECTION ───────────────────────────────────────────── */}
      <section className="px-6 py-16 pb-40 border-t border-white/[0.06] text-center">
        <div className="max-w-sm mx-auto">
          <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Free · iOS</p>
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
            {t.appName}
          </h2>
          <p className="text-white/40 text-sm mb-0">{t.footer}</p>
        </div>
      </section>

      {/* ── STICKY BOTTOM CTA ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 px-5 pb-6 pt-3"
        style={{ background: 'linear-gradient(to top, #000000 60%, transparent)' }}>
        <div className="max-w-sm mx-auto flex flex-col gap-2.5">
          <a
            href={APP_STORE_URL}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-[#6E56CF] hover:bg-[#8b7cf8] text-white font-bold text-sm transition-colors duration-200 cursor-pointer"
            style={{ boxShadow: '0 8px 32px #6E56CF50' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            {t.cta.download}
          </a>
          <button
            onClick={() => setShowWaitlist(true)}
            className="w-full py-3 rounded-2xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-medium transition-all cursor-pointer"
          >
            {t.cta.waitlist}
          </button>
        </div>
      </div>

      {/* ── WAITLIST MODAL ─────────────────────────────────────────────────── */}
      {showWaitlist && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/85 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="w-full bg-[#0c0c0c] border-t border-white/[0.09] rounded-t-3xl p-7 pb-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">{t.waitlistModal.title}</h3>
              <button
                onClick={closeModal}
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
            <p className="text-white/35 text-sm mb-5 leading-relaxed">{t.waitlistModal.body}</p>

            {status === 'success' ? (
              <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.waitlistModal.success}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && subscribe()}
                  placeholder={t.waitlistModal.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white placeholder-white/20 text-sm outline-none focus:border-[#6E56CF]/50 transition-colors"
                />
                <button
                  onClick={subscribe}
                  disabled={status === 'loading'}
                  className="w-full px-5 py-3.5 rounded-xl bg-[#6E56CF] hover:bg-[#8b7cf8] disabled:opacity-50 text-white font-bold text-sm transition-colors duration-200 cursor-pointer"
                >
                  {status === 'loading' ? '...' : t.waitlistModal.btn}
                </button>
              </div>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2.5">{t.waitlistModal.error}</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(4px); }
        }
      `}</style>
    </div>
  )
}

// ─── Minimal mic rings for mobile hero ───────────────────────────────────────
function MicRings() {
  return (
    <>
      <style>{`
        @keyframes qrRing {
          0%   { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(1.8);  opacity: 0;   }
        }
        @keyframes qrOrb {
          0%,100% { box-shadow: 0 0 0 0 #6E56CF44, 0 0 30px #6E56CF55; }
          50%      { box-shadow: 0 0 0 10px #6E56CF00, 0 0 55px #6E56CF88; }
        }
        @media (prefers-reduced-motion: reduce) {
          .qr-ring, .qr-orb { animation: none !important; }
        }
      `}</style>
      <div className="relative flex items-center justify-center my-2" style={{ width: 200, height: 200 }} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="qr-ring absolute rounded-full border border-[#6E56CF]"
            style={{ width: 64 + i * 34, height: 64 + i * 34, opacity: 0, animation: `qrRing 3.2s ease-out ${i * 0.8}s infinite` }} />
        ))}
        <div className="qr-orb relative z-10 rounded-full flex items-center justify-center"
          style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #8b7cf8, #6E56CF)', animation: 'qrOrb 2.8s ease-in-out infinite' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
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
