import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion.create(Button)
const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header       = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn      = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle    = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })

const INFO_ROWS = [
  { label: 'App Version',    value: '1.0.0' },
  { label: 'Build Number',   value: '100' },
  { label: 'Platform',       value: 'PWA + Capacitor' },
  { label: 'Device ID',      value: '352602116146553' },
]

const About = () => {
  const navigate = useNavigate()
  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle>About</PageTitle>
      </Header>

      <ScrollArea>
        <Box sx={{ textAlign: 'center', py: '24px' }}>
          <Box sx={{ width: 72, height: 72, borderRadius: '20px', background: 'linear-gradient(135deg, #C8FF00, #8FB800)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28, fontWeight: 900, color: '#000' }}>TL</Box>
          <Typography sx={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>TrackLynk</Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', mt: '4px' }}>Vehicle tracking made simple</Typography>
        </Box>

        <GlassCard sx={{ p: '4px', mb: '16px' }}>
          {INFO_ROWS.map(({ label, value }, i, arr) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{label}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{value}</Typography>
            </Box>
          ))}
        </GlassCard>

        <Typography sx={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.22)', pb: '8px' }}>
          © 2025 TrackLynk. All rights reserved.
        </Typography>
      </ScrollArea>
    </ScreenRoot>
  )
}

export default About
