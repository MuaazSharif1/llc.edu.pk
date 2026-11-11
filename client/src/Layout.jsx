import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Scale, Menu, X, Phone, MessageCircle } from 'lucide-react'
import { useData } from './DataContext'
const NAV = [['Programs', '/programs'], ['Admissions', '/admissions'], ['About', '/about'], ['News', '/news'], ['Contact', '/contact']]
// 👉 Put your logo at client/public/logo.png (transparent PNG, about 200px tall)
function Logo() {
  const [err, setErr] = useState(false)
  return <Link to="/" className="logo">{err ? <i><Scale size={18} /></i> : <img src="/logo.png" alt="" className="logo-img" onError={() => setErr(true)} />}Lahore Law College</Link>
}
// 👉 WhatsApp number with country code, digits only (e.g. 923001234567). Leave '' to use the phone from Site settings.
const WHATSAPP_NUMBER = ''
const waDigits = p => { const d = String(p || '').replace(/\D/g, ''); return d.startsWith('92') ? d : d.startsWith('0') ? '92' + d.slice(1) : d }
export default function Layout() {
  const [open, setOpen] = useState(false), { pathname, hash } = useLocation(), { settings: s } = useData(), wa = WHATSAPP_NUMBER || waDigits(s.phone)
  const { scrollYProgress } = useScroll(), scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  useEffect(() => {
    setOpen(false)
    if (hash) { const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80); return () => clearTimeout(t) }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  
  // Navbar: transparent at top, fixed after 10% scroll
  useEffect(() => {
    const updateNavbar = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight

      const scrollPercent = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0

      document.querySelector('header')?.classList.toggle(
        'scrolled',
        scrollPercent >= 10
      )
    }

    window.addEventListener('scroll', updateNavbar, { passive: true })
    updateNavbar()

    return () => {
      window.removeEventListener('scroll', updateNavbar)
    }
  }, [pathname])


  return <>
    <motion.div className="progress" style={{ scaleX }} />
    {s.announcement && <div className="bar">{s.announcement}</div>}
    <header><div className="wrap nav">
      <Logo />
      <nav className="links" aria-label="Main">{NAV.map(([n, h]) => <NavLink key={n} to={h} className={({ isActive }) => isActive ? 'act' : ''}>{n}</NavLink>)}
        <Link className="btn p" to="/contact">Enquire</Link></nav>
      <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav className="mob" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} aria-label="Mobile">
      {NAV.map(([n, h]) => <Link key={n} to={h}>{n}</Link>)}
    </motion.nav>}</AnimatePresence></header>
    <motion.main key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}><Outlet /></motion.main>
    <footer><div className="wrap"><div className="grid">
      <div><h3>Lahore Law College</h3><p>{s.about}</p></div>
      <div><h3>Quick links</h3>{NAV.map(([n, h]) => <Link key={n} to={h}>{n}</Link>)}</div>
      <div><h3>Messages &amp; Downloads</h3><Link to="/#principal">Principal’s Message</Link><Link to="/#chairman">Chairman’s Message</Link><Link to="/admin">Admin Login</Link><a href="/brochure/Lahore-Law-College-Brochure.pdf" download>Download Brochure</a></div>
      <div><h3>Contact</h3><p>{s.address}</p>{s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}{s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}</div>
    </div><p style={{ borderTop: '1px solid #3a3850', paddingTop: 20 }}>© {new Date().getFullYear()} Lahore Law College. All rights reserved.</p></div></footer>
    <motion.a href={`https://wa.me/${wa}?text=${encodeURIComponent('Hello, I would like to know more about Lahore Law College.')}`} target="_blank" rel="noreferrer" className="btn wa fab" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .6, type: 'spring' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: .96 }} aria-label="Chat on WhatsApp"><MessageCircle size={22} /> Ask anything</motion.a>
  </>
}