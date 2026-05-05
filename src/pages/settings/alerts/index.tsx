import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Bell, Zap, MapPin, Gauge, Activity } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion.create(Button)
const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header       = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn      = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle    = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const SectionLabel = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', marginTop: '20px' })
const ToggleTrack  = styled('button', { shouldForwardProp: p => p !== 'on' })<{ on: boolean }>(({ on }) => ({ width: 44, height: 26, borderRadius: 13, background: on ? '#C8FF00' : 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }))
const ToggleKnob   = styled('div', { shouldForwardProp: p => p !== 'on' })<{ on: boolean }>(({ on }) => ({ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 10, background: on ? '#000' : 'rgba(255,255,255,0.55)', transition: 'left 0.2s' }))

const ALERT_ROWS = [
  { icon: Zap,      label: 'Speed Alerts',        sub: 'Alert when exceeding set speed limit', key: 'speed'   },
  { icon: MapPin,   label: 'Geofence Alerts',      sub: 'Notify when entering or leaving zones', key: 'geo'    },
  { icon: Gauge,    label: 'Idle Engine Alerts',   sub: 'Alert after 10+ minutes idling',        key: 'idle'   },
  { icon: Activity, label: 'Trip Summaries',       sub: 'Receive a summary after each trip',     key: 'trip'   },
  { icon: Bell,     label: 'Push Notifications',   sub: 'Allow app push notifications',          key: 'push'   },
]

const Alerts = () => {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState<Record<string, boolean>>({ speed: true, geo: true, idle: false, trip: true, push: true })

  const toggle = (key: string) => setToggles(t => ({ ...t, [key]: !t[key] }))

  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle>Alerts</PageTitle>
      </Header>

      <ScrollArea>
        <SectionLabel>Notification Preferences</SectionLabel>
        <GlassCard sx={{ p: '4px' }}>
          {ALERT_ROWS.map(({ icon: Icon, label, sub, key }, i, arr) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="#C8FF00" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>{label}</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', mt: '2px' }}>{sub}</Typography>
              </Box>
              <ToggleTrack on={toggles[key]} onClick={() => toggle(key)}>
                <ToggleKnob on={toggles[key]} />
              </ToggleTrack>
            </Box>
          ))}
        </GlassCard>
      </ScrollArea>
    </ScreenRoot>
  )
}

export default Alerts
