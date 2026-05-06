import { motion } from 'framer-motion'
import { Tooltip } from '@mui/material'
import type { ReactNode } from 'react'
import { spring, colors } from '../../styles/tokens'

type Variant = 'glass' | 'ghost' | 'lime'

interface AppIconButtonProps {
  icon:      ReactNode
  onClick:   () => void
  size?:     number
  variant?:  Variant
  tooltip?:  string
  disabled?: boolean
}

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  glass: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  ghost: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  lime: {
    background: colors.limeSubtle,
    border: `1px solid ${colors.limeBorder}`,
  },
}

const AppIconButton = ({
  icon,
  onClick,
  size = 40,
  variant = 'glass',
  tooltip,
  disabled = false,
}: AppIconButtonProps) => {
  const btn = (
    <motion.button
      type="button"
      onClick={() => !disabled && onClick()}
      whileTap={disabled ? undefined : { scale: 0.88 }}
      transition={spring.snappy}
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        opacity: disabled ? 0.45 : 1,
        flexShrink: 0,
        ...VARIANT_STYLES[variant],
      }}
    >
      {icon}
    </motion.button>
  )

  return tooltip
    ? <Tooltip title={tooltip} placement="bottom">{btn}</Tooltip>
    : btn
}

export default AppIconButton
