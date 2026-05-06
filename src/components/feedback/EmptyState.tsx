import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import PrimaryButton from '../common/PrimaryButton'
import { colors } from '../../styles/tokens'

interface EmptyStateProps {
  icon:          ReactNode
  title:         string
  subtitle?:     string
  actionLabel?:  string
  onAction?:     () => void
}

const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '12px',
      py: '40px',
      px: '24px',
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '16px',
        background: colors.limeSubtle,
        border: `1px solid ${colors.limeBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: '4px',
      }}
    >
      {icon}
    </Box>

    <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
      {title}
    </Typography>

    {subtitle && (
      <Typography sx={{ fontSize: 13, color: colors.textDisabled, lineHeight: 1.5, maxWidth: '260px' }}>
        {subtitle}
      </Typography>
    )}

    {actionLabel && onAction && (
      <Box sx={{ mt: '8px', width: '100%', maxWidth: '220px' }}>
        <PrimaryButton label={actionLabel} onClick={onAction} />
      </Box>
    )}
  </Box>
)

export default EmptyState
