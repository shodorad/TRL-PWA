import { Box, Typography } from '@mui/material'
import { ChevronRight } from 'lucide-react'
import { GlassCard } from '../common/GlassCard'
import AppBadge from '../data/AppBadge'
import { colors } from '../../styles/tokens'
import type { AppBadgeProps } from '../data/AppBadge'

export interface Trip {
  id:       string | number
  date:     string
  name:     string
  start:    string
  end:      string
  distance: string
  duration: string
  score:    'A' | 'B' | 'C' | 'D'
}

interface TripCardProps {
  trip:      Trip
  onClick?:  () => void
}

const SCORE_VARIANT: Record<Trip['score'], AppBadgeProps['variant']> = {
  A: 'success',
  B: 'lime',
  C: 'warning',
  D: 'error',
}

const TripCard = ({ trip, onClick }: TripCardProps) => (
  <GlassCard
    onClick={onClick}
    sx={{
      p: '13px 14px',
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      mb: '8px',
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, mb: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {trip.name}
      </Typography>
      <Typography sx={{ fontSize: 12, color: colors.textDisabled }}>
        {trip.start} → {trip.end}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>
        {trip.distance}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography sx={{ fontSize: 12, color: colors.textDisabled }}>{trip.duration}</Typography>
        <AppBadge label={trip.score} variant={SCORE_VARIANT[trip.score]} size="sm" />
      </Box>
    </Box>

    <ChevronRight size={16} color={colors.textDisabled} style={{ flexShrink: 0 }} />
  </GlassCard>
)

export default TripCard
