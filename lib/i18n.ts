export const translations = {
  en: {
    nav: {
      cta: 'Download',
    },
    sections: {
      hero: {
        badge: 'Anonymous · Voice Call · Real Persons',
        title: 'Talk,',
        subtitle: 'Anonymously.',
        description:
          'Connect with strangers through voice. No faces, no profiles — just honest conversations that matter.',
        stats: ['Voice Only', '100% Anonymous', 'Free on iOS'],
        disclaimer: 'Not a dating app.',
        actions: {
          download: 'Download on App Store',
          waitlist: 'Join Waitlist',
        },
      },
      voice: {
        badge: 'Voice First',
        title: 'Heard, Not Seen',
        description:
          'In a world obsessed with appearances, AnonymousTalks strips it all away. Just your voice, just your words — pure human connection without judgment, without barriers, without pretense.',
      },
      features: {
        badge: 'Why AnonymousTalks',
        title: 'Built for',
        subtitle: 'Real Connection.',
        description:
          'Every detail of AnonymousTalks is designed to protect you and help you connect deeply — no noise, no performance.',
        items: [
          {
            title: 'Truly Anonymous',
            description:
              'No usernames, no photos, no profiles. Your identity stays hidden — ALWAYS.',
          },
          {
            title: 'Voice Only',
            description:
              'Real conversations over voice. No text, no distractions — just your voice and theirs.',
          },
          {
            title: 'Your Safe Space',
            description:
              'Block, report, and end any conversation instantly. Safety is non-negotiable.',
          },
        ],
      },
      download: {
        badge: 'Ready?',
        title: 'Start Your First Talk',
        subtitle: 'Tonight.',
        description:
          'Join thousands of people having honest, anonymous voice conversations every night. Free on iOS. No account required.',
        actions: {
          download: 'Download on App Store',
          stayUpdated: 'Stay Updated',
        },
      },
    },
    waitlist: {
      title: 'Stay Updated',
      description: "We ship often. Drop your email and we'll keep you in the loop.",
    },
    download: {
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
    nav: {
      cta: 'İndir',
    },
    sections: {
      hero: {
        badge: 'Anonim · Sesli Konuşma · Gerçek İnsanlar',
        title: 'Konuş,',
        subtitle: 'Anonim Olarak.',
        description:
        'Tanımadığın insanlarla konuş. Yüz yok, profil yok — sadece kibar, dürüst sohbetler.',
        stats: ['Sadece Ses', '%100 Anonim', "iOS'ta Ücretsiz"],
        disclaimer: 'Asla bir dating uygulaması değildir.',
        actions: {
          download: "App Store'dan İndir",
          waitlist: 'Bekleme Listesine Katıl',
        },
      },
      voice: {
        badge: 'Anonim.',
        title: 'Duyulan, Görülmeyen',
        description:
          'Görünüşlere takıntılı bir dünyada AnonymousTalks hepsinden kurtulmayı amaçlıyor. Sadece sesin, sadece sözlerin — yargısız, engelsiz, gösterişsiz saf insan bağlantısı.',
      },
      features: {
        badge: 'Neden AnonymousTalks',
        title: 'Şunun İçin Yapıldı:',
        subtitle: 'Gerçek Bağlantı.',
        description:
          "Özellikle hiç tanımadığımız bir insana tamamen filtresiz bir şekilde kendimizi açabiliyoruz. İşte bu uygulama tam da bunun için var. ",
        items: [
          {
            title: 'Tamamen Anonim',
            description:
              'Kullanıcı adı yok, fotoğraf yok, profil yok. Kimliğin her zaman gizli kalır.',
          },
          {
            title: 'Sadece Ses',
            description:
              'Profil yok, isim yok, sadece duyulmak isteyen iki ses.',
          },
          {
            title: 'Güvenli Alanın',
            description:
              'Engelle, raporla ve anlık olarak her konuşmayı sonlandır. Güvenlik pazarlık konusu değildir.',
          },
        ],
      },
      download: {
        badge: 'Hazır mısın?',
        title: 'Konuşma Zamanı',
        subtitle: 'Bu Gece.',
        description:
          "Her gece dürüst, anonim sesli sohbetler yapan binlerce kişiye katıl. iOS'ta ücretsiz. Hesap gerekmez.",
        actions: {
          download: "App Store'dan İndir",
          stayUpdated: 'Güncel Kal',
        },
      },
    },
    waitlist: {
      title: 'Güncel Kal',
      description: 'Sık sık yenilik çıkarıyoruz. E-postanı bırak, seni haberdar edelim.',
    },
    download: {
      placeholder: 'eposta@adresin.com',
      cta: 'Abone Ol',
      success: 'Abone oldun! Gelişmelerden haberdar edeceğiz.',
      error: 'Bir şeyler ters gitti. Tekrar dene.',
    },
    footer: {
      tagline: 'AnonymousTalks.',
      rights: 'Tüm hakları saklıdır.',
    },
  },
} as const

export type Lang = keyof typeof translations
export type T = typeof translations.en
