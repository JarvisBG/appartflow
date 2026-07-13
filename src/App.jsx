import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Planning from './pages/Planning.jsx'
import Biens from './pages/Biens.jsx'
import ApartmentDetail from './pages/ApartmentDetail.jsx'
import Payments from './pages/Payments.jsx'

export default function App() {
  return (
    <Layout>
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
