import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.NOTIFY_EMAIL ?? 'ekremozkaraca@gmail.com'

  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AnonWalks Waitlist <onboarding@resend.dev>',
          to: notifyEmail,
          subject: `New waitlist signup: ${email}`,
          text: `Someone joined the waitlist: ${email}`,
        }),
      })
    } catch {
      // Don't fail the request if email sending fails
    }
  }

  return NextResponse.json({ success: true })
}
