export const translations = {
  en: {
    nav: { cta: 'Join Waitlist' },
    hero: {
      badge: 'Coming to App Store',
      title: 'Walk Together,',
      titleAccent: 'Anonymously.',
      subtitle:
        'Connect with strangers through voice. No faces, no profiles — just honest conversations.',
      emailPlaceholder: 'your@email.com',
      emailCta: 'Notify Me',
      appStore: 'App Store — Coming Soon',
      disclaimer: 'No spam. Unsubscribe anytime.',
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
    waitlist: {
      title: 'Be the first to know.',
      subtitle:
        "We're launching soon. Join the waitlist and get notified the day we go live.",
      placeholder: 'your@email.com',
      cta: 'Join Waitlist',
      success: "You're on the list! We'll reach out soon. 🎉",
      error: 'Something went wrong. Try again.',
    },
    footer: {
      tagline: 'Anonymous voice connections.',
      rights: 'All rights reserved.',
    },
  },
  tr: {
    nav: { cta: 'Listeye Katıl' },
    hero: {
      badge: "App Store'a Geliyor",
      title: 'Birlikte Yürü,',
      titleAccent: 'Anonim Olarak.',
      subtitle:
        'Sesle yabancılarla bağlan. Yüzler yok, profiller yok — sadece dürüst sohbetler.',
      emailPlaceholder: 'eposta@adresin.com',
      emailCta: 'Haber Ver',
      appStore: "App Store — Çok Yakında",
      disclaimer: 'Spam yok. İstediğin zaman çık.',
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
    waitlist: {
      title: 'İlk sen haberdar ol.',
      subtitle:
        'Yakında yayına giriyoruz. Listeye katıl, canlıya geçtiğimiz gün seni haberdar edelim.',
      placeholder: 'eposta@adresin.com',
      cta: 'Listeye Katıl',
      success: 'Listedesin! Çok yakında haberdar edeceğiz. 🎉',
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
