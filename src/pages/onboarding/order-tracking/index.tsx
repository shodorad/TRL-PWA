import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'
import { Package, Truck, Check, ChevronLeft } from 'lucide-react'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'

const MotionButton = motion.create(Button)

// ── Shipment stages ──────────────────────────────────────────
const STAGES = [
  { id: 'ordered',    label: 'Order Placed',  sub: 'May 5, 9:41 AM',    done: true,  active: false },
  { id: 'processing', label: 'Processing',    sub: 'Confirmed 9:43 AM', done: true,  active: false },
  { id: 'shipped',    label: 'Shipped',       sub: 'Est. May 6',        done: false, active: true  },
  { id: 'delivered',  label: 'Delivered',     sub: 'Est. May 7–8',      done: false, active: false },
]

// ── Styled ───────────────────────────────────────────────────
const ScreenRoot    = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 16, background: 'transparent' })
const Header        = styled(Box)({ display: 'flex', alignItems: 'center', padding: '14px 24px 0', position: 'relative' })
const BackBtn       = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const HeaderTitle   = styled(Typography)({ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 16, fontWeight: 700 })
const ScrollArea    = styled(Box)({ flex: 1, overflowY: 'auto', padding: '18px 24px 0' })
const HeroBox       = styled(Box)({ textAlign: 'center', marginBottom: 22 })
const HeroCircle    = styled(motion.div)({ width: 66, height: 66, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(200,255,0,0.16), rgba(143,184,0,0.1))', border: '1.5px solid rgba(200,255,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 32px rgba(200,255,0,0.14)' })
const HeroTitle     = styled(motion.h2)({ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4, fontFamily: 'Inter, sans-serif' })
const HeroSub       = styled(motion.p)({ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'Inter, sans-serif' })
const TimelineCard  = styled(Box)({ ...glassCard, padding: '18px 18px 14px', marginBottom: 14 })
const StageRow      = styled(Box)({ display: 'flex', gap: 14, position: 'relative' })
const Connector     = styled(Box)<{ lit: boolean }>(({ lit }) => ({ position: 'absolute', left: 13, top: 28, width: 2, height: 34, background: lit ? 'rgba(200,255,0,0.32)' : 'rgba(255,255,255,0.09)', borderRadius: 1 }))
const DotBase       = styled(Box)<{ done?: boolean; active?: boolean }>(({ done, active }) => ({ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, zIndex: 1, background: done ? 'linear-gradient(135deg, #C8FF00, #8FB800)' : active ? 'rgba(200,255,0,0.1)' : 'rgba(255,255,255,0.06)', border: active ? '2px solid rgba(200,255,0,0.45)' : done ? 'none' : '1.5px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: done ? '0 0 10px rgba(200,255,0,0.22)' : active ? '0 0 8px rgba(200,255,0,0.14)' : 'none' }))
const StageLabel    = styled(Typography)<{ lit?: boolean; active?: boolean }>(({ lit, active }) => ({ color: lit || active ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 13.5, fontWeight: active ? 700 : 600, fontFamily: 'Inter, sans-serif', margin: 0 }))
const StageSub      = styled(Typography)({ color: 'rgba(255,255,255,0.32)', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: 0 })
const InProgressTag = styled('span')({ color: '#C8FF00', fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' })
const DeliveryCard  = styled(Box)({ ...glassCard, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 8 })
const TruckBox      = styled(Box)({ width: 42, height: 42, borderRadius: 13, background: 'rgba(200,255,0,0.09)', border: '1px solid rgba(200,255,0,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 })
const FooterArea    = styled(Box)({ padding: '16px 24px 48px', display: 'flex', flexDirection: 'column', gap: 10 })
const SecondaryBtn  = styled(MotionButton)({ height: 50, borderRadius: '18px', fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.11)', color: 'rgba(255,255,255,0.72)' })

const ActivePulse = () => (
  <motion.div
    animate={{ scale: [1, 1.35, 1] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
    style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8FF00' }}
  />
)

const OrderTracking = () => {
  const navigate = useNavigate()

  const goToPurchaseDetails = () => navigate('/onboarding/device-purchase-details')
  const goToSetup = () => navigate('/onboarding/add-vehicle')
  const goToDashboard = () => navigate('/')

  return (
    <ScreenRoot>
      <Header>
        <BackBtn variant="outlined" whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}>
          <ChevronLeft size={18} color="rgba(255,255,255,0.7)" />
        </BackBtn>
        <HeaderTitle>Order Status</HeaderTitle>
      </Header>

      <ScrollArea>
        {/* Hero */}
        <HeroBox>
          <HeroCircle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.15 }}
          >
            <Package size={28} color="#C8FF00" />
          </HeroCircle>
          <HeroTitle
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            Order Confirmed!
          </HeroTitle>
          <HeroSub
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            Order #TL-48291 · TrackLynk OBD Pro
          </HeroSub>
        </HeroBox>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <TimelineCard>
            {STAGES.map((stage, i) => (
              <StageRow key={stage.id} sx={{ mb: i < STAGES.length - 1 ? 0 : 0 }}>
                {i < STAGES.length - 1 && <Connector lit={stage.done} />}
                <DotBase done={stage.done} active={stage.active}>
                  {stage.done ? (
                    <Check size={13} color="#000" strokeWidth={3} />
                  ) : stage.active ? (
                    <ActivePulse />
                  ) : (
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
                  )}
                </DotBase>
                <Box sx={{ flex: 1, pb: i < STAGES.length - 1 ? '26px' : 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '2px' }}>
                    <StageLabel lit={stage.done} active={stage.active}>{stage.label}</StageLabel>
                    {stage.active && <InProgressTag>IN PROGRESS</InProgressTag>}
                  </Box>
                  <StageSub>{stage.sub}</StageSub>
                </Box>
              </StageRow>
            ))}
          </TimelineCard>
        </motion.div>

        {/* Delivery info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
          <DeliveryCard>
            <TruckBox><Truck size={20} color="#C8FF00" /></TruckBox>
            <Box>
              <Typography sx={{ color: '#fff', fontSize: 13.5, fontWeight: 600, mb: '3px' }}>
                Est. Delivery: May 7–8
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>
                FedEx Ground · TL48291XFDX
              </Typography>
            </Box>
          </DeliveryCard>
        </motion.div>
      </ScrollArea>

      {/* CTAs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <FooterArea>
          <MotionButton
            fullWidth
            variant="text"
            whileTap={{ scale: 0.97 }}
            onClick={goToPurchaseDetails}
            sx={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.42)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)', textUnderlineOffset: '3px' }}
          >
            View Purchase Details
          </MotionButton>
          <PrimaryButton onClick={goToSetup} label="Set Up Vehicle / Device" />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
            >
              <SecondaryBtn fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={goToDashboard}>
                Go to Dashboard
              </SecondaryBtn>
            </motion.div>
          </AnimatePresence>
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default OrderTracking
