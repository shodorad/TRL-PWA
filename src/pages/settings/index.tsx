import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { User, Car, Bell, Cpu, CreditCard, FileText, LifeBuoy, Info, ChevronRight, ShoppingBag } from 'lucide-react'

const SETTINGS_NAV = [
  { path: 'account',           label: 'Account',           icon: User,        iconBg: 'rgba(200,255,0,0.10)' },
  { path: 'my-orders',         label: 'My Orders',         icon: ShoppingBag, iconBg: 'rgba(74,222,128,0.10)' },
  { path: 'vehicles',          label: 'Vehicles',           icon: Car,        iconBg: 'rgba(200,255,0,0.10)' },
  { path: 'alerts',            label: 'Alerts',             icon: Bell,       iconBg: 'rgba(250,204,21,0.10)' },
  { path: 'device-management', label: 'Device Management',  icon: Cpu,        iconBg: 'rgba(200,255,0,0.10)' },
  { path: 'payment',           label: 'Payment & Plan',     icon: CreditCard, iconBg: 'rgba(74,222,128,0.10)' },
  { path: 'legal',             label: 'Legal',              icon: FileText,   iconBg: 'rgba(255,255,255,0.08)' },
  { path: 'support',           label: 'Support',            icon: LifeBuoy,   iconBg: 'rgba(255,255,255,0.08)' },
  { path: 'about',             label: 'About',              icon: Info,       iconBg: 'rgba(255,255,255,0.08)' },
]

const SettingsRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px', paddingBottom: `${82}px` })
const SettingsHeader = styled(Box)({ padding: '14px 20px 12px', flexShrink: 0 })
const SettingsTitle  = styled(Typography)({ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' })
const NavIconBox     = styled(Box)<{ iconbg?: string }>(({ iconbg }) => ({ width: 34, height: 34, borderRadius: '10px', background: iconbg || 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }))
const ScrollArea     = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 16px' })

const Settings = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const isSubPage = location.pathname !== '/settings'

  if (isSubPage) return <Outlet />

  return (
    <SettingsRoot>
      <SettingsHeader>
        <SettingsTitle color="text.primary">Settings</SettingsTitle>
      </SettingsHeader>

      <ScrollArea>
        <List disablePadding>
          {SETTINGS_NAV.map(({ path, label, icon: Icon, iconBg }, i) => (
            <motion.div key={path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 320, damping: 28 }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{ borderRadius: '12px', mb: '4px', '&:hover': { background: 'rgba(255,255,255,0.06)' } }}
              >
                <ListItemIcon sx={{ minWidth: 46 }}>
                  <NavIconBox iconbg={iconBg}><Icon size={17} color="#C8FF00" /></NavIconBox>
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>{label}</Typography>} />
                <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
              </ListItemButton>
            </motion.div>
          ))}
        </List>
      </ScrollArea>
    </SettingsRoot>
  )
}

export default Settings
