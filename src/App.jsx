import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Planning from './pages/Planning.jsx'
import Biens from './pages/Biens.jsx'
import ApartmentDetail from './pages/ApartmentDetail.jsx'
import Payments from './pages/Payments.jsx'

// Remet le scroll en haut à chaque changement de page (évite que le
// compositeur mobile garde des tuiles d'affichage de la page précédente).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendrier" element={<Planning />} />
        <Route path="/biens" element={<Biens />} />
        <Route path="/biens/:id" element={<ApartmentDetail />} />
        <Route path="/paiements" element={<Payments />} />
      </Routes>
    </Layout>
  )
}
