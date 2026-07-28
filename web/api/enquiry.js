import { createClient } from '@sanity/client'

const sanityWriteClient = createClient({
  projectId: 'weak5669',
  dataset: 'production',
  apiVersion: '2026-03-28',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'info@thetrainstation.co.gg'
const FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL || 'TrainStation Website <onboarding@resend.dev>'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, interest, message } = req.body || {}
  const name = (req.body?.name || '').replace(/[\r\n]+/g, ' ').trim()
  const email = (req.body?.email || '').replace(/[\r\n]+/g, ' ').trim()

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' })
  }

  const submittedAt = new Date().toISOString()
  let savedToSanity = false
  let emailSent = false

  if (process.env.SANITY_API_WRITE_TOKEN) {
    try {
      await sanityWriteClient.create({
        _type: 'enquiry',
        name,
        email,
        phone: phone || '',
        interest: interest || 'general',
        message: message || '',
        status: 'new',
        submittedAt,
      })
      savedToSanity = true
    } catch (err) {
      console.error('Failed to save enquiry to Sanity:', err)
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const interestLabel = interest === 'free-trial' ? 'Free Trial' : interest || 'Enquiry'
      const notifyFromName = FROM_EMAIL.replace(/^([^<]+)</, `${name} via $1<`)

      await resend.emails.send({
        from: notifyFromName,
        to: NOTIFY_EMAIL,
        replyTo: email,
        subject: `New ${interestLabel} enquiry — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\nInterested in: ${interest || '—'}\n\nMessage:\n${message || '—'}`,
      })

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Thanks for reaching out — TrainStation Guernsey',
        text: `Hi ${name},\n\nThanks for getting in touch with TrainStation Guernsey${interest === 'free-trial' ? ' about your free trial' : ''}. We've received your details and someone from the team will be in touch shortly.\n\nIf it's urgent, give us a call on 01481 726684.\n\nSee you soon,\nThe TrainStation Team`,
      })

      emailSent = true
    } catch (err) {
      console.error('Failed to send enquiry email:', err)
    }
  }

  if (!savedToSanity && !emailSent) {
    return res.status(500).json({ error: 'Unable to deliver your enquiry right now. Please call or email us directly.' })
  }

  return res.status(200).json({ ok: true, savedToSanity, emailSent })
}
