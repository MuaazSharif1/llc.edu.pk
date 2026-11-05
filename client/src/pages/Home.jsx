import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdmissionSteps from '../components/AdmissionSteps'
import { Scale, Gavel, BookOpen, Users, Landmark, ArrowRight, CheckCircle2, Briefcase } from 'lucide-react'
import { ArrowUpRight as ArrowUR, Newspaper as NewsIc, CalendarDays as CalIc, Megaphone as MegIc } from 'lucide-react'
import { useData } from '../DataContext'
const MLink = motion(Link)

// ⚠️ Placeholder content — verify all programs, dates & contacts with the college before publishing.
const NAV = [['About','#about'],['Programs','#programs'],['Admissions','#admissions'],['Faculty','#faculty'],['News','#news'],['Contact','#contact']]
const PRACTICE = [
  [Gavel,'Moot Court','Argue mock cases before faculty and practitioners.'],
  [BookOpen,'Legal Research','Learn to research, draft and cite like a lawyer.'],
  [Users,'Legal Aid Clinic','Hands-on exposure to real community legal issues.'],
  [Briefcase,'Internships','Placements with courts, chambers and firms.'],
]
const STEPS = [['Explore','Choose your program and check eligibility.'],['Enquire','Send us your details using the form below.'],['Submit','Complete documents before the deadline.'],['Admission','Receive your confirmation and reference number.']]

const fade = { hidden:{opacity:0,y:32}, show:{opacity:1,y:0,transition:{duration:.6,ease:[.22,1,.36,1]}} }
const stagger = { show:{transition:{staggerChildren:.1}} }
const View = ({children,className,...p}) => <motion.div className={className} variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-80px'}} {...p}>{children}</motion.div>
const Head = ({e,t,l}) => <motion.div variants={fade}><p className="eyebrow">{e}</p><h2>{t}</h2>{l&&<p className="lead">{l}</p>}</motion.div>

// 👉 Hero background images: put your photos in client/public/hero/ and list them here
const HERO_IMAGES = ['/hero/1.png', '/hero/2.jpeg', '/hero/3.jpeg']
const SLIDE_MS = 5500

export function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    HERO_IMAGES.forEach(src => { const im = new Image(); im.src = src })
    const t = setInterval(() => setI(x => (x + 1) % HERO_IMAGES.length), SLIDE_MS)
    return () => clearInterval(t)
  }, [i])
  const words = 'Where future lawyers learn to argue, research and lead.'.split(' ')
  return <section className="hero hero-slider">
    <div className="slides" aria-hidden>
      <AnimatePresence initial={false}>
        <motion.div key={i} className="slide" style={{ backgroundImage: `url(${HERO_IMAGES[i]})` }}
          initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'linear' } }} />
      </AnimatePresence>
      <div className="shade" />
    </div>
    <View className="wrap hero-in">
      <motion.p variants={fade} className="eyebrow">Admissions open · Lahore</motion.p>
      <h1>{words.map((w, n) => <motion.span key={n} variants={fade} style={{ display: 'inline-block', marginRight: '.25em' }}>{n === 5 ? <em>{w}</em> : w}</motion.span>)}</h1>
      <motion.p variants={fade} className="lead">A modern law college focused on practice-oriented learning — moot court, legal research and real-world advocacy.</motion.p>
      <motion.div variants={fade} className="cta">
        <motion.a whileHover={{ y: -3 }} whileTap={{ scale: .97 }} className="btn p" href="#contact">Apply / Enquire <ArrowRight size={18} /></motion.a>
        <motion.a whileHover={{ y: -3 }} whileTap={{ scale: .97 }} className="btn o" href="#programs">Explore Programs</motion.a>
      </motion.div>
      <motion.div variants={fade} className="dots">{HERO_IMAGES.map((_, n) => <button key={n} aria-label={`Show slide ${n + 1}`} className={n === i ? 'on' : ''} onClick={() => setI(n)} />)}</motion.div>
    </View>
  </section>
}

export function Programs() {
  const {programs}=useData(); const PROGRAMS=programs.map(x=>({t:x.title,c:x.level,d:x.summary,slug:x.slug}))
  const [f,setF] = useState('all')
  const tabs = [['all','All'],['undergrad','Undergraduate'],['postgrad','Postgraduate'],['short','Short courses']]
  return <section id="programs"><div className="wrap">
    <View><Head e="Programs" t="Find your program" l="Filter by level and see what fits your path into law."/></View>
    <div className="tabs" role="tablist">{tabs.map(([k,l])=><button key={k} role="tab" aria-selected={f===k} className={'tab'+(f===k?' on':'')} onClick={()=>setF(k)}>
      {f===k&&<motion.span layoutId="pill" className="pill" transition={{type:'spring',stiffness:400,damping:32}}/>}<span>{l}</span></button>)}</div>
    <motion.div layout className="grid"><AnimatePresence mode="popLayout">
      {PROGRAMS.filter(p=>f==='all'||p.c===f).map(p=><motion.article layout key={p.t} className="card" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.9}} whileHover={{y:-6}}>
        <div className="ico"><Landmark/></div><h3>{p.t}</h3><p>{p.d}</p><Link className="tag" to={`/programs/${p.slug}`}>View details →</Link></motion.article>)}
    </AnimatePresence></motion.div>
  </div></section>
}


export function Practice() {
  const [openCard, setOpenCard] = useState(null) // phone / tablet par tap se flip
  const toggle = (title) => setOpenCard(openCard === title ? null : title)
  return (
    <section id="about" className="alt">
      <View className="wrap">
        <Head
          e="Learn law in practice"
          t="More than lectures"
          l="Activities that build courtroom confidence and professional skills."
        />

        <div className="grid" style={{ marginTop: 36 }}>
          {PRACTICE.map(([I, title, message]) => (
            <motion.div
              key={title}
              variants={fade}
              className={'law-flip-card' + (openCard === title ? ' flipped' : '')}
              role="button"
              tabIndex={0}
              aria-pressed={openCard === title}
              onClick={() => toggle(title)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(title)
                }
              }}
            >
              <div className="law-flip-inner">
                {/* Front */}
                <div className="law-flip-front">
                  <div className="ico"><I size={32} /></div>
                  <h3>{title}</h3>
                  <p>
                    <span className="hint-hover">Hover</span>
                    <span className="hint-tap">Tap</span> to discover more
                  </p>
                </div>

                {/* Back */}
                <div className="law-flip-back">
                  <h3>{title}</h3>
                  <p>{message}</p>
                  <span className="law-flip-hint">Learn Law in Practice</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </View>
    </section>
  )
}



export function Faculty() {
  const { faculty } = useData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  return (
    <section id="faculty" className="faculty-accordion-section">
      <View className="wrap">
        <Head
          e="Faculty & Research"
          t="Meet Our Teachers"
          l="Learn from our qualified and dedicated faculty members."
        />

        {faculty?.length > 0 ? (
          <div className="faculty-accordion">
            {faculty.map((f, index) => (
              <motion.div
                key={f._id}
                className={`faculty-accordion-card ${
                  activeIndex === index ? "active" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                style={{
                  backgroundImage: f.image
                    ? `url("${f.image}")`
                    : "linear-gradient(135deg, #173b32, #0b211d)",
                }}
              >
                <div className="faculty-card-overlay" />

                <span className="faculty-vertical-name">
                  {f.name}
                </span>

                <div className="faculty-card-info">
                  <span className="faculty-designation">
                    {f.designation || "Lecturer"}
                  </span>

                  <h3>{f.name}</h3>

                  {f.qualification && <p>{f.qualification}</p>}

                  {f.institution && <small>{f.institution}</small>}

                  {f.bio && (
                    <button
                      type="button"
                      className="faculty-read-bio"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTeacher(f);
                      }}
                    >
                      Read Bio <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="lead">Faculty profiles will appear here.</p>
        )}
      </View>

      <AnimatePresence>
        {selectedTeacher && (
          <motion.div
            className="faculty-bio-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTeacher(null)}
          >
            <motion.div
              className="faculty-bio-modal"
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="faculty-bio-close"
                onClick={() => setSelectedTeacher(null)}
                aria-label="Close"
              >
                &times;
              </button>

              <p className="eyebrow">Faculty Biography</p>
              <h2>{selectedTeacher.name}</h2>
              <p>{selectedTeacher.designation || "Lecturer"}</p>

              {selectedTeacher.qualification && (
                <p><strong>Qualification:</strong> {selectedTeacher.qualification}</p>
              )}

              {selectedTeacher.institution && (
                <p><strong>Institution:</strong> {selectedTeacher.institution}</p>
              )}

              <div className="faculty-bio-text">
                {selectedTeacher.bio}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


export function Admissions() {
  return <section id="admissions" className="alt"><View className="wrap"><Head e="Admissions" t="Four simple steps"/>
    <motion.div variants={fade} style={{marginTop:40}}><AdmissionSteps steps={STEPS}/></motion.div></View></section>
}

export function News({limit=3}) {
  const {news}=useData(); const NEWS=news.slice(0,limit).map(x=>[x.type,x.title,new Date(x.createdAt).toLocaleDateString('en-GB',{month:'short',year:'numeric'}),x.slug])
  if (limit <= 5) return <NewsStack news={news} />
  return <section id="news"><View className="wrap"><Head e="News & Events" t="Latest updates"/>
    <div className="grid" style={{marginTop:36}}>{NEWS.map(([c,t,d,sl])=><MLink to={`/news/${sl}`} key={t} variants={fade} whileHover={{y:-6}} className="card"><span className="tag" style={{marginTop:0,marginBottom:12}}>{c}</span><h3>{t}</h3><p>{d}</p></MLink>)}</div></View></section>
}

export function Contact() {
  const {programs}=useData(); const PROGRAMS=programs.map(x=>({t:x.title}))
  const [v,setV] = useState({name:'',email:'',program:'',message:'',website:''}), [e,setE] = useState({}), [state,setState] = useState('idle'), [ref,setRef] = useState('')
  const set = k => ev => setV({...v,[k]:ev.target.value})
  const submit = async ev => { ev.preventDefault()
    const x = {}
    if (v.name.trim().length<2) x.name='Please enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) x.email='Enter a valid email'
    if (!v.program) x.program='Select a program'
    setE(x); if (Object.keys(x).length) return
    setState('sending')
    try{ const r=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)}); const j=await r.json()
      if(!r.ok){ setE({program:j.error||'Something went wrong'}); setState('idle'); return }
      setRef(j.ref); setState('done') }catch{ setE({program:'Network error. Please retry.'}); setState('idle') }
  }
  return <section id="contact" className="alt"><View className="wrap" style={{maxWidth:720}}>
    <Head e="Contact" t="Admission enquiry" l="Share your details and our admissions team will contact you."/>
    <motion.div variants={fade} style={{marginTop:32}}><AnimatePresence mode="wait">
      {state==='done' ? <motion.div key="ok" className="card ok" initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}>
        <CheckCircle2 size={56}/><h3 style={{marginTop:12}}>Thank you, {v.name.split(' ')[0]}!</h3><p>Your reference number: <b>{ref}</b></p></motion.div>
      : <motion.form key="f" onSubmit={submit} noValidate exit={{opacity:0}}>
        <div className="two">
          <label>Full name<input value={v.name} onChange={set('name')} autoComplete="name"/>{e.name&&<span className="err" role="alert">{e.name}</span>}</label>
          <label>Email<input type="email" value={v.email} onChange={set('email')} autoComplete="email"/>{e.email&&<span className="err" role="alert">{e.email}</span>}</label>
        </div>
        <label>Program<select value={v.program} onChange={set('program')}><option value="">Select…</option>{PROGRAMS.map(p=><option key={p.t}>{p.t}</option>)}</select>{e.program&&<span className="err" role="alert">{e.program}</span>}</label>
        <label>Message (optional)<textarea rows={4} value={v.message} onChange={set('message')}/></label>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden value={v.website} onChange={set('website')} style={{position:'absolute',left:'-9999px'}}/>
        <p style={{fontSize:'.8rem',color:'var(--muted)'}}>By submitting you agree to our privacy policy.</p>
        <motion.button whileTap={{scale:.97}} className="btn p" disabled={state==='sending'} style={{justifyContent:'center'}}>{state==='sending'?'Sending…':'Submit enquiry'}</motion.button>
      </motion.form>}
    </AnimatePresence></motion.div>
  </View></section>
}

/* ===================== News & Events: stacked cards ===================== */
const NS_FALLBACK = '/hero/1.png'
const NS_TYPE = {
  NEWS: { label: 'News', icon: NewsIc, tone: 'tone-green' },
  EVENT: { label: 'Event', icon: CalIc, tone: 'tone-violet' },
  NOTICE: { label: 'Notice', icon: MegIc, tone: 'tone-amber' },
}
const NS_ROT = [-1.2, 1, -0.8, 1.2]
const nsDate = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function StackedCards({ hero: h, cards, eyebrow, title, after }) {
  return <section className="sfc" id="news"><div className="wrap">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    <div className={'sfc-grid' + (cards.length ? '' : ' solo')}>
      <motion.article className="sfc-hero" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .35 }}>
        <div className="sfc-img"><img src={h.imageSrc} alt={h.title} loading="lazy" /><span className="sfc-badge">{h.badge}</span></div>
        <div className="sfc-body"><h3>{h.title}</h3><p>{h.description}</p>
          <Link className="btn p" to={h.href}>Read more <ArrowUR size={18} /></Link></div>
      </motion.article>
      {cards.length > 0 && <div className="sfc-stack">
        {cards.map((c, i) => { const Icon = c.icon
          return <div key={c.href} className="sfc-item" style={{ top: 100 + i * 18 }}>
            <div className="sfc-rot" style={{ '--r': `${c.rotate}deg` }}>
              <Link to={c.href} className="sfc-link" aria-label={c.title}>
                <motion.div className={'sfc-card ' + c.tone} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .3 }}>
                  <span className="sfc-ico"><Icon size={24} /></span>
                  <div><h3>{c.title}</h3><p>{c.description}</p></div>
                  <span className="sfc-num">{c.value}</span>
                </motion.div>
              </Link>
            </div></div> })}
      </div>}
    </div>
    {after}
  </div></section>
}

function NewsStack({ news }) {
  if (!news.length) return null
  const [first, ...rest] = news, t = NS_TYPE[first.type] || NS_TYPE.NEWS
  const hero = { imageSrc: first.image || NS_FALLBACK, badge: `${t.label} · ${nsDate(first.createdAt)}`, title: first.title, description: first.excerpt, href: `/news/${first.slug}` }
  const cards = rest.slice(0, 4).map((p, i) => { const x = NS_TYPE[p.type] || NS_TYPE.NEWS
    return { value: nsDate(p.createdAt), title: p.title, description: p.excerpt, icon: x.icon, tone: x.tone, rotate: NS_ROT[i % 4], href: `/news/${p.slug}` } })
  return <StackedCards eyebrow="News & Events" title="Latest updates" hero={hero} cards={cards}
    after={<div style={{ textAlign: 'center', marginTop: 24 }}><Link className="btn o" to="/news">View all news and events <ArrowRight size={18} /></Link></div>} />
}