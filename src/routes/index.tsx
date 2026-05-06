import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './ProtectedRoute'

const Spinner = () => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#04050d' }} />
)

const load = (factory: () => Promise<{ default: React.ComponentType }>) => {
  const Component = lazy(factory)
  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  // ── Onboarding (public) ──────────────────────────────────
  { path: '/onboarding/welcome',              element: load(() => import('@/pages/onboarding/welcome')) },
  { path: '/onboarding/choose-plan',          element: load(() => import('@/pages/onboarding/choose-plan')) },
  { path: '/onboarding/select-device',        element: load(() => import('@/pages/onboarding/select-device')) },
  { path: '/onboarding/payment',                    element: load(() => import('@/pages/onboarding/payment')) },
  { path: '/onboarding/order-tracking',             element: load(() => import('@/pages/onboarding/order-tracking')) },
  { path: '/onboarding/device-purchase-details',    element: load(() => import('@/pages/onboarding/device-purchase-details')) },
  { path: '/onboarding/add-vehicle',          element: load(() => import('@/pages/onboarding/add-vehicle')) },
  { path: '/onboarding/vehicle-details',      element: load(() => import('@/pages/onboarding/vehicle-details')) },
  { path: '/onboarding/scan-device',          element: load(() => import('@/pages/onboarding/scan-device')) },
  { path: '/onboarding/device-setup-wizard',  element: load(() => import('@/pages/onboarding/device-setup-wizard')) },
  { path: '/onboarding/device-tracking',      element: load(() => import('@/pages/onboarding/device-tracking')) },
  { path: '/onboarding/success',              element: load(() => import('@/pages/onboarding/success')) },

  // ── Auth (public) ────────────────────────────────────────
  { path: '/auth/sign-up',         element: load(() => import('@/pages/authentication/sign-up')) },
  { path: '/auth/sign-in',         element: load(() => import('@/pages/authentication/sign-in')) },
  { path: '/auth/forgot-password', element: load(() => import('@/pages/authentication/forgot-password')) },
  { path: '/auth/verify-email',    element: load(() => import('@/pages/authentication/verify-email')) },

  // ── Protected app shell ───────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: load(() => import('@/layout/MainLayout')),
        children: [
          { index: true,           element: load(() => import('@/pages/home')) },
          { path: 'trips',         element: load(() => import('@/pages/trips')) },
          { path: 'trips/:id',     element: load(() => import('@/pages/trips/detail')) },
          { path: 'health',        element: load(() => import('@/pages/health')) },
          {
            path: 'settings',
            element: load(() => import('@/pages/settings')),
            children: [
              { index: true,                   element: null },
              { path: 'account',               element: load(() => import('@/pages/settings/account')) },
              { path: 'my-orders',             element: load(() => import('@/pages/settings/my-orders')) },
              { path: 'vehicles',              element: load(() => import('@/pages/settings/vehicles')) },
              { path: 'alerts',                element: load(() => import('@/pages/settings/alerts')) },
              { path: 'device-management',     element: load(() => import('@/pages/settings/device-management')) },
              { path: 'payment',               element: load(() => import('@/pages/settings/payment')) },
              { path: 'legal',                 element: load(() => import('@/pages/settings/legal')) },
              { path: 'support',               element: load(() => import('@/pages/settings/support')) },
              { path: 'about',                 element: load(() => import('@/pages/settings/about')) },
            ],
          },
        ],
      },
    ],
  },

  // ── Catch-all ────────────────────────────────────────────
  { path: '*', element: <Navigate to="/onboarding/welcome" replace /> },
])
