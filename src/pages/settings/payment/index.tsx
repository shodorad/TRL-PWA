import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, CreditCard, Check, Calendar } from 'lucide-react'
import { usePlan } from '@/contexts/PlanContext'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion.create(Button)
const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header       = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn      = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle    = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const SectionLabel = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', marginTop: '20px' })

const PLAN_FEATURES = ['Real-time GPS tracking', 'Unlimited trip history', 'Geofence zones', 'Multi-vehicle dashboard']

const Payment = () => {
  const navigate = useNavigate()
  const { plan }  = usePlan()

  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle>Payment & Plan</PageTitle>
      </Header>

      <ScrollArea>
        <SectionLabel>Current Plan</SectionLabel>
        <GlassCard sx={{ p: '20px', mb: '16px', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle, rgba(200,255,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '16px' }}>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px' }}>
                ${plan ? plan.price.toFixed(2) : '9.65'}<Typography component="span" sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>/mo</Typography>
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', mt: '2px' }}>
                {plan?.type === 'annual' ? 'Billed annually' : 'Billed monthly'}
              </Typography>
            </Box>
            <Box sx={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '99px', px: '12px', py: '4px' }}>
              <Typography sx={{ color: '#4ade80', fontSize: 12, fontWeight: 700 }}>Active</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PLAN_FEATURES.map(f => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '99px', background: 'rgba(200,255,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={10} color="#C8FF00" />
                </Box>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        </GlassCard>

        <SectionLabel>Billing</SectionLabel>
        <GlassCard sx={{ p: '4px' }}>
          {[
            { icon: CreditCard, label: 'Payment Method', sub: 'Visa •••• 4242' },
            { icon: Calendar,   label: 'Next Billing Date', sub: 'June 15, 2025' },
          ].map(({ icon: Icon, label, sub }, i, arr) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: 'pointer' }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(74,222,128,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="#4ade80" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>{label}</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', mt: '2px' }}>{sub}</Typography>
              </Box>
            </Box>
          ))}
        </GlassCard>

        <MotionButton fullWidth variant="text" whileTap={{ scale: 0.97 }} sx={{ mt: 3, color: 'rgba(255,80,80,0.7)', fontSize: 14 }}>
          Cancel Subscription
        </MotionButton>
      </ScrollArea>
    </ScreenRoot>
  )
}

export default Payment
