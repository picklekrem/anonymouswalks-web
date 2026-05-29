'use client'

import { useState } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'tr'

const content = {
  en: {
    nav: { home: 'Home', cta: 'Download' },
    hero: {
      badge: 'Help & Support',
      title: 'How can we',
      titleAccent: 'help you?',
      subtitle: "Find answers to common questions or reach out — we'll get back to you as soon as possible.",
    },
    contact: {
      title: 'Contact Us',
      description: 'For any issue not covered below, send us an email and we\'ll respond within 24 hours.',
      email: 'support@anonwalksandtalks.com',
      label: 'Email Support',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'Is AnonTalks really anonymous?',
          a: 'Yes. We never collect your name, phone number, or any identifying information. No account is required. Your voice conversations are not recorded or stored.',
        },
        {
          q: 'How do I report someone during a call?',
          a: 'Tap the flag icon on the in-call screen at any time. After the call, you can also rate and leave feedback. Every report is reviewed by our team.',
        },
        {
          q: 'How do I block a user?',
          a: 'During a call, tap the shield icon to block the other person immediately. Blocked users will never be matched with you again. You can view and manage your block list in Settings → Blocked Users.',
        },
        {
          q: 'When does matching open?',
          a: 'Matching is available daily from 19:00 to 00:00 (UTC+3). Outside these hours the app will show you a countdown until the next session.',
        },
        {
          q: 'What is a Trust Score?',
          a: 'Your Trust Score reflects the quality of your interactions based on feedback from your match partners. Low scores from repeated negative feedback can result in a permanent ban.',
        },
        {
          q: 'Why was I banned?',
          a: 'Bans are issued automatically when your Trust Score falls below our safety threshold due to reports or negative feedback. If you believe this was a mistake, contact us at the email above.',
        },
        {
          q: 'The app is not working — what should I do?',
          a: 'First, make sure you have granted microphone permission in iOS Settings → Privacy → Microphone. If the issue persists, force-quit the app and reopen it, or contact us with a description of the problem.',
        },
      ],
    },
    deletion: {
      title: 'Account & Data Deletion',
      description:
        'Since AnonTalks requires no account, there is no persistent personal data tied to you. If you wish to remove any data associated with your device (such as Trust Score or block list), email us at the address above and we will erase it within 7 business days.',
      steps: [
        'Email us at support@anonwalksandtalks.com',
        'Use the subject line: "Data Deletion Request"',
        'Include a brief description of what you'd like removed',
        'We'll confirm deletion within 7 business days',
      ],
    },
    footer: {
      tagline: 'Voice connections without identity.',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
    },
  },
  tr: {
    nav: { home: 'Ana Sayfa', cta: 'İndir' },
    hero: {
      badge: 'Yardım & Destek',
      title: 'Sana nasıl',
      titleAccent: 'yardımcı olabiliriz?',
      subtitle: 'Sık sorulan sorulara göz at ya da bize ulaş — en kısa sürede geri döneceğiz.',
    },
    contact: {
      title: 'Bize Ulaş',
      description: 'Aşağıda yanıtlanmayan her konuda bize e-posta gönder, 24 saat içinde yanıtlayacağız.',
      email: 'support@anonwalksandtalks.com',
      label: 'E-posta ile Destek',
    },
    faq: {
      title: 'Sık Sorulan Sorular',
      items: [
        {
          q: 'AnonTalks gerçekten anonim mi?',
          a: 'Evet. İsmin, telefon numaran veya seni tanımlayan hiçbir bilgini toplamıyoruz. Hesap gerekmez. Sesli görüşmeler kaydedilmez veya saklanmaz.',
        },
        {
          q: 'Görüşme sırasında birini nasıl şikayet ederim?',
          a: 'Görüşme ekranındaki bayrak ikonuna istediğin zaman dokun. Görüşme sonrasında da puanlama ve geri bildirim bırakabilirsin. Her şikayet ekibimiz tarafından incelenir.',
        },
        {
          q: 'Birini nasıl engellerim?',
          a: 'Görüşme sırasında kalkan ikonuna dokunarak karşındaki kişiyi anında engelleyebilirsin. Engellenen kullanıcılar bir daha seninle eşleştirilmez. Engel listeni Ayarlar → Engellenen Kullanıcılar bölümünden yönetebilirsin.',
        },
        {
          q: 'Eşleşme ne zaman açılıyor?',
          a: 'Eşleşme her gün 19:00-00:00 saatleri arasında (UTC+3) aktiftir. Bu saatler dışında uygulama bir sonraki oturum için geri sayım gösterir.',
        },
        {
          q: 'Güven Puanı nedir?',
          a: 'Güven Puanın, eşleşme partnerlerinden aldığın geri bildirimlere göre etkileşimlerinin kalitesini yansıtır. Tekrarlayan olumsuz geri bildirimler sonucunda düşen puanlar kalıcı yasağa yol açabilir.',
        },
        {
          q: 'Neden yasaklandım?',
          a: 'Yasaklar, şikayetler veya olumsuz geri bildirimler nedeniyle Güven Puanın güvenlik eşiğimizin altına düştüğünde otomatik olarak uygulanır. Bunun hatalı olduğunu düşünüyorsan yukarıdaki e-posta adresinden bize ulaş.',
        },
        {
          q: 'Uygulama çalışmıyor, ne yapmalıyım?',
          a: 'Önce iOS Ayarlar → Gizlilik → Mikrofon bölümünden mikrofon iznini verdiğinden emin ol. Sorun devam ederse uygulamayı zorla kapat ve yeniden aç ya da sorunu açıklayarak bizimle iletişime geç.',
        },
      ],
    },
    deletion: {
      title: 'Hesap ve Veri Silme',
      description:
        'AnonTalks hesap gerektirmediğinden sana bağlı kalıcı kişisel veri bulunmaz. Cihazınla ilişkilendirilmiş verilerin (Güven Puanı, engel listesi gibi) silinmesini istiyorsan yukarıdaki adrese e-posta gönder; 7 iş günü içinde sileceğiz.',
      steps: [
        'support@anonwalksandtalks.com adresine e-posta gönder',
        'Konu satırına "Veri Silme Talebi" yaz',
        'Silinmesini istediğin verileri kısaca açıkla',
        '7 iş günü içinde silme işlemini onaylayacağız',
      ],
    },
    footer: {
      tagline: 'Kimliksiz sesli bağlantı.',
      rights: 'Tüm hakları saklıdır.',
      privacy: 'Gizlilik Politikası',
    },
  },
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-white/40 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/3 transition-colors duration-150"
      >
        <span className="text-white/90 font-medium text-sm leading-relaxed">{q}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-white/50 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function SupportPage() {
  const [lang, setLang] = useState<Lang>('en')
  const t = content[lang]

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-black/60">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">
            Anon<span className="text-primary">Walks</span>
          </Link>
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
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-20">

        {/* Hero */}
        <section className="text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase">
            {t.hero.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {t.hero.title}{' '}
            <span className="text-primary">{t.hero.titleAccent}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </section>

        {/* Contact */}
        <section className="bg-[#111] border border-white/8 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg mb-1">{t.contact.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-3">{t.contact.description}</p>
            <a
              href={`mailto:${t.contact.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-accent transition-colors duration-200 text-white text-sm font-semibold"
            >
              {t.contact.label}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{t.faq.title}</h2>
          <div className="space-y-2">
            {t.faq.items.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

        {/* Data Deletion */}
        <section className="bg-[#111] border border-white/8 rounded-3xl p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">{t.deletion.title}</h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">{t.deletion.description}</p>
          <ol className="space-y-2">
            {t.deletion.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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

    </div>
  )
}
