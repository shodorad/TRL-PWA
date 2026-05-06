import { motion } from 'framer-motion'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { spring } from '../../styles/tokens'

const MotionButton = motion.create(Button)

const StyledSecondary = styled(MotionButton)({
  height: 50,
  borderRadius: 18,
  fontSize: 15,
  fontWeight: 600,
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  color: '#fff',
  '&:hover': {
    background: 'rgba(255,255,255,0.11)',
    border: '1px solid rgba(255,255,255,0.18)',
  },
  '&.Mui-disabled': {
    opacity: 0.4,
    color: '#fff',
  },
})

interface SecondaryButtonProps {
  label:       string
  onClick:     () => void
  startIcon?:  ReactNode
  disabled?:   boolean
  fullWidth?:  boolean
}

const SecondaryButton = ({ label, onClick, startIcon, disabled, fullWidth }: SecondaryButtonProps) => (
  <StyledSecondary
    variant="outlined"
    fullWidth={fullWidth}
    startIcon={startIcon}
    disabled={disabled}
    onClick={onClick}
    whileTap={{ scale: 0.97 }}
    transition={spring.snappy}
  >
    {label}
  </StyledSecondary>
)

export default SecondaryButton
