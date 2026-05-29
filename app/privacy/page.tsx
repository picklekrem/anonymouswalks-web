'use client'

import { useState } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'tr'

const LAST_UPDATED = 'May 29, 2026'
const LAST_UPDATED_TR = '29 Mayıs 2026'

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>('en')

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

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
            {lang === 'en' ? 'Legal' : 'Hukuki'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {lang === 'en' ? 'Privacy Policy' : 'Gizlilik Politikası'}
          </h1>
          <p className="text-white/40 text-sm">
            {lang === 'en' ? `Last updated: ${LAST_UPDATED}` : `Son güncelleme: ${LAST_UPDATED_TR}`}
          </p>
        </div>

        {lang === 'en' ? <EnglishPolicy /> : <TurkishPolicy />}

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-white/8 flex flex-wrap gap-6 text-sm text-white/40">
          <Link href="/support" className="hover:text-white/70 transition-colors">Support</Link>
          <Link href="/privacy/choices" className="hover:text-white/70 transition-colors">Privacy Choices</Link>
          <a href="mailto:support@anonwalksandtalks.com" className="hover:text-white/70 transition-colors">support@anonwalksandtalks.com</a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-base text-white">Anon<span className="text-primary">Walks</span></span>
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} AnonWalks. {lang === 'en' ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}</p>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="text-white/55 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

function EnglishPolicy() {
  return (
    <div>
      <Section title="1. Overview">
        <p>
          AnonTalks ("we", "our", "the app") is designed from the ground up to protect your privacy.
          No account is required. We do not collect your name, email address, phone number, or any
          other personally identifiable information.
        </p>
        <p>
          This Privacy Policy explains what limited data we do collect, why we collect it, and how
          you can request its deletion.
        </p>
      </Section>

      <Section title="2. Data We Collect">
        <p>We collect only the minimum data necessary to operate the service safely:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white/80">Device Identifier</strong> — A random, anonymous ID
            generated on your device. It is not linked to your Apple ID, name, or any personal
            information.
          </li>
          <li>
            <strong className="text-white/80">Trust Score</strong> — A numerical score derived from
            anonymised feedback submitted by your match partners. Used solely to maintain community
            safety.
          </li>
          <li>
            <strong className="text-white/80">Block List</strong> — The list of anonymous device IDs
            you have chosen to block. Stored to prevent future matches with those IDs.
          </li>
          <li>
            <strong className="text-white/80">Reports</strong> — If you submit a report against
            another user, we store the anonymous device IDs of both parties and the reason for
            review purposes.
          </li>
        </ul>
      </Section>

      <Section title="3. Data We Do NOT Collect">
        <ul className="list-disc pl-5 space-y-2">
          <li>Your name, email, or phone number</li>
          <li>Your location or IP address (beyond what is technically required for WebRTC peer connection)</li>
          <li>Voice recordings — calls are never recorded or stored</li>
          <li>Any biometric data</li>
          <li>Any data from your contacts, camera, or photo library</li>
        </ul>
      </Section>

      <Section title="4. How We Use Your Data">
        <p>The data we collect is used exclusively for:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Matching you with compatible partners</li>
          <li>Enforcing safety policies (Trust Score thresholds, bans)</li>
          <li>Reviewing reports of misconduct</li>
          <li>Preventing blocked users from being re-matched</li>
        </ul>
        <p>We do not use your data for advertising, profiling, or any commercial purpose.</p>
      </Section>

      <Section title="5. Data Sharing">
        <p>
          We do not sell, rent, or share your data with third parties for commercial purposes.
          Data may be disclosed only if required by law or to protect the safety of our users.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          Device identifiers and associated data (Trust Score, block list) are retained as long as
          the app is in use. If you request deletion, we will erase all data associated with your
          device identifier within 7 business days.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Request access to the data associated with your device</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of all your data</li>
        </ul>
        <p>
          To exercise these rights, visit our{' '}
          <Link href="/privacy/choices" className="text-primary hover:underline">Privacy Choices</Link>{' '}
          page or email{' '}
          <a href="mailto:support@anonwalksandtalks.com" className="text-primary hover:underline">
            support@anonwalksandtalks.com
          </a>.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          AnonTalks is not intended for users under the age of 17. We do not knowingly collect data
          from children. If you believe a child has used the app, please contact us immediately.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this policy from time to time. When we do, we will update the "Last updated"
          date at the top. Continued use of the app after changes constitutes acceptance of the
          updated policy.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          For any privacy-related questions or requests, contact us at:{' '}
          <a href="mailto:support@anonwalksandtalks.com" className="text-primary hover:underline">
            support@anonwalksandtalks.com
          </a>
        </p>
      </Section>
    </div>
  )
}

function TurkishPolicy() {
  return (
    <div>
      <Section title="1. Genel Bakış">
        <p>
          AnonTalks ("biz", "uygulama"), gizliliğini korumak amacıyla sıfırdan tasarlanmıştır.
          Hesap gerekmez. Adın, e-posta adresin, telefon numaran veya seni tanımlayan herhangi
          bir bilgi toplanmaz.
        </p>
        <p>
          Bu Gizlilik Politikası, hangi sınırlı verileri topladığımızı, neden topladığımızı ve
          nasıl silinmesini talep edebileceğini açıklar.
        </p>
      </Section>

      <Section title="2. Topladığımız Veriler">
        <p>Yalnızca hizmeti güvenli şekilde sunmak için gereken asgari verileri toplarız:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white/80">Cihaz Tanımlayıcısı</strong> — Cihazında oluşturulan
            rastgele, anonim bir kimlik. Apple Kimliğin, adın veya herhangi bir kişisel bilginle
            ilişkilendirilmez.
          </li>
          <li>
            <strong className="text-white/80">Güven Puanı</strong> — Eşleşme partnerlerinin
            anonimleştirilmiş geri bildirimlerinden türetilen sayısal bir puan. Yalnızca topluluk
            güvenliğini sağlamak için kullanılır.
          </li>
          <li>
            <strong className="text-white/80">Engel Listesi</strong> — Engellemeyi seçtiğin anonim
            cihaz kimliklerinin listesi. Bu kimliklerle tekrar eşleşmeni önlemek amacıyla saklanır.
          </li>
          <li>
            <strong className="text-white/80">Şikayetler</strong> — Bir şikayet iletirsen, inceleme
            amacıyla her iki tarafın anonim cihaz kimlikleri ve şikayet nedeni saklanır.
          </li>
        </ul>
      </Section>

      <Section title="3. Toplamadığımız Veriler">
        <ul className="list-disc pl-5 space-y-2">
          <li>Adın, e-posta adresin veya telefon numaran</li>
          <li>Konumun veya IP adresin (WebRTC bağlantısı için teknik zorunluluklar dışında)</li>
          <li>Ses kayıtları — görüşmeler asla kaydedilmez veya saklanmaz</li>
          <li>Herhangi bir biyometrik veri</li>
          <li>Kişi listesi, kamera veya fotoğraf kitaplığından herhangi bir veri</li>
        </ul>
      </Section>

      <Section title="4. Verilerini Nasıl Kullanıyoruz">
        <p>Topladığımız veriler yalnızca şunlar için kullanılır:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Seni uyumlu partnerlerle eşleştirmek</li>
          <li>Güvenlik politikalarını uygulamak (Güven Puanı eşikleri, yasaklar)</li>
          <li>Kötüye kullanım şikayetlerini incelemek</li>
          <li>Engellenen kullanıcıların tekrar eşleştirilmesini önlemek</li>
        </ul>
        <p>Verilerini reklam, profilleme veya herhangi bir ticari amaçla kullanmıyoruz.</p>
      </Section>

      <Section title="5. Veri Paylaşımı">
        <p>
          Verilerini ticari amaçlarla üçüncü taraflara satmıyor, kiralamıyor veya paylaşmıyoruz.
          Veriler yalnızca yasaların gerektirdiği durumlarda veya kullanıcılarımızın güvenliğini
          korumak amacıyla açıklanabilir.
        </p>
      </Section>

      <Section title="6. Veri Saklama">
        <p>
          Cihaz tanımlayıcıları ve ilişkili veriler (Güven Puanı, engel listesi), uygulama
          kullanımda olduğu sürece saklanır. Silme talebinde bulunursan, cihaz tanımlayıcınla
          ilişkili tüm veriler 7 iş günü içinde silinir.
        </p>
      </Section>

      <Section title="7. Hakların">
        <p>Şu haklara sahipsin:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cihazınla ilişkili verilere erişim talep etme</li>
          <li>Hatalı verilerin düzeltilmesini talep etme</li>
          <li>Tüm verilerinin silinmesini talep etme</li>
        </ul>
        <p>
          Bu hakları kullanmak için{' '}
          <Link href="/privacy/choices" className="text-primary hover:underline">Gizlilik Seçimleri</Link>{' '}
          sayfamızı ziyaret et veya{' '}
          <a href="mailto:support@anonwalksandtalks.com" className="text-primary hover:underline">
            support@anonwalksandtalks.com
          </a>{' '}
          adresine e-posta gönder.
        </p>
      </Section>

      <Section title="8. Çocukların Gizliliği">
        <p>
          AnonTalks, 17 yaşın altındaki kullanıcılara yönelik değildir. Çocuklardan bilerek veri
          toplamıyoruz. Bir çocuğun uygulamayı kullandığını düşünüyorsan lütfen hemen bizimle
          iletişime geç.
        </p>
      </Section>

      <Section title="9. Politika Değişiklikleri">
        <p>
          Bu politikayı zaman zaman güncelleyebiliriz. Güncellendiğinde en üstteki "Son güncelleme"
          tarihini değiştiririz. Değişikliklerin ardından uygulamayı kullanmaya devam etmen, güncel
          politikayı kabul ettiğin anlamına gelir.
        </p>
      </Section>

      <Section title="10. İletişim">
        <p>
          Gizlilikle ilgili soru veya talepler için:{' '}
          <a href="mailto:support@anonwalksandtalks.com" className="text-primary hover:underline">
            support@anonwalksandtalks.com
          </a>
        </p>
      </Section>
    </div>
  )
}
