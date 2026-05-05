import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { MapPin, Route, User, Settings, MessageSquare } from 'lucide-react'
import ConversationalPanel from './ConversationalPanel'

// ─── Styled ──────────────────────────────────────────────────────────────────

const LayoutRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
})

const ContentArea = styled(Box)({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
})

const TabBarWrapper = styled('div')({
  position: 'absolute',
  bottom: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(560px, calc(100% - 40px))',
  zIndex: 100,
})

const TabBar = styled('div')({
  height: 62,
  background: 'rgba(18,22,32,0.92)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 28,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
  overflow: 'hidden',
})

const TabButtonBase = styled('button')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  background: 'none',
  border: 'none',
  padding: '10px 0',
  position: 'relative',
  cursor: 'pointer',
})

const MotionTabButton = motion(TabButtonBase)

const ActiveIndicatorBase = styled('div')({
  position: 'absolute',
  inset: 6,
  borderRadius: 18,
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.18)',
})

const MotionActiveIndicator = motion(ActiveIndicatorBase)

const TabLabel = styled('span')({
  fontSize: 9.5,
  fontFamily: 'Inter, sans-serif',
  letterSpacing: '0.2px',
  position: 'relative',
  zIndex: 1,
})

const ToastPopupBase = styled('div')({
  position: 'absolute',
  bottom: 70,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(18,22,32,0.95)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 12,
  padding: '8px 16px',
  whiteSpace: 'nowrap',
})

const MotionToastPopup = motion(ToastPopupBase)

const ToastText = styled('span')({
  color: 'rgba(255,255,255,0.70)',
  fontSize: 13,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
})

// ─── Nav config ───────────────────────────────────────────────────────────────

const LEFT_TABS  = [
  { id: 'home',  label: 'Home',  path: '/',      Icon: MapPin  },
  { id: 'trips', label: 'Trips', path: '/trips', Icon: Route   },
]
const RIGHT_TABS = [
  { id: 'profile',  label: 'Profile',  path: '',          Icon: User,     disabled: true },
  { id: 'settings', label: 'Settings', path: '/settings', Icon: Settings  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const MainLayout = () => {
  const navigate     = useNavigate()
  const location     = useLocation()
  const [chatOpen, setChatOpen] = useState(false)
  const [toast,    setToast]    = useState(false)

  const currentId = location.pathname === '/'
    ? 'home'
    : location.pathname.startsWith('/trips')    ? 'trips'
    : location.pathname.startsWith('/settings') ? 'settings'
    : 'home'

  const handleProfileTap = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const renderTab = ({ id, label, path, Icon, disabled = false }: typeof LEFT_TABS[0] & { disabled?: boolean }) => {
    const isActive = currentId === id || (id === 'chat' && chatOpen)
    const color    = disabled
      ? 'rgba(255,255,255,0.18)'
      : isActive ? '#C8FF00' : 'rgba(255,255,255,0.45)'

    return (
      <MotionTabButton
        key={id}
        whileTap={!disabled ? { scale: 0.88 } : {}}
        onClick={() => {
          if (disabled) { handleProfileTap(); return }
          navigate(path)
        }}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      >
        {isActive && (
          <MotionActiveIndicator
            layoutId="tab-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <Icon size={20} color={color} style={{ position: 'relative', zIndex: 1 }} />
        <TabLabel style={{ fontWeight: isActive ? 700 : 400, color }}>{label}</TabLabel>
      </MotionTabButton>
    )
  }

  return (
    <LayoutRoot>
      <ContentArea>
        <Outlet />

        <TabBarWrapper>
          <AnimatePresence>
            {toast && (
              <MotionToastPopup initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <ToastText>Profile coming soon</ToastText>
              </MotionToastPopup>
            )}
          </AnimatePresence>

          <TabBar>
            {LEFT_TABS.map(tab => renderTab(tab))}

            <MotionTabButton whileTap={{ scale: 0.88 }} onClick={() => setChatOpen(v => !v)}>
              {chatOpen && (
                <MotionActiveIndicator layoutId="tab-indicator" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <MessageSquare size={20} color={chatOpen ? '#C8FF00' : 'rgba(255,255,255,0.45)'} style={{ position: 'relative', zIndex: 1 }} />
              <TabLabel style={{ fontWeight: chatOpen ? 700 : 400, color: chatOpen ? '#C8FF00' : 'rgba(255,255,255,0.45)' }}>
                Ask AI
              </TabLabel>
            </MotionTabButton>

            {RIGHT_TABS.map(tab => renderTab(tab))}
          </TabBar>
        </TabBarWrapper>
      </ContentArea>

      <ConversationalPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </LayoutRoot>
  )
}

export default MainLayout
