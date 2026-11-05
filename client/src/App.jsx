import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loader from './components/Loader'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import { HomePage, ProgramsPage, ProgramDetail, AdmissionsPage, NewsPage, PostDetail, AboutPage, ContactPage, NotFound } from './pages/Pages'

const Admin = lazy(() => import('./admin/Admin'))

export default function App() {
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  // loader kam az kam 0.9 second dikhe, aur 3 second se zyada kabhi na ruke
  const minTime = new Promise(r => setTimeout(r, 900))
  const ready = new Promise(r => {
    if (document.readyState === 'complete') r()
    else window.addEventListener('load', r, { once: true })
  })
  const maxTime = new Promise(r => setTimeout(r, 3000))
  Promise.race([Promise.all([minTime, ready]), maxTime]).then(() => setLoading(false))
}, [])

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="programs/:slug" element={<ProgramDetail />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<PostDetail />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="admin/*"
          element={
            <Suspense fallback={<p style={{ padding: 40 }}>Loading…</p>}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </>
  )
}