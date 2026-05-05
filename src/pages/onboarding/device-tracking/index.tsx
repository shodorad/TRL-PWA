import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { MapPin, Signal, Satellite, CheckCircle2 } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'
import { useDevice } from '@/contexts/DeviceContext'

const STEP = 10
const TOTAL = 10

// ── Acquisition steps ─────────────────────────────────────────
const STEPS = [
  { id: 'device',   label: 'Device online',        icon: Signal,    delay: 800  },
  { id: 'gps',      label: 'GPS signal acquired',   icon: Satellite, delay: 2000 },
  { id: 'location', label: 'First location locked', icon: MapPin,    delay: 3400 },
]

// ── Styled ───────────────────────────────────────────────────
const ScreenRoot      = styled('div')({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 16, background: 'transparent', position: 'relative' })
const Body            = styled(Box)({ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' })
const MapPreview      = styled(Box)({ position: 'relative', height: 220, borderRadius: 20, overflow: 'hidden', marginBottom: 24, background: 'linear-gradient(135deg, #0d1117 0%, #0d1524 100%)', border: '1px solid rgba(255,255,255,0.08)' })
const GridLine        = styled('div')<{ horiz?: boolean }>(({ horiz }) => ({ position: 'absolute', background: 'rgba(255,255,255,0.04)', ...(horiz ? { left: 0, right: 0, height: 1 } : { top: 0, bottom: 0, width: 1 }) }))
const PulseRing       = styled(motion.div)({ position: 'absolute', borderRadius: '50%', border: '1.5px solid rgba(200,255,0,0.35)' })
const LocationPin     = styled(Box)({ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 })
const PinDot          = styled(Box)({ width: 14, height: 14, borderRadius: '50%', background: '#C8FF00', boxShadow: '0 0 12px rgba(200,255,0,0.7)', border: '2px solid #000' })
const AccuracyCircle  = styled(Box)({ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,255,0,0.06)', border: '1px dashed rgba(200,255,0,0.25)' })
const MapOverlay      = styled(Box)({ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 3 })
const DeviceChip      = styled(Box)({ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99, background: 'rgba(10,12,20,0.88)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.10)' })
const DeviceChipLabel = styled(Typography)({ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' })
const LiveBadge       = styled(Box)({ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99, background: 'rgba(200,255,0,0.12)', border: '1px solid rgba(200,255,0,0.28)' })
const LiveDot         = styled(motion.div)({ width: 6, height: 6, borderRadius: '50%', background: '#C8FF00' })
const LiveLabel       = styled(Typography)({ fontSize: 10, fontWeight: 700, color: '#C8FF00' })
const StepsCard       = styled('div')({ ...glassCard, padding: '18px', marginBottom: 20 })
const StepsTitle      = styled(Typography)({ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 14 })
const StepRow         = styled(Box)({ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 })
const StepIcon        = styled(Box)<{ done: boolean }>(({ done }) => ({ width: 36, height: 36, borderRadius: '50%', background: done ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)', border: done ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s' }))
const StepLabel       = styled(Typography)<{ done: boolean }>(({ done }) => ({ fontSize: 14, fontWeight: 600, color: done ? '#fff' : 'rgba(255,255,255,0.38)', transition: 'color 0.4s' }))
const StepStatus      = styled(Box)({ marginLeft: 'auto' })
const HeadingBlock    = styled(Box)({ marginBottom: 20 })
const Heading         = styled(Typography)({ fontSize: 24, fontWeight: 900, letterSpacing: '-0.6px', marginBottom: 6 })
const SubHeading      = styled(Typography)({ fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6 })
const FooterArea      = styled('div')({ padding: '10px 24px 48px' })

const RING_SIZES = [80, 120, 160]

const DeviceTracking = () => {
  const navigate = useNavigate()
  const { deviceReady } = useDevice()
  const [doneSteps, setDoneSteps] = useState<Set<string>>(new Set())
  const allDone = doneSteps.size === STEPS.length

  useEffect(() => {
    const timers = STEPS.map(s =>
      setTimeout(() => setDoneSteps(prev => new Set([...prev, s.id])), s.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Device Tracking" />

      <Body>
        {/* Map preview */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 24 }}>
          <MapPreview>
            {/* Grid */}
            {[30, 60, 90, 120, 150, 180].map(top => <GridLine key={`h${top}`} horiz style={{ top }} />)}
            {[40, 80, 120, 160, 200, 240, 280].map(left => <GridLine key={`v${left}`} style={{ left }} />)}

            {/* Pulse rings */}
            {RING_SIZES.map((size, i) => (
              <PulseRing
                key={size}
                style={{ width: size, height: size, top: '50%', left: '50%', marginTop: -size / 2, marginLeft: -size / 2 }}
                animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5, ease: 'easeInOut' }}
              />
            ))}

            {/* Accuracy circle + pin */}
            <AccuracyCircle />
            <LocationPin>
              <PinDot />
            </LocationPin>

            {/* Overlays */}
            <MapOverlay>
              <DeviceChip>
                <DeviceChipLabel>OBD-II · 352602116146553</DeviceChipLabel>
              </DeviceChip>
              <LiveBadge>
                <LiveDot animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                <LiveLabel>LIVE</LiveLabel>
              </LiveBadge>
            </MapOverlay>
          </MapPreview>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <HeadingBlock>
            <AnimatePresence mode="wait">
              {allDone ? (
                <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Heading>Your vehicle is live</Heading>
                  <SubHeading>TrackLynk is tracking your vehicle in real time.</SubHeading>
                </motion.div>
              ) : (
                <motion.div key="acquiring" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Heading>Acquiring signal…</Heading>
                  <SubHeading>Setting up your device. This takes a few seconds.</SubHeading>
                </motion.div>
              )}
            </AnimatePresence>
          </HeadingBlock>

          <StepsCard>
            <StepsTitle>Setup status</StepsTitle>
            {STEPS.map(({ id, label, icon: Icon }) => {
              const done = doneSteps.has(id)
              return (
                <StepRow key={id}>
                  <StepIcon done={done}>
                    <AnimatePresence mode="wait">
                      {done ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                          <CheckCircle2 size={18} color="#4ade80" />
                        </motion.div>
                      ) : (
                        <motion.div key="icon" animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                          <Icon size={16} color="rgba(255,255,255,0.3)" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </StepIcon>
                  <StepLabel done={done}>{label}</StepLabel>
                  <StepStatus>
                    {done ? (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Done</motion.span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>…</span>
                    )}
                  </StepStatus>
                </StepRow>
              )
            })}
          </StepsCard>
        </motion.div>
      </Body>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterArea>
          <AnimatePresence mode="wait">
            {allDone ? (
              <motion.div key="cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <PrimaryButton onClick={() => navigate('/onboarding/success')} label="Finish Setup →" />
              </motion.div>
            ) : (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '10px 0' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>
                  Setting up your device…
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default DeviceTracking
