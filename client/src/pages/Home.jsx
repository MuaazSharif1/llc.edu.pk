import { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'

import AdmissionSteps from '../components/AdmissionSteps'

import { Scale, Gavel, BookOpen, Users, Landmark, ArrowRight, CheckCircle2, Briefcase } from 'lucide-react'

import { ArrowUpRight as ArrowUR } from 'lucide-react'

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

              whileHover={{ y: -6 }}

              className="law-flip-card"

            >

              <div className="law-flip-inner">



                {/* Front: Existing icon and title */}

                <div className="law-flip-front">

                  <div className="ico">

                    <I size={32} />

                  </div>

                  <h3>{title}</h3>

                  <p>Hover to discover more</p>

                </div>



                {/* Back: Message */}

                <div className="law-flip-back">

                  <h3>{title}</h3>

                  <p>{message}</p>

                  <span className="law-flip-hint">

                    Learn Law in Practice

                  </span>

                </div>



              </div>

            </motion.div>

          ))}

        </div>

      </View>

    </section>

  );

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



export function News({ limit = 3 }) {
  const { news = [], loading } = useData()

  const items = news.slice(0, limit).map((item, index) => ({
    id: item._id || item.slug || `${item.title}-${index}`,
    label: item.title || 'Untitled update',
    sublabel: `${(item.type || 'NEWS').toString()} · ${item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : ''}`,
    image: item.image || '/hero/1.png',
    imageAlt: item.title || 'Lahore Law College update',
    description: item.excerpt || 'Read the latest update from Lahore Law College.',
    href: item.slug ? `/news/${item.slug}` : '/news',
  }))

  return (
    <section id="news" className="news-hover-section">
      <div className="wrap">
        <View>
          <Head
            e="News & Events"
            t="Latest updates"
            l="Stay connected with the latest news, events and announcements from Lahore Law College."
          />
        </View>

        {loading && items.length === 0 ? (
          <p className="lead" style={{ marginTop: 28 }}>Loading latest updates…</p>
        ) : items.length > 0 ? (
          <HoverExpand
            items={items}
            collapsedHeight={76}
            expandedHeight={300}
            className="news-hover-list"
          />
        ) : (
          <p className="lead" style={{ marginTop: 28 }}>News and events will appear here.</p>
        )}

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link to="/news" className="btn o">
            View all news and events <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * Expandable image cards for the News & Events section.
 * Cards expand on hover and navigate to the matching news detail page on click.
 */
function HoverExpand({
  items = [],
  collapsedHeight = 76,
  expandedHeight = 300,
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items.length) return null

  return (
    <>
      <style>{`
        .news-hover-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 34px;
          width: 100%;
        }
        .news-hover-card {
          position: relative;
          display: flex;
          align-items: flex-end;
          width: 100%;
          overflow: hidden;
          isolation: isolate;
          border-radius: 18px;
          color: #fff;
          text-decoration: none;
          background-color: #173b32;
          background-size: cover;
          background-position: center;
          box-shadow: 0 8px 26px rgba(0,0,0,.12);
          transition: box-shadow .3s ease, border-radius .3s ease;
        }
        .news-hover-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(90deg, rgba(5,18,15,.88), rgba(5,18,15,.42) 58%, rgba(5,18,15,.12)),
                      linear-gradient(0deg, rgba(0,0,0,.5), transparent 70%);
          transition: background .3s ease;
        }
        .news-hover-card:hover {
          box-shadow: 0 18px 42px rgba(0,0,0,.2);
        }
        .news-hover-content {
          width: min(760px, 100%);
          padding: 24px 30px;
        }
        .news-hover-meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color: #d8e9df;
          font-size: .76rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .news-hover-title {
          margin: 0;
          color: #fff;
          font-size: clamp(1.1rem, 2.3vw, 1.75rem);
          line-height: 1.2;
          font-weight: 700;
        }
        .news-hover-description {
          max-width: 650px;
          margin: 12px 0 0;
          color: rgba(255,255,255,.88);
          font-size: .96rem;
          line-height: 1.6;
        }
        .news-hover-read {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          color: #fff;
          font-size: .88rem;
          font-weight: 700;
        }
        @media (max-width: 640px) {
          .news-hover-list { gap: 10px; margin-top: 24px; }
          .news-hover-card { border-radius: 14px; }
          .news-hover-content { padding: 18px 18px 20px; }
          .news-hover-description { font-size: .86rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .news-hover-card, .news-hover-card::before { transition: none; }
        }
      `}</style>

      <div className={`news-hover-list ${className}`.trim()}>
        {items.map((item, index) => {
          const expanded = activeIndex === index

          return (
            <MLink
              key={item.id}
              to={item.href}
              className="news-hover-card"
              style={{
                height: expanded ? expandedHeight : collapsedHeight,
                backgroundImage: `url("${item.image}")`,
              }}
              initial={false}
              animate={{
                height: expanded ? expandedHeight : collapsedHeight,
              }}
              transition={{ height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              aria-label={`Read: ${item.label}`}
            >
              <div className="news-hover-content">
                <span className="news-hover-meta">{item.sublabel}</span>
                <h3 className="news-hover-title">{item.label}</h3>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.08 }}
                  >
                    {item.description && (
                      <p className="news-hover-description">{item.description}</p>
                    )}
                    <span className="news-hover-read">
                      Read more <ArrowUR size={17} />
                    </span>
                  </motion.div>
                )}
              </div>
            </MLink>
          )
        })}
      </div>
    </>
  )
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
  