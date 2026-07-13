import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  units, unitStatus, unitLabel, floorLabel, nextBookingFor, currentBookingFor,
  establishment, fcfa, formatDate,
} from '../data/mock.js'
import { PageHeader, Card, OccupancyBadge, UnitCover } from '../components/ui.jsx'
import { IconBed, IconRuler, IconStar } from '../components/icons.jsx'

const filters = ['Tous', 'Disponibles', 'Occupés', 'Chambre', 'Studio', 'Appartement', 'Suite']

export default function Biens() {
  const [filter, setFilter] = useState('Tous')

  const list = units.filter((u) => {
    const status = unitStatus(u.id)
    if (filter === 'Occupés') return status === 'occupé'
    if (filter === 'Disponibles') return status === 'vacant'
    if (['Chambre', 'Studio', 'Appartement', 'Suite'].includes(filter)) return u.category === filter
    return true
  })

  return (
    <div>
      <PageHeader
        title="Logements"
        subtitle={`${units.length} unités · ${establishment.name}, ${establishment.neighborhood}.`}
      />

      {/* Filtres */}
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === f
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'bg-white text-ink-500 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((u) => {
          const status = unitStatus(u.id)
          const next = nextBookingFor(u.id)
          const current = currentBookingFor(u.id)
          return (
            <Link key={u.id} to={`/biens/${u.id}`}>
              <Card className="group h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
                <UnitCover unit={u} className="h-36">
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-0.5 text-xs font-bold text-ink-900">
                    N°{u.number}
                  </span>
                  <div className="absolute right-3 top-3">
                    <OccupancyBadge status={status} />
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-ink-900">
                    <IconStar width={13} height={13} className="text-amber-400" /> {u.rating}
                  </div>
                </UnitCover>
                <div className="p-4">
                  <div className="font-display text-[15px] font-bold text-ink-900">{unitLabel(u)}</div>
                  <div className="mt-0.5 text-xs text-ink-400">{floorLabel(u.floor)}</div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1"><IconBed width={15} height={15} /> {u.beds} couchage{u.beds > 1 ? 's' : ''}</span>
                    <span className="inline-flex items-center gap-1"><IconRuler width={15} height={15} /> {u.area} m²</span>
                  </div>

                  <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
                    <div>
                      <span className="font-display text-lg font-extrabold text-brand-700">{fcfa(u.nightly)}</span>
                      <span className="text-xs text-ink-400">/nuit</span>
                    </div>
                    <div className="text-right text-xs text-ink-400">
                      {current
                        ? <>Occupé jusqu'au<br /><span className="font-semibold text-ink-600">{formatDate(current.end)}</span></>
                        : next
                        ? <>Réservé dès<br /><span className="font-semibold text-ink-600">{formatDate(next.start)}</span></>
                        : <span className="font-semibold text-amber-600">Libre maintenant</span>}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
