import { useEffect, useRef, useState } from 'react'
import { client } from '../sanity/client'
import { SITE_SETTINGS_QUERY } from '../sanity/queries'

const FALLBACK_HOURS = [
  { day: 'Monday – Thursday', time: '6:30am – 9:30pm' },
  { day: 'Friday', time: '6:30am – 8:00pm' },
  { day: 'Saturday – Sunday', time: '9:00am – 6:30pm' },
]

function InfoItem({ icon, label, value, href }) {
  return (
    <a
      href={href || '#'}
      target={href && href.startsWith('http') ? '_blank' : '_self'}
      rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'flex-start', gap: 16, textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-sm)',
        background: 'rgba(227,30,36,0.12)', border: '1px solid rgba(227,30,36,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--red)',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--white)', lineHeight: 1.4 }}>{value}</div>
      </div>
    </a>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', interest: '' })
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    client.fetch(SITE_SETTINGS_QUERY).then(setSettings)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    items.forEach(item => obs.observe(item))
    return () => obs.disconnect()
  }, [])

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const phone = settings?.phone || '01481 726684'
  const email = settings?.email || 'info@thetrainstation.co.gg'
  const addr = settings?.address
  const addressText = addr
    ? <>{addr.line1}<br />{addr.line2}<br />{addr.city}, {addr.postcode}</>
    : <>The Guernsey Tennis Club<br />Longcamps, St. Sampsons<br />Guernsey, GY2 4UQ</>
  const hours = settings?.openingHours?.length ? settings.openingHours : FALLBACK_HOURS
  const facebook = settings?.socialFacebook || 'https://www.facebook.com/TrainStationFitnessGuernsey/'
  const instagram = settings?.socialInstagram || 'https://www.instagram.com/trainstationgsy/'

  return (
    <section id="contact" ref={ref} className="section section--dark">
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="section-eyebrow">Get In Touch</span>
          <h2 style={{ color: 'var(--white)' }}>Start Your Journey<br />Today</h2>
          <div className="red-line red-line--center" />
          <p className="section-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
            Ready to train? Book a free trial, enquire about memberships, or just say hello. We'd love to hear from you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
          {/* Left: contact info */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <InfoItem icon={<PhoneIcon />} label="Phone" value={phone} href={`tel:${phone.replace(/\s/g, '')}`} />
            <InfoItem icon={<EmailIcon />} label="Email" value={email} href={`mailto:${email}`} />
            <InfoItem
              icon={<LocationIcon />}
              label="Address"
              value={addressText}
              href="https://maps.google.com/?q=The+Guernsey+Tennis+Club+Longcamps+St+Sampsons+Guernsey+GY2+4UQ"
            />
            <InfoItem
              icon={<ClockIcon />}
              label="Opening Hours"
              value={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {hours.map((h, i) => (
                    <div key={h._key || i} style={{ display: 'flex', gap: 8, fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--muted-light)' }}>{h.day}:</span>
                      <span style={{ color: 'var(--white)', fontWeight: 500 }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              }
            />
            <InfoItem icon={<GlobeIcon />} label="Website" value="www.thetrainstation.co.gg" href="https://www.thetrainstation.co.gg" />

            <div style={{ paddingTop: 16, borderTop: '1px solid var(--dark-border)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Follow Us</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 'var(--radius-sm)', background: '#1877F2', color: 'white', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <FacebookIcon /> Facebook
                </a>
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <InstagramIcon /> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="reveal reveal-delay-2">
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 4vw, 48px)' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                  <h3 style={{ color: 'var(--white)', marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ color: 'var(--muted-light)' }}>Thanks for reaching out. We'll get back to you shortly to arrange your first session.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--white)', marginBottom: 8 }}>Book a Free Trial</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FormField label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Smith" required />
                    <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                  </div>

                  <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="07700 000000" />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>I'm interested in</label>
                    <select name="interest" value={form.interest} onChange={handleChange}
                      style={{ background: 'var(--dark-mid)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', color: form.interest ? 'var(--white)' : 'var(--muted)', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    >
                      <option value="">Select an option…</option>
                      <option value="free-trial">Free Trial</option>
                      <option value="standard">Standard Membership (£44.50/mo standing order)</option>
                      <option value="student-senior">Student / Senior Membership (£35/mo)</option>
                      <option value="couples">Couples Membership (£85/mo)</option>
                      <option value="day-pass">Day Pass (£8/session)</option>
                      <option value="personal-training">Personal Training</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>

                  <FormField label="Message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your goals…" textarea />

                  {submitError && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--red)', textAlign: 'center', margin: 0 }}>
                      {submitError}
                    </p>
                  )}

                  <button type="submit" className="btn btn-red" disabled={submitting} style={{ justifyContent: 'center', marginTop: 8, fontSize: '0.95rem', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'default' : 'pointer' }}>
                    {submitting ? 'Sending…' : 'Send Message →'}
                  </button>

                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center' }}>
                    Or call us directly: <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--red)', fontWeight: 600 }}>{phone}</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps embed */}
        <div style={{ marginTop: 64 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--white)', marginBottom: 20, textAlign: 'center', letterSpacing: '0.04em' }}>WHERE TO FIND US</h3>
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--dark-border)', lineHeight: 0 }}>
            <iframe
              title="TrainStation Guernsey location"
              src="https://maps.google.com/maps?q=The+Train+Station+La+Route+des+Longs+Camps+GY2+4UQ+Guernsey&output=embed&z=15"
              width="100%"
              height="380"
              style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)', display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.85rem', color: 'var(--muted)' }}>
            La Route des Longs Camps, GY2 4UQ ·{' '}
            <a href="https://maps.google.com/maps?q=The+Train+Station+La+Route+des+Longs+Camps+GY2+4UQ+Guernsey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', fontWeight: 600 }}>
              Open in Google Maps →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function FormField({ label, name, type = 'text', value, onChange, placeholder, required, textarea }) {
  const inputStyle = {
    background: 'var(--dark-mid)', border: '1px solid var(--dark-border)',
    borderRadius: 'var(--radius-sm)', padding: '12px 14px',
    color: 'var(--white)', fontSize: '0.95rem', outline: 'none', width: '100%',
    fontFamily: 'var(--font-body)', resize: textarea ? 'vertical' : 'none',
    transition: 'border-color 0.2s',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4} style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--red)'}
          onBlur={e => e.target.style.borderColor = 'var(--dark-border)'}
        />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--red)'}
          onBlur={e => e.target.style.borderColor = 'var(--dark-border)'}
        />
      )}
    </div>
  )
}

function EmailIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function PhoneIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h4l2 4-2 2a12 12 0 0 0 4 4l2-2 4 2v4a2 2 0 0 1-2 2A16 16 0 0 1 1 5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> }
function LocationIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2a7 7 0 0 1 7 7c0 5-7 11-7 11S3 14 3 9a7 7 0 0 1 7-7z" stroke="currentColor" strokeWidth="1.5"/></svg> }
function ClockIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function GlobeIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M2 10h16M10 2c-2 3-2 5 0 16M10 2c2 3 2 5 0 16" stroke="currentColor" strokeWidth="1.5"/></svg> }
function FacebookIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.4 18.627 0 12 0S0 5.4 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg> }
function InstagramIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> }
