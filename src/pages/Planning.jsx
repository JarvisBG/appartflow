import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  units, bookings, unitById, unitLabel, floorLabel, TODAY, addDays, daysBetween, fcfa,
} from '../data/mock.js'
import { PageHeader, Card, UnitCover, ChannelTag } from '../components/ui.jsx'

const DAYS = 30

const statusStyle = {
  inhouse: { bg: 'linear-gradient(135deg,#0d9488,#0f766e)', text: '#fff', label: 'Sur place' },
  confirmed: { bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', text: '#fff', label: 'Confirmé' },
  blocked: {
    bg: 'repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0 6px,#f1f5f9 6px,#f1f5f9 12px)',
    text: '#64748b', label: 'Bloqué',
  },
}

const WD = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

// Suit la media query pour adapter les dimensions du planning au tactile
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia('(max-width: 640px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setMobile(mq.matches)
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return mobile
}

export default function Planning() {
  const isMobile = useIsMobile()
  const COL = isMobile ? 40 : 46
  const LABEL = isMobile ? 128 : 210
  const ROW = isMobile ? 52 : 60

  const days = useMemo(() => Array.from({ length: DAYS }, (_, i) => addDays(TODAY, i)), [])
  const [hover, setHover] = useState(null)
  const [selected, setSelected] = useState(null) // réservation ouverte en fiche (tap mobile)

  const monthSpans = useMemo(() => {
    const spans = []
    days.forEach((d) => {
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const last = spans[spans.length - 1]
      if (last && last.key === key) last.count++
      else spans.push({ key, count: 1, label: new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(d) })
    })
    return spans
  }, [days])

  const gridWidth = DAYS * COL
  let lastFloor = null

  return (
    <div>
      <PageHeader
        title="Planning des réservations"
        subtitle={`${units.length} logements de la résidence sur les 30 prochains jours.`}
        action={
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Legend color="#0d9488" label="Sur place" />
            <Legend color="#6366f1" label="Confirmé" />
            <Legend striped label="Bloqué" />
            <Legend ring label="Aujourd'hui" />
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain bg-white thin-scroll">
          <div className="bg-white" style={{ minWidth: LABEL + gridWidth }}>
            {/* En-tête mois */}
            <div className="flex border-b border-slate-100">
              <div className="sticky left-0 z-20 shrink-0 border-r border-slate-100 bg-white" style={{ width: LABEL }} />
              <div className="flex">
                {monthSpans.map((m) => (
                  <div
                    key={m.key}
                    className="border-r border-slate-100 px-3 py-1.5 text-xs font-bold capitalize text-ink-700"
                    style={{ width: m.count * COL }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* En-tête jours */}
            <div className="flex border-b border-slate-200 bg-slate-50/60">
              <div
                className="sticky left-0 z-20 flex shrink-0 items-center border-r border-slate-100 bg-slate-50 px-3 text-xs font-semibold text-ink-500"
                style={{ width: LABEL }}
              >
                {isMobile ? 'Logement' : 'Logement / Jour'}
              </div>
              {days.map((d, i) => {
                const isToday = i === 0
                const weekend = d.getDay() === 0 || d.getDay() === 6
                return (
                  <div
                    key={i}
                    className={`shrink-0 border-r border-slate-100 py-1.5 text-center ${weekend ? 'bg-slate-100/70' : ''}`}
                    style={{ width: COL }}
                  >
                    <div className="text-[10px] font-medium text-ink-400">{WD[d.getDay()]}</div>
                    <div
                      className={`mx-auto mt-0.5 grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                        isToday ? 'bg-brand-600 text-white' : 'text-ink-700'
                      }`}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Lignes des unités (groupées par étage) */}
            {units.map((u, ui) => {
              const rowBookings = bookings.filter((b) => b.unitId === u.id)
              const showFloor = u.floor !== lastFloor
              lastFloor = u.floor
              // Moitié basse de la grille : la bulle de survol s'ouvre vers le
              // haut pour ne pas être coupée par le bas du conteneur défilant.
              const tipAbove = ui >= units.length / 2
              return (
                <div key={u.id}>
                  {showFloor && (
                    <div className="flex border-b border-slate-100 bg-slate-50">
                      {/* libellé d'étage dans la colonne sticky standard (gauche) */}
                      <div
                        className="sticky left-0 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-400"
                        style={{ width: LABEL }}
                      >
                        {floorLabel(u.floor)}
                      </div>
                    </div>
                  )}
                  <div className="flex border-b border-slate-100">
                    {/* Label unité */}
                    <div
                      className="sticky left-0 z-10 flex shrink-0 items-center gap-2.5 border-r border-slate-100 bg-white px-3 py-2"
                      style={{ width: LABEL }}
                    >
                      {!isMobile && <UnitCover unit={u} className="h-9 w-9 shrink-0" rounded="rounded-lg" />}
                      <div className="min-w-0">
                        <Link to={`/biens/${u.id}`} className="flex items-center gap-1.5 truncate text-sm font-semibold text-ink-900 hover:text-brand-600">
                          <span className="rounded bg-slate-100 px-1 text-xs font-bold text-ink-600">{u.number}</span>
                          <span className="truncate">{u.category}</span>
                        </Link>
                        <div className="truncate text-xs text-ink-400">
                          {isMobile ? u.tier : `${u.tier} · ${u.area} m²`}
                        </div>
                      </div>
                    </div>

                    {/* Zone planning */}
                    <div className="relative" style={{ width: gridWidth, height: ROW }}>
                      <div className="absolute inset-0 flex">
                        {days.map((d, i) => {
                          const weekend = d.getDay() === 0 || d.getDay() === 6
                          return (
                            <div
                              key={i}
                              className={`border-r border-slate-100 ${weekend ? 'bg-slate-50/70' : ''} ${i === 0 ? 'bg-brand-50/40' : ''}`}
                              style={{ width: COL }}
                            />
                          )
                        })}
                      </div>

                      {rowBookings.map((b) => {
                        const startOff = daysBetween(TODAY, b.start)
                        const endOff = daysBetween(TODAY, b.end)
                        const from = Math.max(0, startOff)
                        const to = Math.min(DAYS, endOff)
                        if (to <= 0 || from >= DAYS) return null
                        const st = statusStyle[b.status]
                        const nights = daysBetween(b.start, b.end)
                        const clippedLeft = startOff < 0
                        const clippedRight = endOff > DAYS
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onMouseEnter={() => !isMobile && setHover(b.id)}
                            onMouseLeave={() => !isMobile && setHover(null)}
                            onClick={() => setSelected(selected?.id === b.id ? null : b)}
                            className={`absolute top-1/2 flex -translate-y-1/2 cursor-pointer items-center rounded-lg px-2 text-left text-xs font-semibold shadow-sm active:opacity-85 ${
                              hover === b.id ? 'z-30' : ''
                            }`}
                            style={{
                              left: from * COL + 3,
                              width: (to - from) * COL - 6,
                              height: ROW - 16,
                              background: st.bg,
                              color: st.text,
                              borderTopLeftRadius: clippedLeft ? 0 : 8,
                              borderBottomLeftRadius: clippedLeft ? 0 : 8,
                              borderTopRightRadius: clippedRight ? 0 : 8,
                              borderBottomRightRadius: clippedRight ? 0 : 8,
                            }}
                            title={`${b.guest} · ${nights} nuit(s) · ${b.channel}`}
                          >
                            <span className="min-w-0 flex-1 truncate">{b.guest}</span>
                            {!isMobile && hover === b.id && (
                              <div
                                className={`pointer-events-none absolute left-1/2 z-30 w-48 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-lg ${
                                  tipAbove ? 'bottom-full mb-2' : 'top-full mt-2'
                                }`}
                              >
                                <div className="text-sm font-bold text-ink-900">{b.guest}</div>
                                <div className="mt-1 text-xs text-ink-500">
                                  {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(b.start)} →{' '}
                                  {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(b.end)}
                                </div>
                                <div className="mt-1.5 flex items-center justify-between">
                                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{b.channel}</span>
                                  <span className="text-xs font-bold text-brand-700">
                                    {b.status === 'blocked' ? st.label : fcfa(nights * u.nightly)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <p className="mt-3 text-center text-xs text-ink-400 lg:hidden">
        ← Faites glisser le planning · touchez une réservation pour le détail →
      </p>

      {/* Fiche réservation (tap) — au-dessus de la nav mobile */}
      {selected && <BookingSheet booking={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function BookingSheet({ booking: b, onClose }) {
  const u = unitById(b.unitId)
  const st = statusStyle[b.status]
  const nights = daysBetween(b.start, b.end)
  const fmt = (d) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(d)
  return (
    <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-md lg:bottom-6 lg:right-6 lg:left-auto lg:mx-0 lg:w-96">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold"
              style={{ background: st.bg, color: st.text }}
            >
              {u.number}
            </span>
            <div>
              <div className="font-display text-sm font-bold text-ink-900">{b.guest}</div>
              <div className="text-xs text-ink-400">{unitLabel(u)} · {floorLabel(u.floor)}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-ink-500 hover:bg-slate-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
          <span className="font-semibold text-ink-700">{fmt(b.start)} → {fmt(b.end)}</span>
          <span className="text-xs text-ink-400">{nights} nuit{nights > 1 ? 's' : ''}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChannelTag channel={b.channel} />
            <span className="text-xs font-semibold" style={{ color: b.status === 'blocked' ? '#64748b' : '#0f766e' }}>
              {st.label}
            </span>
          </div>
          <span className="font-display text-base font-extrabold text-brand-700">
            {b.status === 'blocked' ? '—' : fcfa(nights * u.nightly)}
          </span>
        </div>
        <Link
          to={`/biens/${u.id}`}
          className="mt-3 block rounded-xl bg-brand-600 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700"
        >
          Voir le logement
        </Link>
      </div>
    </div>
  )
}

function Legend({ color, striped, ring, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-500">
      <span
        className="h-3 w-3 rounded"
        style={
          striped
            ? { background: 'repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0 3px,#f1f5f9 3px,#f1f5f9 6px)' }
            : ring
            ? { border: '2px solid #0d9488', background: '#f0fdfa' }
            : { background: color }
        }
      />
      {label}
    </span>
  )
}
