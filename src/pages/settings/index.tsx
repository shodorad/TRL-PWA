import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { User, Car, Bell, Cpu, CreditCard, FileText, LifeBuoy, Info, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/common/GlassCard'
import { Avatar, ListRow } from '@/components'
import { colors } from '@/styles/tokens'

type IconVariant = 'lime' | 'success' | 'warning' | 'surface'

const SETTINGS_NAV: { path: string; label: string; icon: typeof User; iconVariant: IconVariant }[] = [
  { path: 'account',           label: 'Account',           icon: User,        iconVariant: 'lime'    },
  { path: 'my-orders',         label: 'My Orders',         icon: ShoppingBag, iconVariant: 'success' },
  { path: 'vehicles',          label: 'Vehicles',          icon: Car,         iconVariant: 'lime'    },
  { path: 'alerts',            label: 'Alerts',            icon: Bell,        iconVariant: 'warning' },
  { path: 'device-management', label: 'Device Management', icon: Cpu,         iconVariant: 'lime'    },
  { path: 'payment',           label: 'Payment & Plan',    icon: CreditCard,  iconVariant: 'success' },
  { path: 'legal',             label: 'Legal',             icon: FileText,    iconVariant: 'surface' },
  { path: 'support',           label: 'Support',           icon: LifeBuoy,    iconVariant: 'surface' },
  { path: 'about',             label: 'About',             icon: Info,        iconVariant: 'surface' },
]

const VARIANT_COLOR: Record<IconVariant, string> = {
  lime:    colors.lime,
  success: colors.success,
  warning: colors.warning,
  surface: colors.textSecondary,
}

const SettingsRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px', paddingBottom: '82px' })
const SettingsHeader = styled(Box)({ padding: '14px 20px 12px', flexShrink: 0 })
const SettingsTitle  = styled(Typography)({ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea     = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px' })

const Settings = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()
  const isSubPage = location.pathname !== '/settings'

  if (isSubPage) return <Outlet />

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Your Account'

  return (
    <SettingsRoot>
      <SettingsHeader>
        <SettingsTitle color="text.primary">Settings</SettingsTitle>
      </SettingsHeader>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 320, damping: 28 }}
        style={{ padding: '0 20px 16px' }}
      >
        <GlassCard
          onClick={() => navigate('account')}
          sx={{ p: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.07)' } }}
        >
          <Avatar name={user.firstName || 'U'} size="md" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px' }}>{displayName}</Typography>
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', mt: '2px' }} noWrap>{user.email || 'Manage your profile'}</Typography>
          </Box>
          <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
        </GlassCard>
      </motion.div>

      <ScrollArea>
        <Box>
          {SETTINGS_NAV.map(({ path, label, icon: Icon, iconVariant }, i) => (
            <motion.div key={path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.04, type: 'spring', stiffness: 320, damping: 28 }}>
              <ListRow
                icon={<Icon size={17} color={VARIANT_COLOR[iconVariant]} />}
                iconVariant={iconVariant}
                title={label}
                onClick={() => navigate(path)}
              />
            </motion.div>
          ))}
        </Box>
      </ScrollArea>
    </SettingsRoot>
  )
}

export default Settings
