import { Box, Typography } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import SecondaryButton from '../buttons/SecondaryButton'
import { colors } from '../../styles/tokens'
import { RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message:   string
  onRetry?:  () => void
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
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
        background: colors.errorSubtle,
        border: `1px solid ${colors.errorBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: '4px',
      }}
    >
      <AlertTriangle size={24} color={colors.error} />
    </Box>

    <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
      Something went wrong
    </Typography>

    <Typography sx={{ fontSize: 13, color: colors.textDisabled, lineHeight: 1.5, maxWidth: '260px' }}>
      {message}
    </Typography>

    {onRetry && (
      <Box sx={{ mt: '8px', width: '100%', maxWidth: '200px' }}>
        <SecondaryButton
          label="Try again"
          onClick={onRetry}
          startIcon={<RefreshCw size={14} />}
        />
      </Box>
    )}
  </Box>
)

export default ErrorState
