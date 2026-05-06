import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Sparkles, ChevronRight } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHeader } from '@/components'

const MotionButton = motion.create(Button)
const SPRING       = { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.8 }

const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })

const INFO_ROWS = [
  { label: 'App Version',    value: '1.0.0' },
  { label: 'Build Number',   value: '100' },
  { label: 'Platform',       value: 'PWA + Capacitor' },
  { label: 'Device ID',      value: '352602116146553' },
]

const CHANGELOG = [
  {
    version: '1.0.0', date: 'May 2025', current: true,
    changes: ['Full settings experience with all sub-screens', 'GPS tracking with live map updates', 'Trip history and detailed reports'],
  },
  {
    version: '0.9.0', date: 'April 2025', current: false,
    changes: ['Geofence zone creation and alerts', 'Vehicle health diagnostics', 'Improved battery optimisation'],
  },
  {
    version: '0.8.0', date: 'March 2025', current: false,
    changes: ['OBD-II device pairing flow', 'Onboarding redesign', 'Dark mode improvements'],
  },
]

/* ── WhatsNewView ── */
function WhatsNewView({ onBack }: { onBack: () => void }) {
  return (
    <ScreenRoot>
      <PageHeader title="What's New" onBack={onBack} />
      <ScrollArea>
        {CHANGELOG.map(({ version, date, current, changes }, idx) => (
          <motion.div key={version} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, ...SPRING }}>
            <Box sx={{ mb: '20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '10px' }}>
                <Box sx={{ background: current ? 'rgba(200,255,0,0.15)' : 'rgba(255,255,255,0.08)', border: `1px solid ${current ? 'rgba(200,255,0,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: '99px', px: '10px', py: '3px' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: current ? '#C8FF00' : 'rgba(255,255,255,0.45)' }}>v{version}</Typography>
                </Box>
                {current && <Box sx={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '99px', px: '8px', py: '2px' }}><Typography sx={{ color: '#4ade80', fontSize: 10, fontWeight: 700 }}>Current</Typography></Box>}
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', ml: 'auto' }}>{date}</Typography>
              </Box>
              <GlassCard sx={{ p: '14px 16px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {changes.map(c => (
                    <Box key={c} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: current ? '#C8FF00' : 'rgba(255,255,255,0.3)', mt: '6px', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{c}</Typography>
                    </Box>
                  ))}
                </Box>
              </GlassCard>
            </Box>
          </motion.div>
        ))}
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── About (main) ── */
const About = () => {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'main' | 'whatsNew'>('main')

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <ScreenRoot>
        <PageHeader title="About" onBack={() => navigate('/settings')} />

        <ScrollArea>
          <Box sx={{ textAlign: 'center', py: '24px' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '20px', background: 'linear-gradient(135deg, #C8FF00, #8FB800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28, fontWeight: 900, color: '#000' }}>TL</Box>
            <Typography sx={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>TrackLynk</Typography>
            <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', mt: '4px' }}>Vehicle tracking made simple</Typography>
          </Box>

          <GlassCard sx={{ p: '4px', mb: '12px' }}>
            {INFO_ROWS.map(({ label, value }, i, arr) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{label}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{value}</Typography>
              </Box>
            ))}
          </GlassCard>

          <GlassCard sx={{ p: '4px', mb: '20px' }}>
            <Box onClick={() => setActiveView('whatsNew')} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 16px', cursor: 'pointer', borderRadius: '14px', '&:hover': { background: 'rgba(255,255,255,0.04)' } }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="#C8FF00" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>What's New</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', mt: '2px' }}>Version 1.0.0 · May 2025</Typography>
              </Box>
              <ChevronRight size={15} color="rgba(255,255,255,0.22)" />
            </Box>
          </GlassCard>

          <Typography sx={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.22)', pb: '8px' }}>
            © 2025 TrackLynk. All rights reserved.
          </Typography>
        </ScrollArea>
      </ScreenRoot>

      <AnimatePresence>
        {activeView === 'whatsNew' && (
          <motion.div
            key="whatsNew"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={SPRING}
            style={{ position: 'absolute', inset: 0, background: '#04050d', zIndex: 10, display: 'flex', flexDirection: 'column' }}
          >
            <WhatsNewView onBack={() => setActiveView('main')} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default About
