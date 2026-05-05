import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, FileText, Shield, ExternalLink } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion(Button)
const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header       = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn      = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle    = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })

const LEGAL_ITEMS = [
  { icon: FileText, label: 'Terms of Service',    sub: 'Last updated Jan 2025' },
  { icon: Shield,   label: 'Privacy Policy',       sub: 'Last updated Jan 2025' },
  { icon: FileText, label: 'Cookie Policy',        sub: 'Last updated Jan 2025' },
  { icon: FileText, label: 'Open Source Licenses', sub: 'Third-party software' },
]

const Legal = () => {
  const navigate = useNavigate()
  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle>Legal</PageTitle>
      </Header>

      <ScrollArea>
        <GlassCard sx={{ p: '4px', mt: 2 }}>
          {LEGAL_ITEMS.map(({ icon: Icon, label, sub }, i, arr) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.04)' }, borderRadius: '14px' }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="rgba(255,255,255,0.55)" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>{label}</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', mt: '2px' }}>{sub}</Typography>
              </Box>
              <ExternalLink size={14} color="rgba(255,255,255,0.25)" />
            </Box>
          ))}
        </GlassCard>
      </ScrollArea>
    </ScreenRoot>
  )
}

export default Legal
