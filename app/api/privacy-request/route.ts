import { NextRequest, NextResponse } from 'next/server'

const typeLabels: Record<string, string> = {
  delete: 'Data Deletion Request',
  access: 'Data Access Request',
  correct: 'Data Correction Request',
}

export async function POST(req: NextRequest) {
  const { type, email, detail, lang } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  if (!['delete', 'access', 'correct'].includes(type)) {
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.NOTIFY_EMAIL ?? 'ekremozkaraca@gmail.com'
  const subject = `[Privacy] ${typeLabels[type] ?? type} from ${email}`

  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AnonWalks Privacy <onboarding@resend.dev>',
          to: notifyEmail,
          subject,
          text: [
            `Type: ${typeLabels[type]}`,
            `From: ${email}`,
            `Language: ${lang ?? 'en'}`,
            `Details: ${detail || '—'}`,
          ].join('\n'),
        }),
      })
    } catch {
      // Don't fail the request if email sending fails
    }
  }

  return NextResponse.json({ success: true })
}
