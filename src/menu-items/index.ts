export interface NavItem {
  id:    string
  label: string
  path:  string
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'home',     label: 'Home',     path: '/'         },
  { id: 'trips',    label: 'Trips',    path: '/trips'    },
  { id: 'settings', label: 'Settings', path: '/settings' },
]
