import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anonymous Walks & Talks — Voice connections without identity',
  description:
    'Connect with strangers through voice. No faces, no profiles — just honest conversations. Coming to App Store.',
  openGraph: {
    title: 'Anonymous Walks & Talks',
    description: 'Voice connections without identity.',
    url: 'https://anonwalksandtalks.com',
    siteName: 'Anonymous Walks & Talks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anonymous Walks & Talks',
    description: 'Voice connections without identity.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  )
}
