import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material'
import { ArrowLeft } from 'lucide-react'

const MotionButton = motion.create(Button)

const BackButtonStyled = styled(MotionButton)({
  minWidth: 0,
  width: 44,
  height: 44,
  borderRadius: '14px',
  padding: 0,
  flexShrink: 0,
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
})

const StepLabel = styled(Typography)({
  color: 'rgba(255,255,255,0.38)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.6px',
  textTransform: 'uppercase' as const,
  marginBottom: '2px',
})

const TitleLabel = styled(Typography)({
  fontSize: 13.5,
  fontWeight: 700,
})

interface ProgressBarProps {
  current: number
  total:   number
  onBack:  () => void
  title:   string
  sx?:     SxProps<Theme>
}

const ProgressBar = ({ current, total, onBack, title, sx }: ProgressBarProps) => {
  const stepNumber = current + 1
  const pct = ((current + 1) / total) * 100

  return (
    <Box sx={[{ p: '12px 20px 16px', pt: '54px' }, ...(Array.isArray(sx) ? sx : [sx ?? {}])]}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '16px' }}>
        <BackButtonStyled
          whileTap={{ scale: 0.88 }}
          onClick={onBack}
          variant="outlined"
        >
          <ArrowLeft size={17} color="rgba(255,255,255,0.8)" />
        </BackButtonStyled>

        <Box sx={{ flex: 1 }}>
          <StepLabel>Step {stepNumber} of {total}</StepLabel>
          <TitleLabel>{title}</TitleLabel>
        </Box>
      </Box>

      <Box sx={{ height: '3.5px', borderRadius: '99px', bgcolor: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: `${(current / total) * 100}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          style={{
            height: '100%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #C8FF00, #E5FF6A)',
            boxShadow: '0 0 8px rgba(200,255,0,0.45)',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: '5px', mt: '10px', justifyContent: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === current ? 22 : 6,
              background: i <= current ? '#C8FF00' : 'rgba(255,255,255,0.1)',
              boxShadow: i === current ? '0 0 8px rgba(200,255,0,0.45)' : 'none',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{ height: 6, borderRadius: 99 }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ProgressBar
