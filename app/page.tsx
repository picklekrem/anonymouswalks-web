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
      badge: lang === 'en' ? 'Anonymous · Voice · Real' : 'Anonim · Ses · Gerçek',
      title: lang === 'en' ? 'Walk Together,' : 'Birlikte Yürü,',
      subtitle: lang === 'en' ? 'Anonymously.' : 'Anonim Olarak.',
      description: lang === 'en'
        ? 'Connect with strangers through voice. No faces, no profiles — just honest conversations that matter.'
        : 'Sesle yabancılarla bağlan. Yüzler yok, profiller yok — sadece önemli, dürüst sohbetler.',
      align: 'left' as const,
      actions: [
        {
          label: lang === 'en' ? 'Download on App Store' : "App Store'dan İndir",
          variant: 'primary' as const,
          onClick: () => window.open(APP_STORE_URL, '_self'),
        },
        {
          label: lang === 'en' ? 'Join Waitlist' : 'Bekleme Listesine Katıl',
          variant: 'secondary' as const,
          onClick: () => setShowWaitlist(true),
        },
      ],
    },
    {
      id: 'voice',
      badge: lang === 'en' ? 'Voice First' : 'Ses Önce',
      title: lang === 'en' ? 'Heard, Not Seen' : 'Duyulan, Görülmeyen',
      description: lang === 'en'
        ? 'In a world obsessed with appearances, AnonymousWalks strips it all away. Just your voice, just your words — pure human connection without judgment, without barriers, without pretense.'
        : 'Görünüşlere takıntılı bir dünyada AnonymousWalks hepsini soyup atar. Sadece sesin, sadece sözlerin — yargısız, engelsiz, gösterişsiz saf insan bağlantısı.',
      align: 'center' as const,
    },
    {
      id: 'features',
      badge: lang === 'en' ? 'Why AnonymousWalks' : 'Neden AnonymousWalks',
      title: lang === 'en' ? 'Built for' : 'Şunun İçin Yapıldı:',
      subtitle: lang === 'en' ? 'Real Connection.' : 'Gerçek Bağlantı.',
      description: lang === 'en'
        ? 'Every detail of AnonymousWalks is designed to protect you and help you connect deeply — no noise, no performance.'
        : "AnonymousWalks'ın her detayı seni korumak ve derin bağlantı kurmanı sağlamak için tasarlandı — gürültü yok, performans yok.",
      align: 'left' as const,
      features: [
        {
          title: lang === 'en' ? 'Truly Anonymous' : 'Gerçekten Anonim',
          description: lang === 'en'
            ? 'No usernames, no photos, no profiles. Your identity stays hidden — always.'
            : 'Kullanıcı adı yok, fotoğraf yok, profil yok. Kimliğin her zaman gizli kalır.',
        },
        {
          title: lang === 'en' ? 'Voice Only' : 'Sadece Ses',
          description: lang === 'en'
            ? 'Real conversations over voice. No text, no distractions — just your voice and theirs.'
            : 'Sesle gerçek sohbetler. Metin yok, dikkat dağıtıcı yok — sadece sesin ve onlarınki.',
        },
        {
          title: lang === 'en' ? 'Your Safe Space' : 'Güvenli Alanın',
          description: lang === 'en'
            ? 'Block, report, and end any conversation instantly. Safety is non-negotiable.'
            : 'Engelle, raporla ve anlık olarak her konuşmayı sonlandır. Güvenlik pazarlık konusu değildir.',
        },
      ],
    },
    {
      id: 'download',
      badge: lang === 'en' ? 'Ready?' : 'Hazır mısın?',
      title: lang === 'en' ? 'Start Your First Walk' : 'İlk Yürüyüşünü Başlat',
      subtitle: lang === 'en' ? 'Tonight.' : 'Bu Gece.',
      description: lang === 'en'
        ? 'Join thousands of people having honest, anonymous voice conversations every night. Free on iOS. No account required.'
        : 'Her gece dürüst, anonim sesli sohbetler yapan binlerce kişiye katıl. iOS\'ta ücretsiz. Hesap gerekmez.',
      align: 'center' as const,
      actions: [
        {
          label: lang === 'en' ? 'Download on App Store' : "App Store'dan İndir",
          variant: 'primary' as const,
          onClick: () => window.open(APP_STORE_URL, '_self'),
        },
        {
          label: lang === 'en' ? 'Stay Updated' : 'Güncel Kal',
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
                {lang === 'en' ? 'Stay Updated' : 'Güncel Kal'}
              </h3>
              <button
                onClick={() => { setShowWaitlist(false); setStatus('idle'); setEmail('') }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-lg leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              {lang === 'en'
                ? "We ship often. Drop your email and we'll keep you in the loop."
                : 'Sık sık yenilik çıkarıyoruz. E-postanı bırak, seni haberdar edelim.'}
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
