import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Hero, Programs, Practice, Faculty, Admissions, News, Contact } from './Home'
import Leadership from '../components/Leadership'
import Brochure from '../components/Brochure'
import { useData } from '../DataContext'
import ContactLayout from '../components/ContactLayout'
import { api, useSEO } from '../api'
const Banner = ({ t, d }) => <div className="banner"><div className="wrap"><p className="eyebrow">Lahore Law College</p><h1>{t}</h1>{d && <p className="lead">{d}</p>}</div></div>
export const HomePage = () => <><Hero /><Programs /><Leadership /><Practice /><Faculty /><Admissions /><News /><Brochure /><Contact /></>
export const ProgramsPage = () => { useSEO('Law Programs', 'Explore LL.B, LL.M and short law programs at Lahore Law College.'); return <><Banner t="Our Programs" d="Find the law program that fits your goals." /><Programs /></> }
export const AdmissionsPage = () => { useSEO('Admissions', 'How to apply to Lahore Law College: steps, requirements and enquiry form.'); return <><Banner t="Admissions" /><Admissions /><Contact /></> }
export const NewsPage = () => { useSEO('News & Events', 'Latest news, events and notices from Lahore Law College.'); return <><Banner t="News & Events" /><News limit={99} /></> }
export const AboutPage = () => { const { settings: s } = useData(); useSEO('About Us', s.about); return <><Banner t="About the College" d={s.about} /><Leadership /><Practice /><Faculty /></> }
export const ContactPage = () => { useSEO('Contact', 'Contact Lahore Law College admissions.'); return <ContactLayout /> }
export const NotFound = () => { useSEO('Page not found'); return <main className="prose" style={{ textAlign: 'center' }}><h1>Page not found</h1><p>The page you are looking for does not exist.</p><Link className="btn p" to="/">Back to home</Link></main> }
export function ProgramDetail() {
  const { slug } = useParams(), { programs, loading } = useData(), p = programs.find(x => x.slug === slug)
  useSEO(p && (p.seoTitle || p.title), p && (p.seoDescription || p.summary))
  if (loading) return <div className="prose">Loading…</div>
  if (!p) return <NotFound />
  return <article className="prose"><Link to="/programs" className="eyebrow">← All programs</Link><h1>{p.title}</h1>{p.image && <img src={p.image} alt={p.title} />}<p>{p.summary}</p>
    {p.eligibility && <><h2>Eligibility</h2><p>{p.eligibility}</p></>}{p.curriculum && <><h2>Curriculum</h2><p>{p.curriculum}</p></>}{p.fees && <><h2>Fees</h2><p>{p.fees}</p></>}
    <p style={{ fontSize: '.8rem', marginTop: 24 }}>Last updated: {new Date(p.updatedAt).toLocaleDateString('en-GB')}</p><Link className="btn p" to="/contact" style={{ marginTop: 16 }}>Enquire about this program</Link></article>
}
export function PostDetail() {
  const { slug } = useParams(), [p, setP] = useState(), [err, setErr] = useState(false)
  useEffect(() => { setP(); setErr(false); api('/api/public/posts/' + slug).then(setP).catch(() => setErr(true)) }, [slug])
  useSEO(p && (p.seoTitle || p.title), p && (p.seoDescription || p.excerpt))
  if (err) return <NotFound />
  if (!p) return <div className="prose">Loading…</div>
  return <article className="prose"><Link to="/news" className="eyebrow">← {p.type}</Link><h1>{p.title}</h1>{p.image && <img src={p.image} alt={p.title} />}<p>{p.body}</p><p style={{ fontSize: '.8rem' }}>Published {new Date(p.createdAt).toLocaleDateString('en-GB')}</p></article>
}