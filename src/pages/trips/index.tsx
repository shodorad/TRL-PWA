import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ChevronRight, SlidersHorizontal, Route } from 'lucide-react'
import { glassCard } from '@/styles/glass'

const TRIPS = [
  { id: 1, date: 'Today',     name: 'Morning Commute', start: '8:14 AM',  end: '8:42 AM',  distance: '4.2 mi', duration: '28 min', score: 'A' as const },
  { id: 2, date: 'Today',     name: 'Lunch Run',        start: '12:05 PM', end: '12:18 PM', distance: '1.8 mi', duration: '13 min', score: 'A' as const },
  { id: 3, date: 'Yesterday', name: 'Evening Commute',  start: '5:30 PM',  end: '6:08 PM',  distance: '5.1 mi', duration: '38 min', score: 'B' as const },
  { id: 4, date: 'Yesterday', name: 'Grocery Run',      start: '10:20 AM', end: '10:35 AM', distance: '2.3 mi', duration: '15 min', score: 'A' as const },
  { id: 5, date: 'Apr 15',    name: 'Morning Commute',  start: '8:22 AM',  end: '8:49 AM',  distance: '4.0 mi', duration: '27 min', score: 'A' as const },
  { id: 6, date: 'Apr 15',    name: 'Evening Commute',  start: '5:45 PM',  end: '6:22 PM',  distance: '5.3 mi', duration: '37 min', score: 'C' as const },
]

const SCORE_COLOR = { A: '#C8FF00', B: '#F59E0B', C: '#E74C3C', D: '#E74C3C' } as const

type Trip = typeof TRIPS[number]

const grouped = TRIPS.reduce<Record<string, Trip[]>>((acc, trip) => {
  if (!acc[trip.date]) acc[trip.date] = []
  acc[trip.date].push(trip)
  return acc
}, {})

// ─── Styled ───────────────────────────────────────────────────────────────────

const TripsRoot        = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', paddingTop: '16px' })
const TripsHeader      = styled(Box)({ padding: '14px 20px 12px', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 })
const TripsHeaderTitle = styled(Typography)({ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' })
const TripsFilterBtn   = styled(IconButton)({ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '10px', width: 36, height: 36 })
const TripListScroll   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: `${82 + 12}px` })
const TripEmptyState   = styled(Box)({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: '12px', opacity: 0.5 })
const TripEmptyText    = styled(Typography)({ color: 'rgba(255,255,255,0.40)', fontSize: 14, textAlign: 'center', maxWidth: 220 })
const TripDateGroup    = styled(Box)({ marginBottom: '4px' })
const TripDateLabel    = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '2px' })
const TripCardRow      = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', ...glassCard, borderRadius: '14px', marginBottom: '8px', cursor: 'pointer' })
const TripInfoBlock    = styled(Box)({ flex: 1, minWidth: 0 })
const TripName         = styled(Typography)({ fontSize: 14, fontWeight: 600, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
const TripTime         = styled(Typography)({ color: 'rgba(255,255,255,0.45)', fontSize: 12 })
const TripStatsBlock   = styled(Box)({ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 })
const TripDistance     = styled(Typography)({ fontSize: 14, fontWeight: 700 })
const TripDuration     = styled(Typography)({ color: 'rgba(255,255,255,0.45)', fontSize: 12 })
const ScoreBadge       = styled(Box)<{ badgecolor: string }>(({ badgecolor }) => ({
  fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
  color: badgecolor,
  background: `${badgecolor}18`,
  border: `1px solid ${badgecolor}35`,
  borderRadius: 6,
  padding: '2px 6px',
  fontFamily: 'Inter, sans-serif',
}))

// ─── Trip card ────────────────────────────────────────────────────────────────

const TripCard = ({ trip, index, onTap }: { trip: Trip; index: number; onTap: () => void }) => {
  const cappedDelay = 0.03 + Math.min(index, 4) * 0.025
  const scoreColor  = SCORE_COLOR[trip.score]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: cappedDelay, type: 'spring', stiffness: 320, damping: 28 }}
    >
      <TripCardRow onClick={onTap}>
        <TripInfoBlock>
          <TripName color="text.primary">{trip.name}</TripName>
          <TripTime>{trip.start} → {trip.end}</TripTime>
        </TripInfoBlock>
        <TripStatsBlock>
          <TripDistance color="text.primary">{trip.distance}</TripDistance>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TripDuration>{trip.duration}</TripDuration>
            <ScoreBadge badgecolor={scoreColor}>{trip.score}</ScoreBadge>
          </Box>
        </TripStatsBlock>
        <ChevronRight size={16} color="rgba(255,255,255,0.20)" style={{ flexShrink: 0 }} />
      </TripCardRow>
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

const Trips = () => {
  const navigate = useNavigate()
  let index = 0

  return (
    <TripsRoot>
      <TripsHeader>
        <TripsHeaderTitle color="text.primary">Trips</TripsHeaderTitle>
        <TripsFilterBtn><SlidersHorizontal size={16} color="rgba(255,255,255,0.60)" /></TripsFilterBtn>
      </TripsHeader>
      <TripListScroll>
        {TRIPS.length === 0 ? (
          <TripEmptyState>
            <Route size={36} color="rgba(255,255,255,0.30)" />
            <TripEmptyText>No trips yet. Start driving to see your history here.</TripEmptyText>
          </TripEmptyState>
        ) : (
          Object.entries(grouped).map(([date, trips]) => (
            <TripDateGroup key={date}>
              <TripDateLabel>{date}</TripDateLabel>
              {trips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={index++}
                  onTap={() => navigate(`/trips/${trip.id}`)}
                />
              ))}
            </TripDateGroup>
          ))
        )}
      </TripListScroll>
    </TripsRoot>
  )
}

export default Trips
