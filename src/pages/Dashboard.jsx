import { Link } from 'react-router-dom'
import {
  units, bookings, payments, dashboardStats, unitStatus, unitById,
  unitLabel, nextBookingFor, establishment, fcfa, fcfaCompact, formatDate, formatLong, TODAY,
} from '../data/mock.js'
import { Card, OccupancyBadge, PaymentBadge, UnitCover } from '../components/ui.jsx'
import {
  IconTrend, IconWallet, IconBuilding, IconArrowUp, IconArrowRight,
  IconLogin, IconAlert, IconUsers,
} from '../components/icons.jsx'

function StatCard({ icon: Icon, tint, label, value, sub, trend }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}>
          <Icon width={22} height={22} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
            <IconArrowUp width={13} height={13} /> {trend}
          </span>
        )}
      </div>
      <div className="mt-4 min-w-0 break-words font-display text-xl font-extrabold leading-none tracking-tight text-ink-900 sm:text-[26px]">
        {value}
      </div>
      <div className="mt-1.5 text-sm font-medium text-ink-500">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-400">{sub}</div>}
    </Card>
  )
}

function OccupancyRing({ value }) {
  const r = 42
  const c = 2 * Math.PI * r
  const off = c - (value / 100) * c
  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="url(#g)" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-extrabold text-ink-900">{value}%</div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-ink-400">occupé</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const s = dashboardStats()

  const upcoming = bookings
    .filter((b) => b.status !== 'blocked' && b.start >= TODAY)
    .sort((a, b) => a.start - b.start)
    .slice(0, 4)

  const alerts = payments.filter((p) => p.status === 'late')

  return (
    <div>
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl">
        <img src={establishment.hero} alt={establishment.name} fetchPriority="high" decoding="async" className="h-40 w-full object-cover sm:h-52" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/55 to-ink-900/10" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
          <p className="text-xs font-medium text-white/70">{formatLong(TODAY)}</p>
          <h1 className="mt-0.5 font-display text-xl font-extrabold tracking-tight text-white sm:text-3xl">
            Bonjour, Étienne 👋
          </h1>
          <p className="mt-1 max-w-md text-sm text-white/85">
            <span className="font-semibold text-white">{establishment.name}</span> — {establishment.neighborhood}, {establishment.city}
          </p>
        </div>
      </div>

      {/* Cards statistiques */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={IconTrend} tint="bg-brand-50 text-brand-600"
          label="Taux d'occupation" value={`${s.occupancy}%`}
          sub="30 prochains jours" trend="+6 pts"
        />
        <StatCard
          icon={IconWallet} tint="bg-indigo-50 text-indigo-600"
          label="Revenu du mois" value={fcfaCompact(s.revenue)}
          sub={`${fcfa(s.revenue)} · ${formatDate(TODAY, { month: 'long' })}`} trend="+12%"
        />
        <StatCard
          icon={IconBuilding} tint="bg-emerald-50 text-emerald-600"
          label="Logements occupés" value={`${s.activeCount} / ${s.total}`}
          sub="Clients sur place"
        />
        <StatCard
          icon={IconUsers} tint="bg-amber-50 text-amber-600"
          label="Unités disponibles" value={s.vacantCount}
          sub="Libres à louer"
        />
      </div>

      {/* Bloc occupation + alertes + check-ins */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="flex items-center gap-5 p-5">
          <OccupancyRing value={s.occupancy} />
          <div>
            <h3 className="font-display text-base font-bold text-ink-900">Occupation de la résidence</h3>
            <p className="mt-1 text-sm text-ink-500">
              {s.bookedNights} nuits réservées sur {s.totalNights} disponibles ces 30 jours.
            </p>
            <div className="mt-3 flex gap-4 text-sm">
              <div>
                <div className="font-display text-lg font-bold text-brand-600">{s.activeCount}</div>
                <div className="text-xs text-ink-400">occupées</div>
              </div>
              <div>
                <div className="font-display text-lg font-bold text-amber-500">{s.vacantCount}</div>
                <div className="text-xs text-ink-400">libres</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Alertes paiements */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink-900">Alertes paiement</h3>
            <Link to="/paiements" className="text-xs font-semibold text-brand-600 hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {alerts.length === 0 && (
              <p className="text-sm text-ink-400">Aucun retard. Tout est à jour ✅</p>
            )}
            {alerts.map((p) => {
              const u = unitById(p.unitId)
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-rose-50/60 p-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-600">
                    <IconAlert width={18} height={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink-900">{p.guest}</div>
                    <div className="truncate text-xs text-ink-400">N°{u.number} · {u.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-rose-600">{fcfa(p.amount)}</div>
                    <PaymentBadge status={p.status} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Prochains check-ins */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink-900">Prochains check-ins</h3>
            <Link to="/calendrier" className="text-xs font-semibold text-brand-600 hover:underline">
              Planning
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {upcoming.map((b) => {
              const u = unitById(b.unitId)
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <IconLogin width={17} height={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink-900">{b.guest}</div>
                    <div className="truncate text-xs text-ink-400">N°{u.number} · {unitLabel(u)}</div>
                  </div>
                  <div className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-ink-700">
                    {formatDate(b.start)}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Aperçu des logements */}
      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink-900">Vos logements</h2>
        <Link to="/biens" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
          Voir tout <IconArrowRight width={16} height={16} />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {units.slice(0, 6).map((u) => {
          const status = unitStatus(u.id)
          const next = nextBookingFor(u.id)
          return (
            <Link key={u.id} to={`/biens/${u.id}`}>
              <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                <UnitCover unit={u} className="h-28">
                  <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-0.5 text-xs font-bold text-ink-900">
                    N°{u.number}
                  </span>
                  <div className="absolute right-3 top-3">
                    <OccupancyBadge status={status} />
                  </div>
                </UnitCover>
                <div className="p-4">
                  <div className="font-display text-sm font-bold text-ink-900">{unitLabel(u)}</div>
                  <div className="mt-0.5 text-xs text-ink-400">{u.area} m² · {['Rez-de-chaussée','1er étage','2e étage','3e étage'][u.floor]}</div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-sm font-bold text-brand-700">{fcfa(u.nightly)}<span className="text-xs font-normal text-ink-400">/nuit</span></span>
                    {next && <span className="text-xs text-ink-400">Prochain : {formatDate(next.start)}</span>}
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
