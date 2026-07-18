import { NavLink, useLocation } from 'react-router-dom'
import { IconGrid, IconCalendar, IconBuilding, IconWallet, IconLogout } from './icons.jsx'
import { establishment } from '../data/mock.js'

const nav = [
  { to: '/', label: 'Tableau de bord', icon: IconGrid, end: true },
  { to: '/calendrier', label: 'Planning', icon: IconCalendar },
  { to: '/biens', label: 'Logements', icon: IconBuilding },
  { to: '/paiements', label: 'Paiements', icon: IconWallet },
]

function Logo({ compact }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20V10l8-6 8 6v10h-6v-6H10v6z" />
        </svg>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display text-[17px] font-extrabold tracking-tight text-ink-900">
            Appart<span className="text-brand-600">Flow</span>
          </div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-ink-400">by loJIC Solutions</div>
        </div>
      )}
    </div>
  )
}

function NavItem({ item, onClick }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
            : 'text-ink-500 hover:bg-brand-50 hover:text-brand-700'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={isActive ? 'text-white' : 'text-ink-400 group-hover:text-brand-600'} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200/80 bg-white px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo />
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1.5">
          {nav.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
          <p className="text-xs font-semibold opacity-90">{establishment.name}</p>
          <p className="mt-1 text-sm font-bold">{establishment.manager}</p>
          <p className="text-[11px] opacity-80">{establishment.neighborhood}, {establishment.city}</p>
        </div>

        <button className="mt-3 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-slate-50">
          <IconLogout className="text-ink-400" /> Déconnexion
        </button>
      </aside>

      {/* Topbar — mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 lg:hidden">
        <Logo />
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Démo</span>
      </header>

      {/* Contenu — fond opaque, pas de stacking context forcé (les hacks de
          compositing provoquaient la corruption d'affichage sur Android) */}
      <main className="min-h-screen bg-canvas pb-24 lg:pl-64">
        <div key={location.pathname} className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>

      {/* Bottom nav — mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {nav.map((item) => {
          const Icon = item.icon
          const isActive = item.end
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-brand-600' : 'text-ink-400'
              }`}
            >
              <Icon width={22} height={22} />
              {item.label.split(' ')[0]}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
