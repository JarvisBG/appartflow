// Icônes SVG inline — trait fin, cohérentes, sans dépendance externe.
const base = {
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
}

export const IconGrid = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
)
export const IconCalendar = (p) => (
  <svg {...base} {...p}><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 3v3M16 3v3"/></svg>
)
export const IconBuilding = (p) => (
  <svg {...base} {...p}><path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15"/><path d="M14 9h4a2 2 0 0 1 2 2v10"/><path d="M8 8h2M8 12h2M8 16h2M17 13h1M17 17h1M3 21h18"/></svg>
)
export const IconWallet = (p) => (
  <svg {...base} {...p}><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1"/><path d="M3 7.5V17a2.5 2.5 0 0 0 2.5 2.5H19a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 1 3 7.5Z"/><circle cx="16.5" cy="12.5" r="1.2" fill="currentColor" stroke="none"/></svg>
)
export const IconPin = (p) => (
  <svg {...base} {...p}><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
)
export const IconArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
)
export const IconArrowUp = (p) => (
  <svg {...base} {...p}><path d="M12 19V5M6 11l6-6 6 6"/></svg>
)
export const IconLogin = (p) => (
  <svg {...base} {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>
)
export const IconLogout = (p) => (
  <svg {...base} {...p}><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>
)
export const IconCheck = (p) => (
  <svg {...base} {...p}><path d="M20 6 9 17l-5-5"/></svg>
)
export const IconAlert = (p) => (
  <svg {...base} {...p}><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
)
export const IconClock = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
)
export const IconStar = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="m12 2 2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2Z"/></svg>
)
export const IconUsers = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 20a5.5 5.5 0 0 0-3-4.9"/></svg>
)
export const IconTrend = (p) => (
  <svg {...base} {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/></svg>
)
export const IconBed = (p) => (
  <svg {...base} {...p}><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18v-3h18v3M3 18v2M21 18v2"/><path d="M7 10V8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2"/></svg>
)
export const IconRuler = (p) => (
  <svg {...base} {...p}><rect x="2.5" y="8" width="19" height="8" rx="2" transform="rotate(0 12 12)"/><path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4"/></svg>
)
export const IconWifi = (p) => (
  <svg {...base} {...p}><path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>
)
export const IconPhone = (p) => (
  <svg {...base} {...p}><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>
)
