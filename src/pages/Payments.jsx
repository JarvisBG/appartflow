import { Link } from 'react-router-dom'
import { payments, unitById, unitLabel, fcfa, formatDate, daysBetween, TODAY } from '../data/mock.js'
import { PageHeader, Card, PaymentBadge } from '../components/ui.jsx'
import { IconClock, IconAlert, IconCheck, IconArrowRight } from '../components/icons.jsx'

function methodStyle(method) {
  if (method.includes('MTN')) return 'bg-yellow-50 text-yellow-700'
  if (method.includes('Orange')) return 'bg-orange-50 text-orange-700'
  if (method.includes('Espèces')) return 'bg-emerald-50 text-emerald-700'
  return 'bg-slate-100 text-slate-600'
}

export default function Payments() {
  const collected = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const lateTotal = payments.filter((p) => p.status === 'late').reduce((s, p) => s + p.amount, 0)
  const lateCount = payments.filter((p) => p.status === 'late').length

  const order = { late: 0, pending: 1, paid: 2 }
  const sorted = [...payments].sort((a, b) => order[a.status] - order[b.status])

  return (
    <div>
      <PageHeader
        title="Suivi des paiements"
        subtitle="Séjours en cours et à venir — encaissements et relances."
      />

      {/* Résumé */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryTile
          icon={IconCheck} tint="bg-emerald-50 text-emerald-600"
          label="Encaissé ce mois" value={fcfa(collected)}
          sub={`${payments.filter((p) => p.status === 'paid').length} séjours réglés`}
        />
        <SummaryTile
          icon={IconClock} tint="bg-slate-100 text-slate-500"
          label="En attente" value={fcfa(pending)} sub="À encaisser au check-out"
        />
        <SummaryTile
          icon={IconAlert} tint="bg-rose-50 text-rose-600"
          label="En retard" value={fcfa(lateTotal)}
          sub={`${lateCount} client${lateCount > 1 ? 's' : ''} à relancer`}
          alert={lateCount > 0}
        />
      </div>

      {/* Cards clients */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p) => {
          const unit = unitById(p.unitId)
          const diff = daysBetween(TODAY, p.dueDate)
          const isLate = p.status === 'late'
          return (
            <Card key={p.id} className={`overflow-hidden ${isLate ? 'ring-1 ring-rose-200' : ''}`}>
              {/* En-tête logement */}
              <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white" style={{ background: unit.cover }}>
                  {unit.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-sm font-bold text-ink-900">{p.guest}</div>
                  <div className="truncate text-xs text-ink-400">{unitLabel(unit)}</div>
                </div>
                <PaymentBadge status={p.status} />
              </div>

              {/* Corps */}
              <div className="p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs text-ink-400">Montant du séjour · {p.nights} nuits</div>
                    <div className="font-display text-xl font-extrabold text-ink-900">{fcfa(p.amount)}</div>
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${methodStyle(p.method)}`}>
                    {p.method}
                  </span>
                </div>

                {/* Échéance */}
                <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                  p.status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700'
                    : isLate
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-slate-50 text-ink-500'
                }`}>
                  <IconClock width={14} height={14} />
                  {p.status === 'paid'
                    ? `Réglé le ${formatDate(p.dueDate)}`
                    : isLate
                    ? `En retard de ${Math.abs(diff)} jour${Math.abs(diff) > 1 ? 's' : ''} (échéance ${formatDate(p.dueDate)})`
                    : `Échéance le ${formatDate(p.dueDate)} · dans ${diff} jour${diff > 1 ? 's' : ''}`}
                </div>

                {/* Action */}
                {isLate ? (
                  <button className="mt-3 w-full rounded-xl bg-rose-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700">
                    Envoyer une relance
                  </button>
                ) : p.status === 'pending' ? (
                  <button className="mt-3 w-full rounded-xl bg-brand-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
                    Marquer comme payé
                  </button>
                ) : (
                  <Link to={`/biens/${unit.id}`} className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-slate-50 py-2 text-sm font-semibold text-ink-600 transition-colors hover:bg-slate-100">
                    Voir le logement <IconArrowRight width={15} height={15} />
                  </Link>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SummaryTile({ icon: Icon, tint, label, value, sub, alert }) {
  return (
    <Card className={`p-5 ${alert ? 'ring-1 ring-rose-100' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
          <Icon width={20} height={20} />
        </div>
        <div>
          <div className="text-sm font-medium text-ink-500">{label}</div>
          <div className="font-display text-xl font-extrabold text-ink-900">{value}</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-ink-400">{sub}</div>
    </Card>
  )
}
