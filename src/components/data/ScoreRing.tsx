import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { colors } from '../../styles/tokens'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  animKey?: string
}

function deriveGrade(score: number): { letter: string; color: string } {
  if (score >= 90) return { letter: 'A', color: colors.success }
  if (score >= 75) return { letter: 'B', color: colors.lime }
  if (score >= 60) return { letter: 'C', color: colors.warning }
  return { letter: 'D', color: colors.error }
}

export const ScoreRing = ({ score, size = 100, strokeWidth = 7, animKey = 'ring' }: ScoreRingProps) => {
  const { letter, color } = deriveGrade(score)
  const center = size / 2
  const r      = center - strokeWidth / 2 - 1
  const circ   = 2 * Math.PI * r
  const fill   = (score / 100) * circ

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          key={`${animKey}-fill`}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${fill} ${circ}` }}
          transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="span"
          sx={{
            fontSize: Math.round(size * 0.22),
            fontWeight: 800,
            letterSpacing: '-0.5px',
            lineHeight: 1,
            color,
          }}
        >
          {letter}
        </Box>
        <Box
          component="span"
          sx={{
            fontSize: 11,
            color: colors.textDisabled,
            mt: '1px',
          }}
        >
          {score}
        </Box>
      </Box>
    </Box>
  )
}
