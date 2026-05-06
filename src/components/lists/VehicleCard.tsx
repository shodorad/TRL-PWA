import { Box, Typography } from '@mui/material'
import { Car } from 'lucide-react'
import { GlassCard } from '../common/GlassCard'
import IconBox from '../data/IconBox'
import StatusDot from '../data/StatusDot'
import SignalStrength from '../data/SignalStrength'
import AppBadge from '../data/AppBadge'
import { colors } from '../../styles/tokens'
import type { StatusDotProps } from '../data/StatusDot'
import type { SignalStrengthProps } from '../data/SignalStrength'

export interface Vehicle {
  name:         string
  plate:        string
  status:       StatusDotProps['variant']
  signalLevel:  SignalStrengthProps['level']
  isActive?:    boolean
}

interface VehicleCardProps {
  vehicle:   Vehicle
  onPress?:  () => void
}

const STATUS_LABEL: Record<Vehicle['status'], string> = {
  online:  'Online',
  offline: 'Offline',
  warning: 'Warning',
  idle:    'Idle',
}

const VehicleCard = ({ vehicle, onPress }: VehicleCardProps) => (
  <GlassCard
    onClick={onPress}
    sx={{
      p: '14px 16px',
      cursor: onPress ? 'pointer' : 'default',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    }}
  >
    <IconBox icon={<Car size={22} color={colors.lime} />} size="lg" variant="lime" />

    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '3px' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>
          {vehicle.name}
        </Typography>
        {vehicle.isActive && <AppBadge label="Active" variant="lime" size="sm" />}
      </Box>

      <Typography sx={{ fontSize: 12, color: colors.textDisabled, fontWeight: 500, mb: '6px' }}>
        {vehicle.plate}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <StatusDot variant={vehicle.status} pulse={vehicle.status === 'online'} />
          <Typography sx={{ fontSize: 11, color: colors.textDisabled, fontWeight: 500 }}>
            {STATUS_LABEL[vehicle.status]}
          </Typography>
        </Box>
        <SignalStrength level={vehicle.signalLevel} size="sm" />
      </Box>
    </Box>
  </GlassCard>
)

export default VehicleCard
