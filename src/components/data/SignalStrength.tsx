import { Box } from '@mui/material'
import { colors } from '../../styles/tokens'

type SignalSize = 'sm' | 'md'

export interface SignalStrengthProps {
  level: 0 | 1 | 2 | 3 | 4
  size?: SignalSize
}

const HEIGHTS   = [6, 10, 14, 18]  // px per bar
const BAR_WIDTH = 4

const SIZE_SCALE: Record<SignalSize, number> = { sm: 0.75, md: 1 }

const SignalStrength = ({ level, size = 'md' }: SignalStrengthProps) => {
  const scale = SIZE_SCALE[size]

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
      {HEIGHTS.map((h, i) => (
        <Box
          key={i}
          sx={{
            width:        BAR_WIDTH * scale,
            height:       h * scale,
            borderRadius: '2px',
            background:   i < level ? colors.lime : 'rgba(255,255,255,0.15)',
            transition:   'background 0.25s ease',
          }}
        />
      ))}
    </Box>
  )
}

export default SignalStrength
