import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  unitById, unitStatus, unitLabel, floorLabel, currentBookingFor, nextBookingFor,
  bookings, payments, establishment, fcfa, formatDate, formatLong, daysBetween, TODAY,
} from '../data/mock.js'
import { useUnitPhotos, addPhotos, removePhoto, fileToDataUrl } from '../data/photoStore.js'
import { Card, OccupancyBadge, PaymentBadge, ChannelTag, smallPhoto } from '../components/ui.jsx'
import {
  IconPin, IconBed, IconRuler, IconStar, IconLogin, IconLogout,
  IconCheck, IconArrowRight, IconWallet, IconBuilding,
} from '../components/icons.jsx'

// ── Galerie : photos intégrées + upload en bonus (localStorage) ──
function Gallery({ unit }) {
  const uploaded = useUnitPhotos(unit.id)
  const baked = unit.photos || []
  const all = [...baked, ...uploaded]
  const [active, setActive] = useState(0)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)
  const current = Math.min(active, Math.max(0, all.length - 1))
  const hasPhotos = all.length > 0

  async function onFiles(e) {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    try {
      const urls = []
      for (const f of files) {
        try { urls.push(await fileToDataUrl(f)) } catch { /* fichier ignoré */ }
      }
      if (urls.length) { addPhotos(unit.id, urls); setActive(baked.length + uploaded.length) }
    } catch {
      alert("Impossible d'enregistrer les photos (stockage du navigateur plein ?).")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />

      {/* Image principale */}
      <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72">
        {hasPhotos ? (
          <img src={all[current]} alt={`Logement ${unit.number}`} decoding="async" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-white" style={{ background: unit.cover }}>
            <IconBuilding width={30} height={30} />
            <p className="mt-2 text-sm font-medium opacity-90">Aucune photo pour ce logement</p>
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm transition hover:bg-white disabled:opacity-60"
        >
          {busy ? 'Ajout…' : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              Ajouter des photos
            </>
          )}
        </button>
      </div>

      {/* Miniatures */}
      <div className="mt-2 flex gap-2 overflow-x-auto thin-scroll">
        {all.map((src, i) => {
          const isUploaded = i >= baked.length
          return (
            <div key={i} className="group relative shrink-0">
              <button
                onClick={() => setActive(i)}
                className={`h-16 w-20 overflow-hidden rounded-xl ring-2 transition ${
                  i === current ? 'ring-brand-500' : 'ring-transparent hover:ring-slate-200'
                }`}
              >
                <img src={smallPhoto(src)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
              {isUploaded && (
                <button
                  onClick={() => { removePhoto(unit.id, i - baked.length); setActive(0) }}
                  className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 place-items-center rounded-full bg-rose-600 text-white shadow group-hover:grid"
                  title="Supprimer cette photo"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              )}
            </div>
          )
        })}
        {/* Tuile d'ajout */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="grid h-16 w-20 shrink-0 place-items-center rounded-xl border-2 border-dashed border-slate-300 text-ink-400 transition hover:border-brand-400 hover:text-brand-500 disabled:opacity-60"
          title="Ajouter vos photos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
    </div>
  )
}

export default function ApartmentDetail() {
  const { id } = useParams()
  const unit = unitById(id)

  if (!unit) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-500">Logement introuvable.</p>
        <Link to="/biens" className="mt-3 inline-block text-brand-600 hover:underline">← Retour aux logements</Link>
      </div>
    )
  }

  const status = unitStatus(unit.id)
  const current = currentBookingFor(unit.id)
  const next = nextBookingFor(unit.id)
  const unitBookings = bookings
    .filter((b) => b.unitId === unit.id && b.status !== 'blocked' && b.end >= TODAY)
    .sort((a, b) => a.start - b.start)
  const payment = payments.find((p) => p.unitId === unit.id)

  const checkIn = current ? current.start : next?.start
  const checkOut = current ? current.end : next?.end

  return (
    <div>
      {/* Fil d'ariane */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-ink-400">
        <Link to="/biens" className="hover:text-brand-600">Logements</Link>
        <IconArrowRight width={14} height={14} />
        <span className="font-medium text-ink-600">N°{unit.number} · {unit.category}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="min-w-0 lg:col-span-2">
          <Gallery unit={unit} />

          {/* Titre */}
          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-brand-600 px-2 py-0.5 font-display text-sm font-bold text-white">N°{unit.number}</span>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">{unitLabel(unit)}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600">
                  <IconStar width={13} height={13} /> {unit.rating}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-sm text-ink-500">
                <IconPin width={16} height={16} /> {establishment.address} · {floorLabel(unit.floor)}
              </div>
            </div>
            <OccupancyBadge status={status} />
          </div>

          {/* Specs */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Spec icon={IconBed} label="Couchages" value={`${unit.beds}`} />
            <Spec icon={IconRuler} label="Surface" value={`${unit.area} m²`} />
            <Spec icon={IconBuilding} label="Étage" value={floorLabel(unit.floor).replace(' étage', '')} />
          </div>

          {/* Équipements */}
          <Card className="mt-5 p-5">
            <h3 className="font-display text-base font-bold text-ink-900">Équipements</h3>
            <div className="mt-3 grid grid-cols-2 gap-y-2.5 sm:grid-cols-3">
              {unit.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-ink-600">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <IconCheck width={13} height={13} />
                  </span>
                  {a}
                </div>
              ))}
            </div>
          </Card>

          {/* Réservations à venir */}
          <Card className="mt-5 p-5">
            <h3 className="font-display text-base font-bold text-ink-900">Réservations à venir</h3>
            <div className="mt-3 space-y-2">
              {unitBookings.length === 0 && <p className="text-sm text-ink-400">Aucune réservation programmée — logement disponible.</p>}
              {unitBookings.map((b) => {
                const nights = daysBetween(b.start, b.end)
                const isNow = current && b.id === current.id
                return (
                  <div key={b.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-lg ${isNow ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink-500'}`}>
                      <IconLogin width={18} height={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-ink-900">{b.guest}</span>
                        <ChannelTag channel={b.channel} />
                        {isNow && <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">EN COURS</span>}
                      </div>
                      <div className="text-xs text-ink-400">
                        {formatDate(b.start)} → {formatDate(b.end)} · {nights} nuit{nights > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-brand-700">{fcfa(nights * unit.nightly)}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="min-w-0 space-y-4">
          {/* Statut actuel */}
          <Card className="overflow-hidden">
            <div className="p-5" style={{ background: unit.cover }}>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/80">Statut actuel</div>
              <div className="mt-1 font-display text-xl font-extrabold text-white">
                {status === 'occupé' ? 'Occupé' : 'Disponible'}
              </div>
              {current && <div className="mt-0.5 text-sm text-white/90">Client : {current.guest}</div>}
            </div>
            <div className="divide-y divide-slate-100">
              <KeyDate icon={IconLogin} label={current ? 'Check-in (en cours)' : 'Prochain check-in'} value={checkIn ? formatLong(checkIn) : '—'} tint="text-brand-600" />
              <KeyDate icon={IconLogout} label="Check-out prévu" value={checkOut ? formatLong(checkOut) : '—'} tint="text-rose-500" />
            </div>
          </Card>

          {/* Tarifs */}
          <Card className="p-5">
            <h3 className="font-display text-base font-bold text-ink-900">Tarification</h3>
            <div className="mt-3 space-y-2 text-sm">
              <Row label="Prix / nuit" value={fcfa(unit.nightly)} strong />
              <Row label="Semaine (7 nuits)" value={fcfa(unit.nightly * 7)} />
              <Row label="Note voyageurs" value={<span className="inline-flex items-center gap-1"><IconStar width={13} height={13} className="text-amber-400" /> {unit.rating} / 5</span>} />
            </div>
          </Card>

          {/* Paiement lié */}
          {payment && (
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-ink-900">Paiement du séjour</h3>
                <PaymentBadge status={payment.status} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-ink-900">{payment.guest}</div>
                  <div className="text-xs text-ink-400">{payment.nights} nuits · via {payment.method}</div>
                </div>
                <div className="font-display text-lg font-extrabold text-ink-900">{fcfa(payment.amount)}</div>
              </div>
              <Link to="/paiements" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
                Voir tous les paiements <IconArrowRight width={15} height={15} />
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Spec({ icon: Icon, label, value }) {
  return (
    <Card className="p-3.5">
      <Icon width={18} height={18} className="text-brand-600" />
      <div className="mt-2 text-xs text-ink-400">{label}</div>
      <div className="font-display text-sm font-bold text-ink-900">{value}</div>
    </Card>
  )
}

function KeyDate({ icon: Icon, label, value, tint }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className={`grid h-9 w-9 place-items-center rounded-lg bg-slate-50 ${tint}`}>
        <Icon width={18} height={18} />
      </span>
      <div>
        <div className="text-xs text-ink-400">{label}</div>
        <div className="text-sm font-semibold capitalize text-ink-900">{value}</div>
      </div>
    </div>
  )
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={strong ? 'font-display text-base font-extrabold text-brand-700' : 'font-semibold text-ink-900'}>{value}</span>
    </div>
  )
}
