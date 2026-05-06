import { Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'
import type { ReactNode } from 'react'
import { colors } from '../../styles/tokens'

interface SectionLabelProps {
  children: ReactNode
  sx?: BoxProps['sx']
}

export const SectionLabel = ({ children, sx }: SectionLabelProps) => (
  <Typography
    sx={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.7px',
      textTransform: 'uppercase',
      color: colors.textDisabled,
      ...sx,
    }}
  >
    {children}
  </Typography>
)
