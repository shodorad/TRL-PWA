import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import BackButton from '../buttons/BackButton'
import { colors } from '../../styles/tokens'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack: () => void
  rightSlot?: ReactNode
}

export const PageHeader = ({ title, subtitle, onBack, rightSlot }: PageHeaderProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px 16px',
      flexShrink: 0,
    }}
  >
    <BackButton onClick={onBack} />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: colors.textPrimary,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: 12,
            color: colors.textSecondary,
            mt: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
    {rightSlot}
  </Box>
)
