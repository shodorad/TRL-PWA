import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { SlidersHorizontal, Route } from 'lucide-react'
import TripCard, { type Trip } from '@/components/lists/TripCard'
import EmptyState from '@/components/feedback/EmptyState'

const TRIPS: Trip[] = [
  { id: 1, date: 'Today',     name: 'Morning Commute', start: '8:14 AM',  end: '8:42 AM',  distance: '4.2 mi', duration: '28 min', score: 'A' },
  { id: 2, date: 'Today',     name: 'Lunch Run',        start: '12:05 PM', end: '12:18 PM', distance: '1.8 mi', duration: '13 min', score: 'A' },
  { id: 3, date: 'Yesterday', name: 'Evening Commute',  start: '5:30 PM',  end: '6:08 PM',  distance: '5.1 mi', duration: '38 min', score: 'B' },
  { id: 4, date: 'Yesterday', name: 'Grocery Run',      start: '10:20 AM', end: '10:35 AM', distance: '2.3 mi', duration: '15 min', score: 'A' },
  { id: 5, date: 'Apr 15',    name: 'Morning Commute',  start: '8:22 AM',  end: '8:49 AM',  distance: '4.0 mi', duration: '27 min', score: 'A' },
  { id: 6, date: 'Apr 15',    name: 'Evening Commute',  start: '5:45 PM',  end: '6:22 PM',  distance: '5.3 mi', duration: '37 min', score: 'C' },
]

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
const TripListScroll   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '12px 20px 94px' })
const TripDateGroup    = styled(Box)({ marginBottom: '4px' })
const TripDateLabel    = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '2px' })

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
          <EmptyState
            icon={<Route size={36} />}
            title="No trips yet"
            subtitle="Start driving to see your history here."
          />
        ) : (
          Object.entries(grouped).map(([date, trips]) => (
            <TripDateGroup key={date}>
              <TripDateLabel>{date}</TripDateLabel>
              {trips.map(trip => {
                const i = index++
                const cappedDelay = 0.03 + Math.min(i, 4) * 0.025
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: cappedDelay, type: 'spring', stiffness: 320, damping: 28 }}
                  >
                    <TripCard
                      trip={trip}
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    />
                  </motion.div>
                )
              })}
            </TripDateGroup>
          ))
        )}
      </TripListScroll>
    </TripsRoot>
  )
}

export default Trips
