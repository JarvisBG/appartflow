import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  units, bookings, unitLabel, floorLabel, TODAY, addDays, daysBetween, fcfa,
} from '../data/mock.js'
import { PageHeader, Card, UnitCover } from '../components/ui.jsx'

const DAYS = 30
const COL = 46
const LABEL = 210

const statusStyle = {
  inhouse: { bg: 'linear-gradient(135deg,#0d9488,#0f766e)', text: '#fff', label: 'Sur place' },
  confirmed: { bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', text: '#fff', label: 'Confirmé' },
  blocked: {
    bg: 'repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0 6px,#f1f5f9 6px,#f1f5f9 12px)',
    text: '#64748b', label: 'Bloqué',
  },
}

const WD = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export default function Planning() {
  const days = useMemo(() => Array.from({ length: DAYS }, (_, i) => addDays(TODAY, i)), [])
  const [hover, setHover] = useState(null)

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

  // Insère une bande "étage" avant la 1re unité de chaque étage
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
        <div className="overflow-x-auto thin-scroll">
          <div style={{ minWidth: LABEL + gridWidth }}>
            {/* En-tête mois */}
            <div className="flex border-b border-slate-100">
              <div className="shrink-0 border-r border-slate-100" style={{ width: LABEL }} />
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
                className="flex shrink-0 items-center border-r border-slate-100 px-4 text-xs font-semibold text-ink-500"
                style={{ width: LABEL }}
              >
                Logement / Jour
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
            {units.map((u) => {
              const rowBookings = bookings.filter((b) => b.unitId === u.id)
              const showFloor = u.floor !== lastFloor
              lastFloor = u.floor
              return (
                <div key={u.id}>
                  {showFloor && (
                    <div
                      className="sticky left-0 bg-slate-50/80 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-400"
                      style={{ width: LABEL + gridWidth }}
                    >
                      {floorLabel(u.floor)}
                    </div>
                  )}
                  <div className="flex border-b border-slate-100">
                    {/* Label unité */}
                    <div
                      className="sticky left-0 z-10 flex shrink-0 items-center gap-3 border-r border-slate-100 bg-white px-4 py-3"
                      style={{ width: LABEL }}
                    >
                      <UnitCover unit={u} className="h-9 w-9 shrink-0" rounded="rounded-lg" />
                      <div className="min-w-0">
                        <Link to={`/biens/${u.id}`} className="flex items-center gap-1.5 truncate text-sm font-semibold text-ink-900 hover:text-brand-600">
                          <span className="rounded bg-slate-100 px-1 text-xs font-bold text-ink-600">{u.number}</span>
                          {u.category}
                        </Link>
                        <div className="truncate text-xs text-ink-400">{u.tier} · {u.area} m²</div>
                      </div>
                    </div>

                    {/* Zone planning */}
                    <div className="relative" style={{ width: gridWidth, height: 60 }}>
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
                          <div
                            key={b.id}
                            onMouseEnter={() => setHover(b.id)}
                            onMouseLeave={() => setHover(null)}
                            className="absolute top-1/2 flex -translate-y-1/2 cursor-default items-center overflow-visible rounded-lg px-2 text-xs font-semibold shadow-sm transition-transform hover:z-20 hover:scale-[1.015]"
                            style={{
                              left: from * COL + 3,
                              width: (to - from) * COL - 6,
                              height: 40,
                              background: st.bg,
                              color: st.text,
                              borderTopLeftRadius: clippedLeft ? 0 : 8,
                              borderBottomLeftRadius: clippedLeft ? 0 : 8,
                              borderTopRightRadius: clippedRight ? 0 : 8,
                              borderBottomRightRadius: clippedRight ? 0 : 8,
                            }}
                            title={`${b.guest} · ${nights} nuit(s) · ${b.channel}`}
                          >
                            <span className="truncate">{b.guest}</span>
                            {hover === b.id && (
                              <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-48 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-lg">
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
                          </div>
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
        ← Faites glisser pour voir tout le mois →
      </p>
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
