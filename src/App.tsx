import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
const Work = lazy(() => import('./pages/Work'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Experience = lazy(() => import('./pages/Experience'))
const Architecture = lazy(() => import('./pages/Architecture'))
const Research = lazy(() => import('./pages/Research'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
function Metadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const page = pathname.split('/')[1]
    document.title = page
      ? `${page.charAt(0).toUpperCase() + page.slice(1)} — Vedansh Airen`
      : 'Vedansh Airen — Software Engineer'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Vedansh Airen — software engineer building full-stack applications, enterprise AI, healthcare software, automation, and immersive research systems.',
      )
  }, [pathname])
  return null
}
export default function App() {
  return (
    <HashRouter>
      <Metadata />
      <Suspense
        fallback={
          <div className="page-loading" role="status">
            Loading portfolio…
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="work" element={<Work />} />
            <Route path="work/:id" element={<ProjectDetail />} />
            <Route path="experience" element={<Experience />} />
            <Route path="architecture" element={<Architecture />} />
            <Route path="research" element={<Research />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
