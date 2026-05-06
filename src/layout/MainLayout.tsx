import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { MapPin, Route, HeartPulse, Settings, MessageSquare } from 'lucide-react'
import ConversationalPanel from './ConversationalPanel'

// ─── Styled ──────────────────────────────────────────────────────────────────

const LayoutRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  paddingTop: 'env(safe-area-inset-top, 0px)',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
})

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    marginLeft: '220px',
  },
}))

const TabBarWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(560px, calc(100% - 40px))',
  zIndex: 100,
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}))

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

const MotionTabButton = motion.create(TabButtonBase)

const ActiveIndicatorBase = styled('div')({
  position: 'absolute',
  inset: 6,
  borderRadius: 18,
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.18)',
})

const MotionActiveIndicator = motion.create(ActiveIndicatorBase)

const TabLabel = styled('span')({
  fontSize: 9.5,
  fontFamily: 'Inter, sans-serif',
  letterSpacing: '0.2px',
  position: 'relative',
  zIndex: 1,
})

// ─── Sidebar Styled ───────────────────────────────────────────────────────────

const Sidebar = styled('nav')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    width: 220,
    height: '100%',
    background: 'rgba(18,22,32,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    zIndex: 100,
  },
}))

const SidebarWordmark = styled('div')({
  padding: '24px 20px 20px',
  fontSize: 20,
  fontWeight: 900,
  fontFamily: 'Inter, sans-serif',
  letterSpacing: '-0.5px',
  lineHeight: 1,
})

const SidebarNavList = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '0 12px',
})

const SidebarItemBase = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 16px',
  borderRadius: 12,
  background: 'none',
  border: '1px solid transparent',
  width: '100%',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'left',
})

const MotionSidebarItem = motion.create(SidebarItemBase)

const SidebarActiveIndicatorBase = styled('div')({
  position: 'absolute',
  inset: 0,
  borderRadius: 12,
  background: 'rgba(200,255,0,0.10)',
  border: '1px solid rgba(200,255,0,0.18)',
})

const MotionSidebarActiveIndicator = motion.create(SidebarActiveIndicatorBase)

const SidebarAccentBar = styled('div')({
  position: 'absolute',
  left: 0,
  top: '20%',
  height: '60%',
  width: 3,
  borderRadius: '0 3px 3px 0',
  background: '#C8FF00',
})

const SidebarItemLabel = styled('span')({
  fontSize: 14,
  fontFamily: 'Inter, sans-serif',
  position: 'relative',
  zIndex: 1,
})

const SidebarBottom = styled('div')({
  padding: '12px 12px 24px',
})

const SidebarAskAIBase = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 16px',
  borderRadius: 12,
  background: 'none',
  border: '1px solid rgba(200,255,0,0.40)',
  width: '100%',
  cursor: 'pointer',
  position: 'relative',
})

const MotionSidebarAskAI = motion.create(SidebarAskAIBase)

// ─── Nav config ───────────────────────────────────────────────────────────────

const LEFT_TABS = [
  { id: 'home',  label: 'Home',  path: '/',      Icon: MapPin  },
  { id: 'trips', label: 'Trips', path: '/trips', Icon: Route   },
]
const RIGHT_TABS = [
  { id: 'health',   label: 'Health',   path: '/health',   Icon: HeartPulse },
  { id: 'settings', label: 'Settings', path: '/settings', Icon: Settings   },
]

const SIDEBAR_TABS = [...LEFT_TABS, ...RIGHT_TABS]

// ─── Component ────────────────────────────────────────────────────────────────

const MainLayout = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [chatOpen, setChatOpen] = useState(false)

  const currentId = location.pathname === '/'
    ? 'home'
    : location.pathname.startsWith('/trips')    ? 'trips'
    : location.pathname.startsWith('/health')   ? 'health'
    : location.pathname.startsWith('/settings') ? 'settings'
    : 'home'

  const renderTab = ({ id, label, path, Icon }: typeof LEFT_TABS[0]) => {
    const isActive = currentId === id || (id === 'chat' && chatOpen)
    const color    = isActive ? '#C8FF00' : 'rgba(255,255,255,0.45)'

    return (
      <MotionTabButton
        key={id}
        whileTap={{ scale: 0.88 }}
        onClick={() => navigate(path)}
        style={{ cursor: 'pointer' }}
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

  const renderSidebarItem = ({ id, label, path, Icon }: typeof LEFT_TABS[0]) => {
    const isActive = currentId === id
    const color    = isActive ? '#C8FF00' : 'rgba(255,255,255,0.55)'

    return (
      <MotionSidebarItem
        key={id}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(path)}
      >
        {isActive && (
          <>
            <MotionSidebarActiveIndicator
              layoutId="sidebar-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            <SidebarAccentBar />
          </>
        )}
        <Icon size={18} color={color} style={{ position: 'relative', zIndex: 1 }} />
        <SidebarItemLabel style={{ fontWeight: isActive ? 700 : 400, color }}>
          {label}
        </SidebarItemLabel>
      </MotionSidebarItem>
    )
  }

  return (
    <LayoutRoot>
      <Sidebar>
        <SidebarWordmark>
          <span style={{ color: '#fff' }}>Track</span>
          <span style={{ color: '#C8FF00' }}>Lynk</span>
        </SidebarWordmark>

        <SidebarNavList>
          {SIDEBAR_TABS.map(tab => renderSidebarItem(tab))}
        </SidebarNavList>

        <SidebarBottom>
          <MotionSidebarAskAI
            whileTap={{ scale: 0.97 }}
            onClick={() => setChatOpen(v => !v)}
            style={{
              borderColor: chatOpen ? '#C8FF00' : 'rgba(200,255,0,0.40)',
              background: chatOpen ? 'rgba(200,255,0,0.10)' : 'none',
            }}
          >
            <MessageSquare
              size={18}
              color={chatOpen ? '#C8FF00' : 'rgba(255,255,255,0.55)'}
              style={{ position: 'relative', zIndex: 1 }}
            />
            <SidebarItemLabel style={{ fontWeight: chatOpen ? 700 : 500, color: chatOpen ? '#C8FF00' : 'rgba(255,255,255,0.55)' }}>
              Ask AI
            </SidebarItemLabel>
          </MotionSidebarAskAI>
        </SidebarBottom>
      </Sidebar>

      <ContentArea>
        <Outlet />

        <TabBarWrapper>
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
