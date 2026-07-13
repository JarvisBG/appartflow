// ─────────────────────────────────────────────────────────────
//  AppartFlow — données mockées (démo)
//  UN établissement : une résidence à Yaoundé qui loue ses
//  chambres / studios / appartements À LA NUIT.
//  Montants en FCFA · dates relatives à "aujourd'hui".
// ─────────────────────────────────────────────────────────────

export const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

export function addDays(base, n) {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  d.setHours(0, 0, 0, 0)
  return d
}

export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000)
}

const NF = new Intl.NumberFormat('fr-FR')
export function fcfa(n) {
  return `${NF.format(n)} FCFA`
}

// Version compacte pour les petites cards de stats (« 5,8 M FCFA »)
export function fcfaCompact(n) {
  if (n >= 1_000_000) {
    const m = (n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })
    return `${m} M FCFA`
  }
  if (n >= 10_000) return `${Math.round(n / 1000)} k FCFA`
  return fcfa(n)
}

export function formatDate(d, opts = { day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('fr-FR', opts).format(d)
}

export function formatLong(d) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d)
}

export function floorLabel(f) {
  return f === 0 ? 'Rez-de-chaussée' : f === 1 ? '1er étage' : `${f}e étage`
}

// L'établissement géré
export const establishment = {
  name: 'Résidence Les Manguiers',
  city: 'Yaoundé',
  neighborhood: 'Bastos',
  address: 'Rue 1.814, Bastos, Yaoundé',
  manager: 'M. Étienne Ndongo',
  floors: 3,
  hero: '/photos/p13.jpg',
}

// Dégradés placeholder par ambiance (utilisés tant qu'aucune photo n'est uploadée)
const cover = {
  chambre: 'linear-gradient(135deg,#0f766e 0%,#14b8a6 60%,#5eead4 100%)',
  studio: 'linear-gradient(135deg,#0369a1 0%,#0ea5e9 60%,#7dd3fc 100%)',
  appart: 'linear-gradient(135deg,#4338ca 0%,#6366f1 60%,#a5b4fc 100%)',
  suite: 'linear-gradient(135deg,#6d28d9 0%,#8b5cf6 60%,#c4b5fd 100%)',
}

const AM = {
  base: ['Wifi', 'Climatisation', 'Eau chaude', 'Ménage inclus'],
  plus: ['Wifi fibre', 'Climatisation', 'Eau chaude', 'TV câblée', 'Groupe électrogène'],
  premium: ['Wifi fibre', 'Climatisation', 'Cuisine équipée', 'Balcon', 'Groupe électrogène', 'Ménage quotidien'],
}

// ── Les unités (chambres / studios / appartements) ────────────
export const units = [
  // 1er étage
  { id: '101', number: '101', floor: 1, category: 'Chambre',      tier: 'Standard', area: 18, beds: 1, nightly: 18000, cover: cover.chambre, amenities: AM.base,    rating: 4.5, photos: ['/photos/p15.jpg', '/photos/p08.jpg', '/photos/p16.jpg'] },
  { id: '102', number: '102', floor: 1, category: 'Chambre',      tier: 'Confort',  area: 22, beds: 1, nightly: 22000, cover: cover.chambre, amenities: AM.plus,    rating: 4.6, photos: ['/photos/p18.jpg', '/photos/p06.jpg', '/photos/p10.jpg'] },
  { id: '103', number: '103', floor: 1, category: 'Studio',       tier: 'Meublé',   area: 30, beds: 1, nightly: 28000, cover: cover.studio,  amenities: AM.plus,    rating: 4.7, photos: ['/photos/p01.jpg', '/photos/p16.jpg', '/photos/p15.jpg'] },
  { id: '104', number: '104', floor: 1, category: 'Studio',       tier: 'Confort',  area: 34, beds: 1, nightly: 32000, cover: cover.studio,  amenities: AM.plus,    rating: 4.7, photos: ['/photos/p05.jpg', '/photos/p10.jpg', '/photos/p08.jpg'] },

  // 2e étage
  { id: '201', number: '201', floor: 2, category: 'Chambre',      tier: 'Confort',  area: 22, beds: 1, nightly: 22000, cover: cover.chambre, amenities: AM.plus,    rating: 4.5, photos: ['/photos/p09.jpg', '/photos/p12.jpg', '/photos/p16.jpg'] },
  { id: '202', number: '202', floor: 2, category: 'Studio',       tier: 'Meublé',   area: 30, beds: 1, nightly: 28000, cover: cover.studio,  amenities: AM.plus,    rating: 4.6, photos: ['/photos/p02.jpg', '/photos/p05.jpg', '/photos/p10.jpg'] },
  { id: '203', number: '203', floor: 2, category: 'Appartement',  tier: '2 pièces', area: 55, beds: 2, nightly: 45000, cover: cover.appart,  amenities: AM.premium, rating: 4.8, photos: ['/photos/p07.jpg', '/photos/p10.jpg', '/photos/p06.jpg'] },
  { id: '204', number: '204', floor: 2, category: 'Studio',       tier: 'Vue jardin', area: 33, beds: 1, nightly: 33000, cover: cover.studio, amenities: AM.plus,   rating: 4.7, photos: ['/photos/p19.jpg', '/photos/p16.jpg', '/photos/p15.jpg'] },

  // 3e étage
  { id: '301', number: '301', floor: 3, category: 'Appartement',  tier: '2 pièces', area: 58, beds: 2, nightly: 47000, cover: cover.appart,  amenities: AM.premium, rating: 4.8, photos: ['/photos/p04.jpg', '/photos/p03.jpg', '/photos/p10.jpg'] },
  { id: '302', number: '302', floor: 3, category: 'Appartement',  tier: '3 pièces', area: 78, beds: 3, nightly: 60000, cover: cover.appart,  amenities: AM.premium, rating: 4.9, photos: ['/photos/p13.jpg', '/photos/p14.jpg', '/photos/p11.jpg'] },
  { id: '303', number: '303', floor: 3, category: 'Studio',       tier: 'Premium',  area: 36, beds: 1, nightly: 38000, cover: cover.studio,  amenities: AM.premium, rating: 4.8, photos: ['/photos/p08.jpg', '/photos/p19.jpg', '/photos/p16.jpg'] },
  { id: '304', number: '304', floor: 3, category: 'Suite',        tier: 'Standing', area: 90, beds: 3, nightly: 75000, cover: cover.suite,   amenities: AM.premium, rating: 4.9, photos: ['/photos/p11.jpg', '/photos/p13.jpg', '/photos/p14.jpg'] },
]

export function unitLabel(u) {
  return `${u.category} ${u.tier}`
}

// ── Réservations (séjours à la nuit) ──────────────────────────
// status: 'inhouse' (client sur place) · 'confirmed' (à venir) · 'blocked' (ménage/indispo)
const rawBookings = [
  // 101
  { unit: '101', guest: 'Aurélie Nguem',   from: -2, to: 3,  status: 'inhouse',   channel: 'Direct' },
  { unit: '101', guest: 'Paul Ateba',      from: 4,  to: 9,  status: 'confirmed', channel: 'Airbnb' },
  { unit: '101', guest: 'Kevin Toukam',    from: 11, to: 17, status: 'confirmed', channel: 'Booking' },
  { unit: '101', guest: 'Diane Fotso',     from: 20, to: 27, status: 'confirmed', channel: 'Direct' },

  // 102
  { unit: '102', guest: 'Serge Mbarga',    from: -1, to: 5,  status: 'inhouse',   channel: 'Booking' },
  { unit: '102', guest: 'Nadia Kom',       from: 6,  to: 12, status: 'confirmed', channel: 'Airbnb' },
  { unit: '102', guest: 'Aline Manga',     from: 14, to: 21, status: 'confirmed', channel: 'Direct' },
  { unit: '102', guest: 'Boris Eyenga',    from: 23, to: 29, status: 'confirmed', channel: 'Booking' },

  // 103
  { unit: '103', guest: 'Blaise Kamga',    from: 1,  to: 6,  status: 'confirmed', channel: 'Airbnb' },
  { unit: '103', guest: 'Larissa Etoa',    from: 7,  to: 14, status: 'confirmed', channel: 'Booking' },
  { unit: '103', guest: 'Sandra Njoya',    from: 16, to: 23, status: 'confirmed', channel: 'Direct' },
  { unit: '103', guest: 'Hervé Manga',     from: 25, to: 30, status: 'confirmed', channel: 'Airbnb' },

  // 104
  { unit: '104', guest: 'Ménage / maintenance', from: 1, to: 3, status: 'blocked', channel: 'Interne' },
  { unit: '104', guest: 'Yannick Essomba', from: 3,  to: 9,  status: 'confirmed', channel: 'Direct' },
  { unit: '104', guest: 'Régine Abé',      from: 10, to: 16, status: 'confirmed', channel: 'Booking' },
  { unit: '104', guest: 'Franck Ndip',     from: 18, to: 25, status: 'confirmed', channel: 'Airbnb' },

  // 201
  { unit: '201', guest: 'Danielle Ndjock', from: -3, to: 2,  status: 'inhouse',   channel: 'Booking' },
  { unit: '201', guest: 'Clarisse Ntsama', from: 3,  to: 8,  status: 'confirmed', channel: 'Direct' },
  { unit: '201', guest: 'Marlène Bikoi',   from: 10, to: 15, status: 'confirmed', channel: 'Airbnb' },
  { unit: '201', guest: 'Steve Ondoa',     from: 17, to: 24, status: 'confirmed', channel: 'Direct' },

  // 202
  { unit: '202', guest: 'Ophélie Manga',   from: 3,  to: 7,  status: 'confirmed', channel: 'Direct' },
  { unit: '202', guest: 'Fabrice Bell',    from: 9,  to: 15, status: 'confirmed', channel: 'Booking' },
  { unit: '202', guest: 'Christelle Ayissi', from: 18, to: 26, status: 'confirmed', channel: 'Airbnb' },

  // 203
  { unit: '203', guest: 'Rodrigue Abanda', from: -4, to: 4,  status: 'inhouse',   channel: 'Direct' },
  { unit: '203', guest: 'Ariel Tchinda',   from: 6,  to: 13, status: 'confirmed', channel: 'Booking' },
  { unit: '203', guest: 'Famille Fouda',   from: 15, to: 22, status: 'confirmed', channel: 'Direct' },
  { unit: '203', guest: 'Junior Owona',    from: 24, to: 30, status: 'confirmed', channel: 'Airbnb' },

  // 204 : peu réservé (à valoriser)
  { unit: '204', guest: 'Chantal Ngono',   from: 16, to: 22, status: 'confirmed', channel: 'Airbnb' },

  // 301
  { unit: '301', guest: 'Ludovic Fombi',   from: -1, to: 6,  status: 'inhouse',   channel: 'Direct' },
  { unit: '301', guest: 'Sylvie Manga',    from: 8,  to: 14, status: 'confirmed', channel: 'Booking' },
  { unit: '301', guest: 'Nadège Owona',    from: 19, to: 26, status: 'confirmed', channel: 'Direct' },

  // 302
  { unit: '302', guest: 'Grace Nkoulou',   from: 2,  to: 8,  status: 'confirmed', channel: 'Booking' },
  { unit: '302', guest: 'Bruno Talla',     from: 10, to: 17, status: 'confirmed', channel: 'Direct' },
  { unit: '302', guest: 'Estelle Kana',    from: 20, to: 28, status: 'confirmed', channel: 'Airbnb' },

  // 303 : libre tout le mois (à valoriser)

  // 304
  { unit: '304', guest: 'Délégation ENEO', from: -2, to: 7,  status: 'inhouse',   channel: 'Entreprise' },
  { unit: '304', guest: 'M. & Mme Talla',  from: 9,  to: 16, status: 'confirmed', channel: 'Direct' },
  { unit: '304', guest: 'Séminaire MINSANTE', from: 18, to: 27, status: 'confirmed', channel: 'Entreprise' },
]

export const bookings = rawBookings.map((b, i) => ({
  id: `bk-${i}`,
  unitId: b.unit,
  guest: b.guest,
  channel: b.channel,
  status: b.status,
  start: addDays(TODAY, b.from),
  end: addDays(TODAY, b.to),
}))

// ── Statut courant / prochaines réservations (dérivés) ────────
export function currentBookingFor(unitId, ref = TODAY) {
  return bookings.find(
    (b) => b.unitId === unitId && b.status !== 'blocked' && b.start <= ref && b.end > ref,
  )
}

export function nextBookingFor(unitId, ref = TODAY) {
  return bookings
    .filter((b) => b.unitId === unitId && b.status !== 'blocked' && b.start > ref)
    .sort((a, b) => a.start - b.start)[0]
}

export function unitStatus(unitId) {
  return currentBookingFor(unitId) ? 'occupé' : 'vacant'
}

export function unitById(id) {
  return units.find((u) => u.id === id)
}

// ── Statistiques du tableau de bord ───────────────────────────
export function dashboardStats() {
  const active = units.filter((u) => unitStatus(u.id) === 'occupé')
  const vacant = units.filter((u) => unitStatus(u.id) === 'vacant')

  const horizon = 30
  const totalNights = units.length * horizon
  let bookedNights = 0
  bookings.forEach((b) => {
    if (b.status === 'blocked') return
    for (let d = 0; d < horizon; d++) {
      const day = addDays(TODAY, d)
      if (b.start <= day && b.end > day) bookedNights++
    }
  })
  const occupancy = Math.round((bookedNights / totalNights) * 100)

  const monthStart = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)
  const monthEnd = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 1)
  let revenue = 0
  bookings.forEach((b) => {
    if (b.status === 'blocked') return
    const u = unitById(b.unitId)
    const s = b.start < monthStart ? monthStart : b.start
    const e = b.end > monthEnd ? monthEnd : b.end
    const nights = Math.max(0, daysBetween(s, e))
    revenue += nights * u.nightly
  })

  return {
    occupancy,
    revenue,
    activeCount: active.length,
    vacantCount: vacant.length,
    total: units.length,
    bookedNights,
    totalNights,
  }
}

// ── Suivi des paiements (séjours en cours / à venir) ──────────
// status: 'paid' | 'late' | 'pending'
const rawPayments = [
  { unit: '101', guest: 'Aurélie Nguem',   nights: 5, due: -6, status: 'paid',    method: 'MTN MoMo' },
  { unit: '102', guest: 'Serge Mbarga',    nights: 6, due: -1, status: 'late',    method: 'Virement' },
  { unit: '201', guest: 'Danielle Ndjock', nights: 5, due: -8, status: 'paid',    method: 'Orange Money' },
  { unit: '203', guest: 'Rodrigue Abanda', nights: 8, due: -3, status: 'late',    method: 'MTN MoMo' },
  { unit: '301', guest: 'Ludovic Fombi',   nights: 7, due: 2,  status: 'pending', method: 'Espèces' },
  { unit: '304', guest: 'Délégation ENEO', nights: 9, due: 4,  status: 'pending', method: 'Virement' },
]

export const payments = rawPayments.map((p, i) => {
  const u = unitById(p.unit)
  return {
    id: `pay-${i}`,
    unitId: p.unit,
    guest: p.guest,
    nights: p.nights,
    amount: p.nights * u.nightly,
    method: p.method,
    status: p.status,
    dueDate: addDays(TODAY, p.due),
  }
})
