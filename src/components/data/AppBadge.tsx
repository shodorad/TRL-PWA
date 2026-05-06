import { Box } from '@mui/material'
import { colors } from '../../styles/tokens'

type Variant = 'lime' | 'success' | 'warning' | 'error' | 'neutral'
type Size    = 'sm' | 'md'

export interface AppBadgeProps {
  label:    string
  variant?: Variant
  size?:    Size
}

const STYLE_MAP: Record<Variant, { bg: string; border: string; color: string }> = {
  lime:    { bg: colors.limeSubtle,    border: colors.limeBorder,    color: colors.lime    },
  success: { bg: colors.successSubtle, border: colors.successBorder, color: colors.success },
  warning: { bg: colors.warningSubtle, border: colors.warningBorder, color: colors.warning },
  error:   { bg: colors.errorSubtle,   border: colors.errorBorder,   color: colors.error   },
  neutral: { bg: colors.surfaceMid,    border: colors.border,        color: colors.textSecondary },
}

const SIZE_MAP: Record<Size, { height: number; fontSize: number; px: number }> = {
  sm: { height: 20, fontSize: 10, px: 8  },
  md: { height: 26, fontSize: 11, px: 10 },
}

const AppBadge = ({ label, variant = 'lime', size = 'md' }: AppBadgeProps) => {
  const { bg, border, color } = STYLE_MAP[variant]
  const { height, fontSize, px } = SIZE_MAP[size]

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height,
        px: `${px}px`,
        borderRadius: '9999px',
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  )
}

export default AppBadge
