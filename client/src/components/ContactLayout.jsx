import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { useData } from '../DataContext'

// 👉 Settings you can edit
const MAP_QUERY = ''        // leave '' to use the address from Admin > Site settings
const OFFICE_HOURS = ''     // e.g. 'Mon – Sat, 9:00 am – 5:00 pm'  (hidden while empty)
const CARD_IMAGE = '/hero/1.png'   // photo shown on the small card over the map

const waDigits = p => { const d = String(p || '').replace(/\D/g, ''); return d.startsWith('92') ? d : d.startsWith('0') ? '92' + d.slice(1) : d }

export default function ContactLayout() {
  const { settings: s, programs } = useData()
  const address = MAP_QUERY || s.address || 'Lahore, Pakistan'
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const dirHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const wa = waDigits(s.phone)
  const [v, setV] = useState({ name: '', email: '', phone: '', program: '', message: '', website: '' })
  const [err, setErr] = useState({}), [state, setState] = useState('idle'), [ref, setRef] = useState('')
  const set = k => e => setV({ ...v, [k]: e.target.value })

  async function submit(ev) {
    ev.preventDefault()
    const x = {}
    if (v.name.trim().length < 2) x.name = 'Please enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) x.email = 'Enter a valid email'
    if (!v.program) x.program = 'Select a program'
    setErr(x); if (Object.keys(x).length) return
    setState('sending')
    try {
      const r = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) })
      const j = await r.json()
      if (!r.ok) { setErr({ message: j.error || 'Something went wrong' }); setState('idle'); return }
      setRef(j.ref); setState('done')
    } catch { setErr({ message: 'Network error. Please retry.' }); setState('idle') }
  }

  return <div className="ct-page"><div className="wrap">
    <p className="eyebrow">Lahore Law College</p>
    <h1 className="ct-title">Contact us</h1>

    <div className="ct">
      {/* left: contact details */}
      <aside className="ct-info">
        <section>
          <h3>Contact us</h3>
          {s.address && <p className="ct-addr">{s.address}</p>}
          {s.email && <a href={`mailto:${s.email}`}><Mail size={16} />{s.email}</a>}
          {s.phone && <a href={`tel:${s.phone}`}><Phone size={16} />{s.phone}</a>}
        </section>
        <section>
          <h3>Admissions enquiries</h3>
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><MessageCircle size={16} />Chat on WhatsApp</a>}
          <a href={dirHref} target="_blank" rel="noreferrer"><MapPin size={16} />Get directions</a>
        </section>
        {OFFICE_HOURS && <section><h3>Office hours</h3><p className="ct-hours"><Clock size={16} />{OFFICE_HOURS}</p></section>}
      </aside>

      {/* middle: Google map + small card */}
      <div className="ct-map">
        <iframe title="Lahore Law College location" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        <a className="ct-pop" href={dirHref} target="_blank" rel="noreferrer" aria-label="Open in Google Maps">
          <img src={CARD_IMAGE} alt="" />
          <b>Our campus</b>
          <span>{s.address || address}</span>
          <ArrowUpRight size={16} className="ct-arrow" />
        </a>
      </div>

      {/* right: form */}
      <motion.div className="ct-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
        {state === 'done' ? <div className="ct-ok"><CheckCircle2 size={52} /><h2>Thank you, {v.name.split(' ')[0]}!</h2><p>Your reference number: <b>{ref}</b></p></div> :
        <form onSubmit={submit} noValidate>
          <div className="ct-form-head"><h2>We are here to help</h2><p>Need to contact us? Please fill this form.</p></div>
          <label><input placeholder="Full name" aria-label="Full name" autoComplete="name" value={v.name} onChange={set('name')} />{err.name && <span className="err" role="alert">{err.name}</span>}</label>
          <label><input type="email" placeholder="Email address" aria-label="Email address" autoComplete="email" value={v.email} onChange={set('email')} />{err.email && <span className="err" role="alert">{err.email}</span>}</label>
          <label><input type="tel" placeholder="Phone (optional)" aria-label="Phone" autoComplete="tel" value={v.phone} onChange={set('phone')} /></label>
          <label><select aria-label="Program" value={v.program} onChange={set('program')}><option value="">Program of interest</option>{programs.map(p => <option key={p._id}>{p.title}</option>)}</select>{err.program && <span className="err" role="alert">{err.program}</span>}</label>
          <label className="grow"><textarea placeholder="Message" aria-label="Message" value={v.message} onChange={set('message')} />{err.message && <span className="err" role="alert">{err.message}</span>}</label>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden value={v.website} onChange={set('website')} style={{ position: 'absolute', left: '-9999px' }} />
          <small className="ct-note">By submitting you agree to our privacy policy.</small>
          <button className="ct-submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit'}</button>
        </form>}
      </motion.div>
    </div>
  </div></div>
}