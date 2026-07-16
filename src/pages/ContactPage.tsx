import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import LandingFooter from '../components/landing/LandingFooter'

// ─────────────────────────────────────────────────────────────────────────────
// 📊  GOOGLE SHEETS SETUP
// ─────────────────────────────────────────────────────────────────────────────
//
//  STEP 1 — Paste this entire script into Apps Script (Extensions → Apps Script)
//           Replace ALL existing code with this:
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  const NOTIFY_EMAIL = 'design2code93@gmail.com';                        │
// │                                                                         │
// │  // ── Run this ONCE manually to authorise Gmail + Sheets ─────────── │
// │  function testSetup() {                                                 │
// │    const sheet = SpreadsheetApp.getActiveSpreadsheet()                 │
// │                    .getActiveSheet();                                   │
// │    sheet.appendRow(['TEST','TEST','TEST','TEST','TEST']);               │
// │    MailApp.sendEmail({                                                  │
// │      to:      NOTIFY_EMAIL,                                             │
// │      subject: 'Portfolio contact form — authorised ✓',                 │
// │      body:    'Your Apps Script is connected and authorised.',          │
// │    });                                                                  │
// │    sheet.deleteRow(sheet.getLastRow()); // clean up test row            │
// │  }                                                                      │
// │                                                                         │
// │  // ── Handles form submissions from the portfolio ─────────────────── │
// │  function doPost(e) {                                                   │
// │    try {                                                                │
// │      // reads URLSearchParams body (name=…&email=…&phone=…&message=…) │
// │      const p     = e.parameter;                                        │
// │      const sheet = SpreadsheetApp.getActiveSpreadsheet()               │
// │                      .getActiveSheet();                                 │
// │                                                                         │
// │      if (sheet.getLastRow() === 0) {                                   │
// │        sheet.appendRow(                                                 │
// │          ['Timestamp','Name','Email','Phone','Message']                 │
// │        );                                                               │
// │        sheet.getRange(1,1,1,5).setFontWeight('bold');                  │
// │      }                                                                  │
// │                                                                         │
// │      sheet.appendRow([                                                  │
// │        new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),   │
// │        p.name    || '',                                                 │
// │        p.email   || '',                                                 │
// │        p.phone   || '',                                                 │
// │        p.message || '',                                                 │
// │      ]);                                                                │
// │                                                                         │
// │      MailApp.sendEmail({                                                │
// │        to:      NOTIFY_EMAIL,                                           │
// │        subject: 'New portfolio enquiry from ' + (p.name||'unknown'),   │
// │        body:    'Name: '    + p.name                + '\n'             │
// │               + 'Email: '   + p.email               + '\n'             │
// │               + 'Phone: '   + (p.phone||'N/A')      + '\n\n'          │
// │               + p.message,                                             │
// │      });                                                                │
// │                                                                         │
// │      return ContentService                                              │
// │        .createTextOutput(JSON.stringify({ success: true }))            │
// │        .setMimeType(ContentService.MimeType.JSON);                     │
// │    } catch(err) {                                                       │
// │      return ContentService                                              │
// │        .createTextOutput(JSON.stringify({ success:false,               │
// │           error: err.toString() }))                                     │
// │        .setMimeType(ContentService.MimeType.JSON);                     │
// │    }                                                                    │
// │  }                                                                      │
// └─────────────────────────────────────────────────────────────────────────┘
//
//  STEP 2 — Authorise (fixes the 403)
//    • In the editor toolbar, select  testSetup  from the function dropdown
//    • Click ▶ Run
//    • A permissions dialog appears → click "Review permissions" → Allow ALL
//    • You should receive a confirmation email at design2code93@gmail.com
//
//  STEP 3 — Deploy
//    • Click  Deploy → New deployment
//    • Type: Web app  |  Execute as: Me  |  Who has access: Anyone
//    • Click Deploy → copy the Web App URL
//    • Paste it as SHEETS_URL below (replace the existing URL if it changed)
//
// ─────────────────────────────────────────────────────────────────────────────
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwUKgUcEbuG7UE6C-R0aleknd3bYkwXFeNtMR8prNAplWOkf7j6vHvDa4yTfx-K_40s/exec'   // ← paste here

const EMAIL    = 'design2code93@gmail.com'
const LINKEDIN = 'https://linkedin.com/in/amritpodder'
const CALENDLY = 'https://calendly.com/amritpodder'

// ── Dot-grid paper texture ────────────────────────────────────────────────────
const DOT_GRID: React.CSSProperties = {
  backgroundImage: 'radial-gradient(circle, oklch(1 0 0 / 0.07) 1px, transparent 1px)',
  backgroundSize:  '26px 26px',
}

// ── Validation ────────────────────────────────────────────────────────────────
interface FormValues {
  name:    string
  email:   string
  phone:   string
  message: string
}

interface FormErrors {
  name?:    string
  email?:   string
  phone?:   string
  message?: string
}

function validate({ name, email, phone, message }: FormValues): FormErrors {
  const e: FormErrors = {}

  if (!name.trim())
    e.name = 'Name is required.'
  else if (name.trim().length < 2)
    e.name = 'Please enter at least 2 characters.'

  if (!email.trim())
    e.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    e.email = 'Please enter a valid email address.'

  if (!phone.trim())
    e.phone = 'Phone number is required.'
  else if (!/^[+]?[\d\s\-().]{7,20}$/.test(phone.trim()))
    e.phone = 'Please enter a valid phone number.'

  if (!message.trim())
    e.message = 'Message is required.'
  else if (message.trim().length < 10)
    e.message = 'Message must be at least 10 characters.'

  return e
}

// ── Field component ───────────────────────────────────────────────────────────
interface FieldProps {
  label:    string
  name:     string
  type?:    string
  value:    string
  rows?:    number
  required?: boolean
  error?:   string
  hint?:    string
  onChange: (v: string) => void
  onBlur?:  () => void
}

function Field({ label, name, type = 'text', value, rows, required, error, hint, onChange, onBlur }: FieldProps) {
  const [focused, setFocused] = useState(false)
  const raised = focused || value.length > 0
  const hasError = Boolean(error)

  const borderColor = hasError
    ? 'oklch(0.65 0.20 25)'         // red
    : focused
      ? 'var(--accent)'             // amber when focused
      : 'oklch(1 0 0 / 0.15)'       // dim otherwise

  const sharedStyle: React.CSSProperties = {
    background:    'transparent',
    outline:       'none',
    width:         '100%',
    color:         'oklch(0.96 0 0)',
    fontSize:      '0.9375rem',
    fontFamily:    "'Inter', sans-serif",
    lineHeight:    1.6,
    resize:        'none',
    borderBottom:  `1px solid ${borderColor}`,
    paddingBottom: '6px',
    paddingTop:    '2px',
    transition:    'border-color 0.22s',
  }

  return (
    <div className="relative pt-5 mb-6">
      {/* Floating label */}
      <label
        htmlFor={name}
        className="absolute left-0 pointer-events-none transition-all duration-200 select-none"
        style={{
          top:           raised ? '0px' : '20px',
          fontSize:      raised ? '0.63rem' : '0.875rem',
          letterSpacing: raised ? '0.16em' : '0.01em',
          textTransform: raised ? 'uppercase' : 'none',
          color: hasError
            ? 'oklch(0.65 0.20 25)'
            : raised
              ? 'var(--accent)'
              : 'oklch(0.52 0 0)',
        }}
      >
        {label}{required && <span style={{ color: 'oklch(0.65 0.20 25)' }}> *</span>}
      </label>

      {rows ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : hint ? `${name}-hint` : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          onChange={e => onChange(e.target.value)}
          style={sharedStyle}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : hint ? `${name}-hint` : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          onChange={e => onChange(e.target.value)}
          style={sharedStyle}
        />
      )}

      {/* Error message */}
      {hasError && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1.5 text-xs"
          style={{ color: 'oklch(0.65 0.20 25)' }}
        >
          {error}
        </p>
      )}

      {/* Hint (shown when no error) */}
      {hint && !hasError && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-faint">
          {hint}
        </p>
      )}
    </div>
  )
}

// ── Contact method card ───────────────────────────────────────────────────────
interface MethodCardProps {
  icon:  string
  label: string
  value: string
  href:  string
  cta:   string
}

function MethodCard({ icon, label, value, href, cta }: MethodCardProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-ct
      className="block group rounded-[3px] p-5"
      style={{ background: 'oklch(1 0 0 / 0.03)', border: '1px solid oklch(1 0 0 / 0.07)' }}
      onMouseEnter={() => gsap.to(ref.current, { y: -3, duration: 0.20 })}
      onMouseLeave={() => gsap.to(ref.current, { y:  0, duration: 0.25 })}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs tracking-[0.16em] uppercase font-medium" style={{ color: 'oklch(0.45 0 0)' }}>
          {label}
        </span>
      </div>
      <div className="font-medium text-sm leading-relaxed break-all" style={{ color: 'oklch(0.90 0 0)' }}>
        {value}
      </div>
      <div className="text-xs flex items-center gap-1 mt-2 group-hover:gap-2 transition-all duration-200" style={{ color: 'var(--accent)' }}>
        {cta} <span>↗</span>
      </div>
    </a>
  )
}

// ── Contact photo card ────────────────────────────────────────────────────────
function ContactPhotoCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    gsap.to(card, {
      rotateY: x * 8, rotateX: -y * 8,
      duration: 0.4, ease: 'power2.out', transformPerspective: 800,
    })
  }

  const handleMouseEnter = () => {
    if (cardRef.current) cardRef.current.style.willChange = 'transform'
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out',
      onComplete: () => { if (cardRef.current) cardRef.current.style.willChange = 'auto' },
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position:       'relative',
        width:          '100%',
        maxWidth:       '320px',
        aspectRatio:    '4/3',
        borderRadius:   '1.25rem',
        overflow:       'hidden',
        border:         '1px solid oklch(0.22 0 0 / 0.55)',
        background:     'oklch(0.08 0.005 50 / 0.6)',
        backdropFilter: 'blur(16px)',
        boxShadow:      '0 0 60px oklch(0.72 0.18 50 / 0.10), 0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 oklch(1 0 0 / 0.06)',
        transformStyle: 'preserve-3d',
        cursor:         'default',
      }}
    >
      {/* Photo — show from waist up */}
      <img
        src="/amrit-lego.png"
        alt="Amrit Podder"
        style={{
          position:       'absolute',
          inset:          0,
          width:          '100%',
          height:         '140%',
          objectFit:      'cover',
          objectPosition: 'center 90%',
        }}
      />

      {/* Bottom gradient */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(to top, oklch(0.04 0.005 50 / 0.90) 0%, transparent 55%)',
      }} />

      {/* Top-left: availability chip */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
        <span style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '0.4rem',
          padding:        '0.28rem 0.75rem',
          borderRadius:   '999px',
          fontSize:       '0.65rem',
          fontWeight:     600,
          letterSpacing:  '0.06em',
          background:     'oklch(0 0 0 / 0.49)',
          border:         '1px solid oklch(0.55 0.15 145 / 0.4)',
          color:          'oklch(1 0 0)',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: 'oklch(0.72 0.18 145)',
            boxShadow: '0 0 6px oklch(0.72 0.18 145)',
          }} />
          Open to projects
        </span>
      </div>

      {/* Bottom name tag */}
      <div style={{
        position: 'absolute',
        bottom:   '1rem',
        left:     '1rem',
        right:    '1rem',
      }}>
        <p style={{
          fontFamily:   "'Inter', sans-serif",
          fontWeight:   700,
          fontSize:     '0.95rem',
          color:        'oklch(0.94 0 0)',
          marginBottom: '0.15rem',
        }}>
          Amrit Podder
        </p>
        <p style={{ fontSize: '0.70rem', color: 'var(--accent)', fontWeight: 500 }}>
          Frontend Lead · NetBramha Studio
        </p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const pageRef    = useRef<HTMLElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const formRef    = useRef<HTMLFormElement>(null)

  // Field values
  const [values, setValues] = useState<FormValues>({ name: '', email: '', phone: '', message: '' })
  const set = (k: keyof FormValues) => (v: string) => {
    const next = { ...values, [k]: v }
    setValues(next)
    // Re-validate in real-time once user has attempted submit
    if (attempted) setErrors(validate(next))
  }

  // Validation
  const [errors,    setErrors]    = useState<FormErrors>({})
  const [attempted, setAttempted] = useState(false)       // true after first submit click
  const [touched,   setTouched]   = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const touch = (k: keyof FormValues) => () => {
    setTouched(t => ({ ...t, [k]: true }))
    if (attempted) setErrors(validate(values))
  }

  // Visible errors = field must be touched OR submit attempted
  const vis = (k: keyof FormValues) => (attempted || touched[k]) ? errors[k] : undefined

  // Form state
  const [formState,  setFormState]  = useState<FormState>('idle')
  const [submitError, setSubmitError] = useState('')

  // ── Entrance animation ─────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-ct]',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.85, ease: 'power3.out', delay: 0.15 },
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // ── Success animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (formState !== 'success' || !successRef.current) return
    gsap.fromTo(successRef.current,
      { opacity: 0, scale: 0.88, y: 20 },
      { opacity: 1, scale: 1,    y: 0,  duration: 0.55, ease: 'back.out(1.5)' },
    )
  }, [formState])

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAttempted(true)

    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      // Shake the button subtly
      const btn = formRef.current?.querySelector('button[type="submit"]')
      if (btn) gsap.fromTo(btn, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
      return
    }

    setFormState('submitting')
    setSubmitError('')

    try {
      // ── Google Sheets via Apps Script ──────────────────────────────────────
      // URLSearchParams → Content-Type: application/x-www-form-urlencoded
      // Apps Script reads via e.parameter (no JSON.parse needed).
      // mode:'no-cors' skips preflight; response is opaque but submission fires.
      const body = new URLSearchParams({
        name:    values.name,
        email:   values.email,
        phone:   values.phone || '',
        message: values.message,
      })

      await fetch(SHEETS_URL, {
        method:   'POST',
        mode:     'no-cors',
        body,
      })

      // Opaque response — if we reach here the request was sent at network level.
      setFormState('success')
    } catch (err) {
      // Only fires on a true network failure (offline, DNS, etc.)
      const msg = err instanceof Error ? err.message : 'Network error — please try again.'
      setSubmitError(msg)
      setFormState('error')
    }
  }

  const resetForm = () => {
    setValues({ name: '', email: '', phone: '', message: '' })
    setErrors({})
    setAttempted(false)
    setTouched({})
    setSubmitError('')
    setFormState('idle')
  }

  return (
    <main ref={pageRef} className="min-h-screen" style={{ background: 'oklch(0.05 0.008 60)' }}>

      {/* ══ Hero ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative pt-36 pb-20 px-8 md:px-16 lg:px-24 overflow-hidden"
        style={DOT_GRID}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 60% at 15% 50%, oklch(0.72 0.18 50 / 0.05) 0%, transparent 65%)',
          }}
        />
        <div className="relative z-10 max-w-5xl">
          <div data-ct className="mb-7 inline-flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-xs font-medium tracking-[0.28em] uppercase" style={{ color: 'var(--accent)' }}>
              Get in touch
            </span>
          </div>
          <h1
            data-ct
            className="leading-[0.88] mb-7"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle:  'italic',
              fontSize:   'clamp(3.8rem, 11vw, 10rem)',
              color:      'oklch(0.96 0 0)',
            }}
          >
            Let's build<br/>something real.
          </h1>
          <p data-ct className="text-muted text-base md:text-lg leading-relaxed max-w-xl" style={{ marginBottom: '1.5rem' }}>
            I work with teams who care about conversion, craft, and shipping on time.
            If that's you — let's talk. I typically reply within 24 hours.
          </p>

          {/* Not-a-fit filter */}
          <div
            data-ct
            style={{
              maxWidth:     '36rem',
              padding:      '1rem 1.25rem',
              borderRadius: '0.5rem',
              border:       '1px solid oklch(0.20 0 0)',
              background:   'oklch(0.08 0 0 / 0.5)',
            }}
          >
            <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'oklch(0.38 0 0)', marginBottom:'0.6rem' }}>
              Probably not the right fit if…
            </p>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'0.35rem' }}>
              {[
                'You need a "quick 2-day task" at an hourly rate',
                'Budget is sub-₹50K with enterprise-scale expectations',
                'You want a developer who just executes Figma files, no questions asked',
                'The brief is "make it look like Apple"',
              ].map(item => (
                <li key={item} style={{ fontSize:'0.78rem', color:'oklch(0.45 0 0)', display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                  <span style={{ color:'oklch(0.30 0 0)', flexShrink:0, marginTop:'0.05em' }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ Two-column section ════════════════════════════════════════════════ */}
      <section className="px-8 md:px-16 lg:px-24 pb-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16 items-start">

          {/* ── Left: Photo card + Contact methods ─────────────────────────── */}
          <div>

            {/* LEGO photo card */}
            <div data-ct className="mb-10">
              <ContactPhotoCard />
            </div>

            <div
              data-ct
              className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full"
              style={{
                background: 'oklch(0.35 0.12 145 / 0.15)',
                border:     '1px solid oklch(0.55 0.15 145 / 0.30)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: 'oklch(0.65 0.20 145)' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: 'oklch(0.65 0.20 145)' }}
                />
              </span>
              <span className="text-xs font-medium tracking-[0.12em] uppercase" style={{ color: 'oklch(0.65 0.20 145)' }}>
                Available for freelance
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <MethodCard icon="✉️" label="Email"    value={EMAIL}              href={`mailto:${EMAIL}`} cta="Send an email" />
              <MethodCard icon="💼" label="LinkedIn" value="amritpodder"        href={LINKEDIN}          cta="View profile"  />
              <MethodCard icon="📅" label="Calendly" value="30-min intro call"  href={CALENDLY}          cta="Book a time"   />
            </div>

            <p data-ct className="mt-8 text-xs leading-relaxed" style={{ color: 'oklch(0.42 0 0)', maxWidth: '28rem' }}>
              Based in India &amp; open to remote collaboration worldwide.
              Typical response time: &lt;&nbsp;24&nbsp;hours.
            </p>
          </div>

          {/* ── Right: Form card ───────────────────────────────────────────── */}
          <div
            data-ct
            className="relative overflow-hidden rounded-[3px] noise-overlay"
            style={{
              background: 'oklch(0.08 0.012 60)',
              border:     '1px solid oklch(1 0 0 / 0.07)',
              ...DOT_GRID,
            }}
          >
            <div className="relative z-10 p-8 md:p-10">

              {/* ── Success ── */}
              {formState === 'success' ? (
                <div
                  ref={successRef}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2"
                    style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-dim)' }}
                  >
                    ✓
                  </div>
                  <h3 className="text-text-primary text-xl font-semibold">Message sent!</h3>
                  <p className="text-muted text-sm max-w-xs leading-relaxed">
                    Thanks for reaching out. I'll get back to you at{' '}
                    <strong style={{ color: 'oklch(0.88 0 0)' }}>{values.email}</strong>{' '}
                    within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-2 text-xs tracking-[0.16em] uppercase"
                    style={{ color: 'var(--accent)' }}
                  >
                    Send another →
                  </button>
                </div>

              ) : (
                /* ── Form ── */
                <>
                  <div className="mb-7">
                    <h2 className="text-xl font-semibold text-text-primary mb-1">Send a message</h2>
                    <p className="text-faint text-xs tracking-[0.10em]">
                      Fields marked <span style={{ color: 'oklch(0.65 0.20 25)' }}>*</span> are required.
                    </p>
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} noValidate>

                    {/* Name + Phone — side by side on md+ */}
                    <div className="relative pt-5 mb-6">
                      <Field
                        label="Your name"
                        name="name"
                        value={values.name}
                        required
                        error={vis('name')}
                        onChange={set('name')}
                        onBlur={touch('name')}
                      />
                      <Field
                        label="Phone number"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        required
                        error={vis('phone')}
                        hint="Include country code e.g. +91"
                        onChange={set('phone')}
                        onBlur={touch('phone')}
                      />
                    </div>

                    <Field
                      label="Email address"
                      name="email"
                      type="email"
                      value={values.email}
                      required
                      error={vis('email')}
                      onChange={set('email')}
                      onBlur={touch('email')}
                    />

                    <Field
                      label="Your message"
                      name="message"
                      value={values.message}
                      rows={5}
                      required
                      error={vis('message')}
                      onChange={set('message')}
                      onBlur={touch('message')}
                    />

                    {/* Network / submission error */}
                    {formState === 'error' && (
                      <div
                        className="mb-4 px-4 py-3 rounded-[2px] text-xs leading-relaxed"
                        role="alert"
                        style={{
                          background: 'oklch(0.65 0.20 25 / 0.10)',
                          border:     '1px solid oklch(0.65 0.20 25 / 0.35)',
                          color:      'oklch(0.75 0.18 25)',
                        }}
                      >
                        ⚠ {submitError || 'Submission failed. Please try emailing me directly at '}
                        {!submitError && (
                          <a href={`mailto:${EMAIL}`} style={{ color: 'var(--accent)' }}>
                            {EMAIL}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="mt-1 w-full py-3.5 rounded-[2px] text-sm font-semibold tracking-[0.06em] flex items-center justify-center gap-2 transition-all duration-200"
                      style={{
                        background: formState === 'submitting' ? 'var(--accent-dim)' : 'var(--accent)',
                        color:      'oklch(0.05 0 0)',
                        cursor:     formState === 'submitting' ? 'wait' : 'pointer',
                      }}
                    >
                      {formState === 'submitting' ? (
                        <>
                          <span
                            className="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
                            style={{ borderTopColor: 'oklch(0.05 0 0)' }}
                          />
                          Sending…
                        </>
                      ) : (
                        'Send message ↗'
                      )}
                    </button>

                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
