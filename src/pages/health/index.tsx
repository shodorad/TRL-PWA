import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { glassCard } from '@/styles/glass'

// ─── Mock data ─────────────────────────────────────────────────────────────────

const DRIVER_SCORE  = 78
const VEHICLE_SCORE = 84

const WEEKLY_DRIVER  = [72, 75, 70, 78, 76, 80, 78]
const WEEKLY_VEHICLE = [82, 81, 84, 83, 85, 84, 84]

const DRIVER_FACTORS = [
  { label: 'Speeding',          score: 82, tip: 'Stay within 5 mph of posted limits.' },
  { label: 'Hard Braking',      score: 74, tip: 'Increase following distance to reduce sudden stops.' },
  { label: 'Rapid Acceleration',score: 88, tip: null },
  { label: 'Harsh Cornering',   score: 91, tip: null },
  { label: 'Time of Day',       score: 68, tip: 'More night driving detected. Night trips carry higher risk.' },
  { label: 'Miles Driven',      score: 85, tip: null },
  { label: 'Idle Time',         score: 79, tip: null },
]

const VEHICLE_FACTORS = [
  { label: 'Battery Health',     score: 88, tip: null },
  { label: 'Engine Temperature', score: 92, tip: null },
  { label: 'Fuel System',        score: 95, tip: null },
  { label: 'Active Fault Codes', score: 70, tip: 'P0420 detected. Schedule a service visit.' },
  { label: 'Maintenance Status', score: 72, tip: 'Oil change due in 340 miles.' },
  { label: 'Overall Mileage',    score: 84, tip: null },
]

const MAINTENANCE_ITEMS = [
  { label: 'Oil Change',    due: '340 mi',  status: 'due_soon' as const },
  { label: 'Tire Rotation', due: '1,200 mi', status: 'ok' as const },
  { label: 'Air Filter',    due: '2,800 mi', status: 'ok' as const },
  { label: 'Brake Fluid',   due: 'Overdue',  status: 'overdue' as const },
]

const PEER_PERCENTILE = 74

// ─── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 85) return '#2ECC71'
  if (s >= 70) return '#C8FF00'
  if (s >= 55) return '#F5A623'
  return '#E74C3C'
}

function scoreGrade(s: number) {
  if (s >= 90) return 'A'
  if (s >= 80) return 'B+'
  if (s >= 70) return 'B'
  if (s >= 60) return 'C+'
  return 'C'
}

const MAINT_CHIP: Record<'ok' | 'due_soon' | 'overdue', { label: string; color: string; bg: string }> = {
  ok:       { label: 'OK',       color: '#2ECC71', bg: 'rgba(46,204,113,0.12)' },
  due_soon: { label: 'Due Soon', color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
  overdue:  { label: 'Overdue',  color: '#E74C3C', bg: 'rgba(231,76,60,0.12)'  },
}

// ─── Styled ────────────────────────────────────────────────────────────────────

const Root           = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: 82 })
const Header         = styled(Box)({ padding: '16px 20px 14px', flexShrink: 0 })
const HeaderRow      = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })
const Title          = styled(Typography)({ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' })
const ActiveChip     = styled(Box)({ background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.22)', borderRadius: 99, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5 })
const ActiveDot      = styled(Box)({ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#C8FF00' })
const ActiveLabel    = styled(Typography)({ fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#C8FF00' })

const TabRow         = styled(Box)({ display: 'flex', margin: '14px 20px 0', gap: 8 })
const TabPill        = styled('button')<{ active: number }>(({ active }) => ({
  flex: 1, padding: '9px 0', background: active ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.05)',
  border: `1px solid ${active ? 'rgba(200,255,0,0.25)' : 'rgba(255,255,255,0.08)'}`,
  borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
  color: active ? '#C8FF00' : 'rgba(255,255,255,0.50)', cursor: 'pointer', transition: 'all 0.15s ease',
}))

const Body           = styled(Box)({ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 })
const SectionLabel   = styled(Typography)({ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 })

// Score card
const ScoreCard      = styled(Box)({ ...glassCard, borderRadius: 14, padding: '20px' })
const ScoreTop       = styled(Box)({ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 })
const RingWrap       = styled(Box)({ position: 'relative', width: 100, height: 100, flexShrink: 0 })
const RingCenter     = styled(Box)({ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' })
const RingGrade      = styled(Typography)({ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 })
const RingScore      = styled(Typography)({ fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 1 })
const ScoreRight     = styled(Box)({ flex: 1 })
const ScoreLabelText = styled(Typography)({ fontSize: 15, fontWeight: 700 })
const PeerBadge      = styled(Box)({ display: 'inline-flex', alignItems: 'center', marginTop: 4, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6, padding: '3px 8px' })
const PeerText       = styled(Typography)({ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontWeight: 500 })
const SparklineWrap  = styled(Box)({ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 })
const SparkLabel     = styled(Typography)({ fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 6 })

// Tip card
const TipCard        = styled(Box)({ ...glassCard, borderRadius: 14, padding: '14px 16px', borderColor: 'rgba(245,166,35,0.20)' })
const TipText        = styled(Typography)({ fontSize: 13, color: 'rgba(255,255,255,0.70)', lineHeight: 1.5 })

// Factor list
const FactorCard     = styled(Box)({ ...glassCard, borderRadius: 14, padding: '4px 0' })
const FactorRow      = styled(Box)({ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' })
const FactorName     = styled(Typography)({ fontSize: 13, fontWeight: 500, flex: 1 })
const BarWrap        = styled(Box)({ width: 60, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' })
const FactorScore    = styled(Typography)({ fontSize: 13, fontWeight: 700, width: 28, textAlign: 'right', flexShrink: 0 })
const FactorDivider  = styled(Box)({ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', margin: '0 16px' })

// Maintenance
const MaintCard      = styled(Box)({ ...glassCard, borderRadius: 14, padding: '4px 0' })
const MaintRow       = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', gap: 12 })
const MaintName      = styled(Typography)({ fontSize: 13, fontWeight: 500, flex: 1 })
const MaintDue       = styled(Typography)({ fontSize: 12, color: 'rgba(255,255,255,0.40)' })
const MaintChip      = styled(Box)<{ chipcolor: string; chipbg: string }>(({ chipcolor, chipbg }) => ({
  background: chipbg, border: `1px solid ${chipcolor}40`, borderRadius: 99, padding: '2px 8px',
}))
const MaintChipLabel = styled(Typography)<{ chipcolor: string }>(({ chipcolor }) => ({
  fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: chipcolor,
}))

// ─── Sparkline ────────────────────────────────────────────────────────────────

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const W = 240, H = 36, pad = 4
  const min = Math.min(...data) - 5
  const max = Math.max(...data) + 5
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - min) / (max - min)) * (H - pad * 2)
    return `${x},${y}`
  })
  const polyPts = pts.join(' ')
  const areaClose = `${pts[pts.length - 1].split(',')[0]},${H} ${pts[0].split(',')[0]},${H}`
  const areaPath = `M ${polyPts.replace(/,/g, ' ')} ${areaClose}`.replace(/ (\d)/g, ', $1')

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0.00" />
        </linearGradient>
      </defs>
      <polygon points={`${polyPts} ${areaClose}`} fill="url(#spark-fill)" />
      <polyline points={polyPts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (W - pad * 2)
        const y = H - pad - ((v - min) / (max - min)) * (H - pad * 2)
        return i === data.length - 1
          ? <circle key={i} cx={x} cy={y} r="3" fill={color} />
          : null
      })}
    </svg>
  )
}

// ─── Score ring ───────────────────────────────────────────────────────────────

const ScoreRing = ({ score, tab }: { score: number; tab: string }) => {
  const r    = 44
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color = scoreColor(score)
  const grade = scoreGrade(score)

  return (
    <RingWrap>
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <motion.circle
          key={`${tab}-ring`}
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${fill} ${circ}` }}
          transition={{ duration: 0.9, ease: [0.0, 0.0, 0.2, 1] }}
        />
      </svg>
      <RingCenter>
        <RingGrade sx={{ color }}>{grade}</RingGrade>
        <RingScore>{score}</RingScore>
      </RingCenter>
    </RingWrap>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

const Health = () => {
  const [tab, setTab] = useState<'driver' | 'vehicle'>('driver')
  const isDriver = tab === 'driver'

  const score   = isDriver ? DRIVER_SCORE   : VEHICLE_SCORE
  const weekly  = isDriver ? WEEKLY_DRIVER  : WEEKLY_VEHICLE
  const factors = isDriver ? DRIVER_FACTORS : VEHICLE_FACTORS
  const color   = scoreColor(score)
  const topTip  = score < 80 ? factors.find(f => f.tip) : null

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.06 + i * 0.05, type: 'spring' as const, stiffness: 320, damping: 28 },
  })

  return (
    <Root>
      {/* Header */}
      <Header>
        <HeaderRow>
          <Title color="text.primary">Health</Title>
          <ActiveChip>
            <ActiveDot />
            <ActiveLabel>Active</ActiveLabel>
          </ActiveChip>
        </HeaderRow>

        {/* Tab toggle */}
        <TabRow>
          <TabPill active={isDriver ? 1 : 0} onClick={() => setTab('driver')}>Driver</TabPill>
          <TabPill active={!isDriver ? 1 : 0} onClick={() => setTab('vehicle')}>Vehicle</TabPill>
        </TabRow>
      </Header>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.0, 0.0, 0.2, 1] }}
        >
          <Body>
            {/* Score card */}
            <motion.div {...stagger(0)}>
              <ScoreCard>
                <ScoreTop>
                  <ScoreRing score={score} tab={tab} />
                  <ScoreRight>
                    <ScoreLabelText color="text.primary">
                      {isDriver ? 'Driver Score' : 'Vehicle Score'}
                    </ScoreLabelText>
                    <PeerBadge>
                      <PeerText>Top {100 - PEER_PERCENTILE}% of drivers</PeerText>
                    </PeerBadge>
                  </ScoreRight>
                </ScoreTop>
                <SparklineWrap>
                  <SparkLabel>7-Day Trend</SparkLabel>
                  <Sparkline data={weekly} color={color} />
                </SparklineWrap>
              </ScoreCard>
            </motion.div>

            {/* Improvement tip */}
            {topTip && (
              <motion.div {...stagger(1)}>
                <TipCard>
                  <TipText>{topTip.tip}</TipText>
                </TipCard>
              </motion.div>
            )}

            {/* Factor list */}
            <motion.div {...stagger(topTip ? 2 : 1)}>
              <SectionLabel>{isDriver ? 'Driver Factors' : 'Vehicle Factors'}</SectionLabel>
              <FactorCard>
                {factors.map((f, i) => {
                  const fColor = scoreColor(f.score)
                  return (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + i * 0.04, type: 'spring', stiffness: 300, damping: 26 }}
                    >
                      {i > 0 && <FactorDivider />}
                      <FactorRow>
                        <FactorName color="text.primary">{f.label}</FactorName>
                        <BarWrap>
                          <motion.div
                            style={{ height: '100%', borderRadius: 2, backgroundColor: fColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${f.score}%` }}
                            transition={{ delay: 0.22 + i * 0.04, duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}
                          />
                        </BarWrap>
                        <FactorScore sx={{ color: fColor }}>{f.score}</FactorScore>
                      </FactorRow>
                    </motion.div>
                  )
                })}
              </FactorCard>
            </motion.div>

            {/* Maintenance timeline (vehicle only) */}
            {!isDriver && (
              <motion.div {...stagger(3)}>
                <SectionLabel>Maintenance</SectionLabel>
                <MaintCard>
                  {MAINTENANCE_ITEMS.map((item, i) => {
                    const chip = MAINT_CHIP[item.status]
                    return (
                      <Box key={item.label}>
                        {i > 0 && <FactorDivider />}
                        <MaintRow>
                          <MaintName color="text.primary">{item.label}</MaintName>
                          <MaintDue>{item.due}</MaintDue>
                          <MaintChip chipcolor={chip.color} chipbg={chip.bg}>
                            <MaintChipLabel chipcolor={chip.color}>{chip.label}</MaintChipLabel>
                          </MaintChip>
                        </MaintRow>
                      </Box>
                    )
                  })}
                </MaintCard>
              </motion.div>
            )}
          </Body>
        </motion.div>
      </AnimatePresence>
    </Root>
  )
}

export default Health
