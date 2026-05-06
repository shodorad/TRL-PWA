import { Box } from '@mui/material'
import { colors } from '../../styles/tokens'

type DotVariant = 'online' | 'offline' | 'warning' | 'idle'

export interface StatusDotProps {
  variant: DotVariant
  pulse?:  boolean
  size?:   number
}

const COLOR_MAP: Record<DotVariant, string> = {
  online:  colors.success,
  offline: colors.textDisabled,
  warning: colors.warning,
  idle:    colors.info,
}

const StatusDot = ({ variant, pulse = false, size = 8 }: StatusDotProps) => {
  const color = COLOR_MAP[variant]

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      {pulse && variant === 'online' && (
        <Box
          sx={{
            position: 'absolute',
            inset: -3,
            borderRadius: '50%',
            background: `${color}30`,
            animation: 'trl-glow-pulse 2s ease-in-out infinite',
            '@keyframes trl-glow-pulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%':       { opacity: 0.5, transform: 'scale(1.4)' },
            },
          }}
        />
      )}
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          boxShadow: variant !== 'offline' ? `0 0 6px ${color}99` : 'none',
          flexShrink: 0,
        }}
      />
    </Box>
  )
}

export default StatusDot
