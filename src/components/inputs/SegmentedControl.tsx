import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { colors, spring } from '../../styles/tokens'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '6px',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '14px',
        padding: '4px',
      }}
    >
      {options.map(opt => {
        const active = opt.value === value
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.96 }}
            transition={spring.snappy}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none',
              background: active ? colors.limeSubtle : 'transparent',
              border: `1px solid ${active ? colors.limeBorder : 'transparent'}`,
              color: active ? colors.lime : colors.textSecondary,
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
          >
            {opt.label}
          </motion.button>
        )
      })}
    </Box>
  )
}

export default SegmentedControl
