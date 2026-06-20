'use client'

import { useState } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'tr'
type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function PrivacyChoicesPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [type, setType] = useState<'delete' | 'access' | 'correct'>('delete')
  const [email, setEmail] = useState('')
  const [detail, setDetail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')

  const t = copy[lang]

  async function submit() {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/privacy-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, email, detail, lang }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-black/60">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">
            Anon<span className="text-primary">Walks</span>
          </Link>
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
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24 space-y-12">

        {/* Header */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
            {t.badge}
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-3">{t.title}</h1>
          <p className="text-white/50 text-base leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <p className="text-white/70 text-sm font-medium">{t.chooseType}</p>
          {t.types.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                type === opt.value
                  ? 'border-primary/50 bg-primary/8'
                  : 'border-white/8 bg-[#111] hover:border-white/15'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={opt.value}
                checked={type === opt.value}
                onChange={() => setType(opt.value as typeof type)}
                className="mt-1 accent-primary flex-shrink-0"
              />
              <div>
                <p className="text-white font-medium text-sm">{opt.label}</p>
                <p className="text-white/45 text-xs leading-relaxed mt-0.5">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Form */}
        {status === 'success' ? (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-success/10 border border-success/25 text-success font-medium">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t.successMsg}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2">{t.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2">{t.detailLabel}</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder={t.detailPlaceholder}
                rows={3}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-primary/60 transition-colors resize-none"
              />
            </div>
            <button
              onClick={submit}
              disabled={!email || status === 'loading'}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-accent disabled:opacity-40 text-white font-semibold text-sm transition-colors duration-200"
            >
              {status === 'loading' ? '...' : t.submitBtn}
            </button>
            {status === 'error' && (
              <p className="text-destructive text-sm text-center">{t.errorMsg}</p>
            )}
            <p className="text-white/30 text-xs text-center leading-relaxed">{t.note}</p>
          </div>
        )}

        {/* Links */}
        <div className="pt-4 border-t border-white/8 flex flex-wrap gap-6 text-sm text-white/40">
          <Link href="/privacy" className="hover:text-white/70 transition-colors">{t.privacyLink}</Link>
          <Link href="/support" className="hover:text-white/70 transition-colors">{t.supportLink}</Link>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="font-bold text-base text-white">blip<span className="text-primary">.</span></span>
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} blip.</p>
        </div>
      </footer>
    </div>
  )
}

const copy = {
  en: {
    badge: 'Your Privacy',
    title: 'Privacy Choices',
    subtitle: 'Submit a request regarding your data. We will respond within 7 business days.',
    chooseType: 'What would you like to do?',
    types: [
      {
        value: 'delete',
        label: 'Delete my data',
        description: 'Remove all data associated with your device from our servers.',
      },
      {
        value: 'access',
        label: 'Access my data',
        description: 'Get a summary of the data we hold that is linked to your device.',
      },
      {
        value: 'correct',
        label: 'Correct my data',
        description: 'Request a correction if you believe any data we hold is inaccurate.',
      },
    ],
    emailLabel: 'Your email address',
    emailPlaceholder: 'you@example.com',
    detailLabel: 'Additional details (optional)',
    detailPlaceholder: 'Describe your request…',
    submitBtn: 'Submit Request',
    successMsg: 'Request received. We\'ll get back to you within 7 business days.',
    errorMsg: 'Something went wrong. Please try again or email us directly.',
    note: 'Since blip requires no account, we use your email only to respond to this request. It will not be stored beyond that.',
    privacyLink: 'Privacy Policy',
    supportLink: 'Support',
  },
  tr: {
    badge: 'Gizliliğin',
    title: 'Gizlilik Seçimleri',
    subtitle: 'Verilerinle ilgili bir talepte bulun. 7 iş günü içinde yanıtlayacağız.',
    chooseType: 'Ne yapmak istersin?',
    types: [
      {
        value: 'delete',
        label: 'Verilerimi sil',
        description: 'Cihazınla ilişkili tüm verileri sunucularımızdan kaldır.',
      },
      {
        value: 'access',
        label: 'Verilerime eriş',
        description: 'Cihazınla bağlantılı tuttuğumuz verilerin özetini al.',
      },
      {
        value: 'correct',
        label: 'Verilerimi düzelt',
        description: 'Tuttuğumuz verinin hatalı olduğunu düşünüyorsan düzeltme talep et.',
      },
    ],
    emailLabel: 'E-posta adresin',
    emailPlaceholder: 'sen@example.com',
    detailLabel: 'Ek açıklama (isteğe bağlı)',
    detailPlaceholder: 'Talebini açıkla…',
    submitBtn: 'Talebi Gönder',
    successMsg: 'Talebini aldık. 7 iş günü içinde sana döneceğiz.',
    errorMsg: 'Bir şeyler ters gitti. Tekrar dene veya doğrudan e-posta gönder.',
    note: 'blip hesap gerektirmediğinden e-postanı yalnızca bu talebe yanıt vermek için kullanıyoruz. Bunun ötesinde saklanmaz.',
    privacyLink: 'Gizlilik Politikası',
    supportLink: 'Destek',
  },
}
