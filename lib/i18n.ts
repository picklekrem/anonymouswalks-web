export const translations = {
  en: {
    nav: { cta: 'Download' },
    hero: {
      badge: 'Now Available on App Store',
      title: 'Walk Together,',
      titleAccent: 'Anonymously.',
      subtitle:
        'Connect with strangers through voice. No faces, no profiles — just honest conversations.',
      appStore: 'Download on the App Store',
    },
    features: {
      title: 'Why Anonymous Walks?',
      items: [
        {
          icon: '🎭',
          title: 'Truly Anonymous',
          description:
            'No usernames, no photos, no profiles. Your identity stays hidden — always.',
        },
        {
          icon: '🎧',
          title: 'Voice Only',
          description:
            'Real conversations over voice. No text, no distractions, no filters.',
        },
        {
          icon: '🛡️',
          title: 'Your Safe Space',
          description:
            'Block, report, and stay in full control. We take safety seriously.',
        },
      ],
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        { step: '01', title: 'Choose Your Role', description: 'Want to talk or listen? You decide.' },
        { step: '02', title: 'Get Matched', description: 'We find someone compatible, anonymously.' },
        { step: '03', title: 'Start Walking', description: 'Have an honest, real conversation.' },
      ],
    },
    download: {
      title: 'Ready to start your first walk?',
      subtitle:
        'Download now and have your first honest, anonymous voice conversation tonight.',
      appStore: 'Download on the App Store',
      newsletterLabel: 'Or stay updated — we ship often.',
      placeholder: 'your@email.com',
      cta: 'Subscribe',
      success: "You're subscribed! We'll keep you in the loop.",
      error: 'Something went wrong. Try again.',
    },
    footer: {
      tagline: 'Anonymous voice connections.',
      rights: 'All rights reserved.',
    },
  },
  tr: {
    nav: { cta: 'İndir' },
    hero: {
      badge: "App Store'da Şimdi Mevcut",
      title: 'Birlikte Yürü,',
      titleAccent: 'Anonim Olarak.',
      subtitle:
        'Sesle yabancılarla bağlan. Yüzler yok, profiller yok — sadece dürüst sohbetler.',
      appStore: "App Store'dan İndir",
    },
    features: {
      title: 'Neden Anonim Yürüyüşler?',
      items: [
        {
          icon: '🎭',
          title: 'Gerçekten Anonim',
          description:
            'Kullanıcı adı yok, fotoğraf yok, profil yok. Kimliğin her zaman gizli kalır.',
        },
        {
          icon: '🎧',
          title: 'Sadece Ses',
          description:
            'Sesle gerçek sohbetler. Metin yok, dikkat dağıtıcı yok, filtre yok.',
        },
        {
          icon: '🛡️',
          title: 'Güvenli Alanın',
          description:
            'Engelle, raporla ve her zaman tam kontrol sende. Güvenliği ciddiye alıyoruz.',
        },
      ],
    },
    howItWorks: {
      title: 'Nasıl Çalışır?',
      steps: [
        { step: '01', title: 'Rolünü Seç', description: 'Konuşmak mı dinlemek mi? Sen karar ver.' },
        { step: '02', title: 'Eşleştirilirsin', description: 'Uyumlu birini anonim olarak buluriz.' },
        { step: '03', title: 'Yürüyüşe Başla', description: 'Dürüst, gerçek bir sohbet başlat.' },
      ],
    },
    download: {
      title: 'İlk yürüyüşüne hazır mısın?',
      subtitle:
        'Şimdi indir ve bu gece ilk dürüst, anonim sesli sohbetine başla.',
      appStore: "App Store'dan İndir",
      newsletterLabel: 'Veya güncel kal — sık sık yenilik çıkarıyoruz.',
      placeholder: 'eposta@adresin.com',
      cta: 'Abone Ol',
      success: 'Abone oldun! Gelişmelerden haberdar edeceğiz.',
      error: 'Bir şeyler ters gitti. Tekrar dene.',
    },
    footer: {
      tagline: 'Anonim sesli bağlantılar.',
      rights: 'Tüm hakları saklıdır.',
    },
  },
} as const

export type Lang = keyof typeof translations
export type T = typeof translations.en
