// Petits composants d'UI réutilisés sur plusieurs pages.
import { useUnitPhotos } from '../data/photoStore.js'

// Vignette d'une unité : photo uploadée > photo intégrée > dégradé placeholder.
export function UnitCover({ unit, className = '', rounded = '', children, style }) {
  const uploaded = useUnitPhotos(unit.id)
  const src = uploaded[0] || (unit.photos && unit.photos[0])
  const bg = src
    ? { backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: unit.cover }
  return (
    <div className={`relative ${rounded} ${className}`} style={{ ...bg, ...style }}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 ${className}`}>
      {children}
    </div>
  )
}

// Statut d'un bien : occupé / vacant
export function OccupancyBadge({ status }) {
  const occ = status === 'occupé'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        occ ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${occ ? 'bg-brand-500' : 'bg-amber-500'}`} />
      {occ ? 'Occupé' : 'Disponible'}
    </span>
  )
}

// Statut d'un paiement : paid / late / pending
const payStyles = {
  paid: { label: 'Payé', cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  late: { label: 'En retard', cls: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
  pending: { label: 'À venir', cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
}

export function PaymentBadge({ status }) {
  const s = payStyles[status] ?? payStyles.pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

// Pastille de canal (Airbnb, Booking, Direct…)
export function ChannelTag({ channel }) {
  return (
    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
      {channel}
    </span>
  )
}
