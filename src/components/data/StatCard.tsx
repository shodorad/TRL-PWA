import { Box, Typography } from '@mui/material'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { GlassCard } from '../common/GlassCard'
import { colors } from '../../styles/tokens'

interface StatCardProps {
  label:   string
  value:   string | number
  unit?:   string
  trend?:  number    // positive = up, negative = down, 0 = neutral
  icon?:   ReactNode
  onClick?: () => void
}

const StatCard = ({ label, value, unit, trend, icon, onClick }: StatCardProps) => {
  const hasTrend   = trend !== undefined
  const isPositive = (trend ?? 0) >= 0
  const trendColor = isPositive ? colors.success : colors.error

  return (
    <GlassCard
      onClick={onClick}
      sx={{
        p: '14px 16px',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { border: `1px solid ${colors.border}` } : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: '10px' }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textDisabled, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {label}
        </Typography>
        {icon}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: colors.textPrimary, lineHeight: 1 }}>
          {value}
        </Typography>
        {unit && (
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.textDisabled }}>
            {unit}
          </Typography>
        )}
      </Box>

      {hasTrend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '6px' }}>
          {isPositive
            ? <TrendingUp size={12} color={trendColor} />
            : <TrendingDown size={12} color={trendColor} />
          }
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: trendColor }}>
            {isPositive ? '+' : ''}{trend}%
          </Typography>
        </Box>
      )}
    </GlassCard>
  )
}

export default StatCard
