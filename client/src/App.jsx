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
    const done = () => setTimeout(() => setLoading(false), 1000)
    if (document.readyState === 'complete') done()
    else window.addEventListener('load', done)
    return () => window.removeEventListener('load', done)
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