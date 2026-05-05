import { motion } from 'framer-motion'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

const MotionButton = motion(Button)

const PrimaryMotionButton = styled(MotionButton)({
  height: 54,
  borderRadius: '18px',
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '-0.2px',
})

interface PrimaryButtonProps {
  onClick:   () => void
  label:     string
  disabled?: boolean
}

const PrimaryButton = ({ onClick, label, disabled }: PrimaryButtonProps) => (
  <PrimaryMotionButton
    fullWidth
    variant="contained"
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </PrimaryMotionButton>
)

export default PrimaryButton
