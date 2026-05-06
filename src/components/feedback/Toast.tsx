import { Snackbar, Alert } from '@mui/material'
import { colors } from '../../styles/tokens'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  open:       boolean
  message:    string
  variant?:   ToastVariant
  duration?:  number
  onClose:    () => void
}

const BORDER_MAP: Record<ToastVariant, string> = {
  success: colors.successBorder,
  error:   colors.errorBorder,
  warning: colors.warningBorder,
  info:    colors.infoBorder,
}

const Toast = ({ open, message, variant = 'success', duration = 3000, onClose }: ToastProps) => (
  <Snackbar
    open={open}
    autoHideDuration={duration}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    sx={{ bottom: { xs: 90, sm: 24 } }}
  >
    <Alert
      onClose={onClose}
      severity={variant}
      variant="filled"
      sx={{
        borderRadius: '14px',
        background: 'rgba(13,13,20,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${BORDER_MAP[variant]}`,
        color: '#fff',
        fontWeight: 500,
        fontSize: 14,
        '& .MuiAlert-icon': { alignItems: 'center' },
      }}
    >
      {message}
    </Alert>
  </Snackbar>
)

export default Toast
