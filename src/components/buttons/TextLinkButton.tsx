import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { colors, spring } from '../../styles/tokens'

type Variant = 'lime' | 'muted' | 'white'

interface TextLinkButtonProps {
  label:     string
  onClick:   () => void
  variant?:  Variant
  endIcon?:  ReactNode
  disabled?: boolean
  fontSize?: number
}

const COLOR_MAP: Record<Variant, string> = {
  lime:  colors.lime,
  muted: colors.textDisabled,
  white: colors.textSecondary,
}

const TextLinkButton = ({
  label,
  onClick,
  variant = 'lime',
  endIcon,
  disabled = false,
  fontSize = 14,
}: TextLinkButtonProps) => (
  <motion.button
    type="button"
    onClick={() => !disabled && onClick()}
    whileTap={disabled ? undefined : { scale: 0.95 }}
    transition={spring.snappy}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: COLOR_MAP[variant],
      fontSize,
      fontWeight: 600,
      fontFamily: 'inherit',
      opacity: disabled ? 0.45 : 1,
      outline: 'none',
    }}
  >
    {label}
    {endIcon}
  </motion.button>
)

export default TextLinkButton
