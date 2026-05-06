import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { colors } from '../../styles/tokens'

type Size    = 'sm' | 'md' | 'lg'
type Variant = 'lime' | 'surface' | 'success' | 'error' | 'warning' | 'info'

interface IconBoxProps {
  icon:          ReactNode
  size?:         Size
  variant?:      Variant
  borderRadius?: number
}

const SIZE_MAP: Record<Size, { dim: number; radius: number }> = {
  sm: { dim: 32, radius: 8  },
  md: { dim: 40, radius: 12 },
  lg: { dim: 56, radius: 16 },
}

const STYLE_MAP: Record<Variant, { bg: string; border: string }> = {
  lime:    { bg: colors.limeSubtle,    border: colors.limeBorder    },
  surface: { bg: colors.surfaceHigh,   border: colors.border        },
  success: { bg: colors.successSubtle, border: colors.successBorder },
  error:   { bg: colors.errorSubtle,   border: colors.errorBorder   },
  warning: { bg: colors.warningSubtle, border: colors.warningBorder },
  info:    { bg: colors.infoSubtle,    border: colors.infoBorder    },
}

const IconBox = ({ icon, size = 'md', variant = 'lime', borderRadius }: IconBoxProps) => {
  const { dim, radius } = SIZE_MAP[size]
  const { bg, border }  = STYLE_MAP[variant]

  return (
    <Box
      sx={{
        width: dim,
        height: dim,
        minWidth: dim,
        borderRadius: borderRadius ?? radius,
        background: bg,
        border: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
  )
}

export default IconBox
