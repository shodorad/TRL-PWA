import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Bell, Zap, MapPin, Gauge, Activity } from 'lucide-react'
import { SectionLabel, PageHeader, AppToggle, ListRow } from '@/components'

const ScreenRoot = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })

const ALERT_ROWS: { icon: typeof Bell; label: string; sub: string; key: string }[] = [
  { icon: Zap,      label: 'Speed Alerts',        sub: 'Alert when exceeding set speed limit', key: 'speed'   },
  { icon: MapPin,   label: 'Geofence Alerts',      sub: 'Notify when entering or leaving zones', key: 'geo'    },
  { icon: Gauge,    label: 'Idle Engine Alerts',   sub: 'Alert after 10+ minutes idling',        key: 'idle'   },
  { icon: Activity, label: 'Trip Summaries',       sub: 'Receive a summary after each trip',     key: 'trip'   },
  { icon: Bell,     label: 'Push Notifications',   sub: 'Allow app push notifications',          key: 'push'   },
]

const Alerts = () => {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState<Record<string, boolean>>({ speed: true, geo: true, idle: false, trip: true, push: true })

  return (
    <ScreenRoot>
      <PageHeader title="Alerts" onBack={() => navigate('/settings')} />

      <ScrollArea>
        <SectionLabel sx={{ mb: '8px', mt: '4px' }}>Notification Preferences</SectionLabel>
        {ALERT_ROWS.map(({ icon: Icon, label, sub, key }, i, arr) => (
          <ListRow
            key={key}
            icon={<Icon size={16} color="#C8FF00" />}
            iconVariant="lime"
            title={label}
            subtitle={sub}
            rightSlot={
              <AppToggle
                checked={toggles[key]}
                onChange={(v) => setToggles(t => ({ ...t, [key]: v }))}
              />
            }
            showChevron={false}
            divider={i < arr.length - 1}
          />
        ))}
      </ScrollArea>
    </ScreenRoot>
  )
}

export default Alerts
