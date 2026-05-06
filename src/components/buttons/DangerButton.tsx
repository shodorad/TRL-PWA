import { motion } from 'framer-motion'
import { CircularProgress } from '@mui/material'
import { spring, colors } from '../../styles/tokens'

interface DangerButtonProps {
  label:     string
  onClick:   () => void
  loading?:  boolean
  disabled?: boolean
  fullWidth?: boolean
}

const DangerButton = ({ label, onClick, loading, disabled, fullWidth }: DangerButtonProps) => (
  <motion.button
    type="button"
    onClick={() => !disabled && !loading && onClick()}
    whileTap={disabled || loading ? undefined : { scale: 0.97 }}
    transition={spring.snappy}
    style={{
      width: fullWidth ? '100%' : undefined,
      height: 44,
      borderRadius: 14,
      border: `1px solid ${colors.errorBorder}`,
      background: colors.errorSubtle,
      color: colors.error,
      fontSize: 14,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      outline: 'none',
      padding: '0 20px',
    }}
  >
    {loading
      ? <CircularProgress size={16} sx={{ color: colors.error }} />
      : label
    }
  </motion.button>
)

export default DangerButton
