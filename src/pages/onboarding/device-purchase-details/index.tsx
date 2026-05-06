import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'
import { Cpu, Calendar, CreditCard, Check, Zap, ExternalLink, ChevronLeft } from 'lucide-react'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'
import { usePlan } from '@/contexts/PlanContext'

const MotionButton = motion.create(Button)

const TIER_LABELS: Record<string, string> = { personal: 'Personal', business: 'Business', fleet: 'Fleet' }
const TIER_VEHICLES: Record<string, string> = { personal: '1 vehicle', business: 'Up to 5 vehicles', fleet: 'Unlimited vehicles' }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } } }
const item      = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 28 } } }

// ── Styled ───────────────────────────────────────────────────
const ScreenRoot      = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 16, background: 'transparent' })
const Header          = styled(Box)({ display: 'flex', alignItems: 'center', padding: '14px 24px 0', position: 'relative' })
const BackBtn         = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const HeaderTitle     = styled(Typography)({ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 16, fontWeight: 700 })
const ScrollArea      = styled(Box)({ flex: 1, overflowY: 'auto', padding: '18px 24px 0' })
const DeviceCard      = styled(motion.div)({ ...glassCard, padding: 18, background: 'rgba(200,255,0,0.04)', border: '1px solid rgba(200,255,0,0.18)', marginBottom: 14 })
const DeviceTopRow    = styled(Box)({ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 })
const DeviceIconBox   = styled(Box)({ width: 50, height: 50, borderRadius: 15, flexShrink: 0, background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(200,255,0,0.1)' })
const DeviceName      = styled(Typography)({ fontSize: 15, fontWeight: 700, marginBottom: '3px' })
const DeviceModel     = styled(Typography)({ fontSize: 12, color: 'rgba(255,255,255,0.38)' })
const DeviceMetaRow   = styled(Box)({ display: 'flex', justifyContent: 'space-between' })
const MetaLabel       = styled(Typography)({ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' })
const MetaValue       = styled(Typography)<{ highlight?: boolean }>(({ highlight }) => ({ fontSize: 12.5, fontWeight: highlight ? 600 : 400, color: highlight ? '#C8FF00' : 'rgba(255,255,255,0.7)' }))
const ReceiptCard     = styled(motion.div)({ ...glassCard, padding: '18px', marginBottom: 14 })
const ReceiptHeader   = styled(Box)({ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 })
const SectionTag      = styled(Typography)({ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' })
const OrderNum        = styled(Typography)({ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.38)' })
const LineRow         = styled(Box)({ display: 'flex', justifyContent: 'space-between', marginBottom: 9 })
const LineLabel       = styled(Typography)({ fontSize: 13, color: 'rgba(255,255,255,0.48)' })
const LineValue       = styled(Typography)({ fontSize: 13, color: 'rgba(255,255,255,0.72)' })
const Divider         = styled(Box)({ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0 12px' })
const TotalRow        = styled(Box)({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 })
const TotalLabel      = styled(Typography)({ fontSize: 14, fontWeight: 700 })
const TotalValue      = styled(Typography)({ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', color: '#C8FF00', fontFamily: 'Inter, sans-serif' })
const PaidRow         = styled(Box)({ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 11 })
const PaidCheck       = styled(Box)({ width: 16, height: 16, borderRadius: '50%', background: 'rgba(74,222,128,0.18)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' })
const SubscriptionCard = styled(motion.div)({ ...glassCard, padding: '16px 18px', marginBottom: 14 })
const SubHeader       = styled(Box)({ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 })
const FooterArea      = styled(Box)({ padding: '16px 24px 48px', display: 'flex', flexDirection: 'column', gap: 10 })
const ReceiptLink     = styled('button')({ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.38)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', fontFamily: 'Inter, sans-serif', width: '100%' })

const DevicePurchaseDetails = () => {
  const navigate = useNavigate()
  const { plan } = usePlan()

  const tierLabel     = plan?.tier ? TIER_LABELS[plan.tier] : 'Personal'
  const tierVehicles  = plan?.tier ? TIER_VEHICLES[plan.tier] : '1 vehicle'
  const planPrice     = plan?.price ?? 9.65
  const deviceOrdered = plan?.deviceOrdered ?? false
  const deviceCost    = deviceOrdered ? 49.00 : 0
  const tax           = +(((planPrice + deviceCost) * 0.08).toFixed(2))
  const total         = +(planPrice + deviceCost + tax).toFixed(2)

  const nextBilling = (() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  })()

  return (
    <ScreenRoot>
      <Header>
        <BackBtn variant="outlined" whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}>
          <ChevronLeft size={18} color="rgba(255,255,255,0.7)" />
        </BackBtn>
        <HeaderTitle>Purchase Details</HeaderTitle>
      </Header>

      <ScrollArea>
        <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Device card */}
          <DeviceCard variants={item}>
            <DeviceTopRow>
              <DeviceIconBox><Cpu size={23} color="#C8FF00" /></DeviceIconBox>
              <Box>
                <DeviceName>TrackLynk OBD Pro</DeviceName>
                <DeviceModel variant="caption">Model: TL-OBD2-2024</DeviceModel>
              </Box>
            </DeviceTopRow>
            <DeviceMetaRow>
              <Box>
                <MetaLabel>Serial No.</MetaLabel>
                <MetaValue>SN-48291-XF7K</MetaValue>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <MetaLabel>Status</MetaLabel>
                <MetaValue highlight>Awaiting Activation</MetaValue>
              </Box>
            </DeviceMetaRow>
          </DeviceCard>

          {/* Order receipt */}
          <ReceiptCard variants={item}>
            <ReceiptHeader>
              <Calendar size={14} color="rgba(255,255,255,0.38)" />
              <SectionTag>Order Receipt</SectionTag>
              <OrderNum>#TL-48291</OrderNum>
            </ReceiptHeader>

            {[
              { label: 'Date', value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
              ...(deviceOrdered ? [{ label: 'TrackLynk OBD Pro', value: `$${deviceCost.toFixed(2)}` }] : []),
              { label: `${tierLabel} Plan`, value: `$${planPrice.toFixed(2)}/mo` },
              { label: 'Tax', value: `$${tax.toFixed(2)}` },
            ].map(({ label, value }) => (
              <LineRow key={label}>
                <LineLabel>{label}</LineLabel>
                <LineValue>{value}</LineValue>
              </LineRow>
            ))}

            <Divider />

            <TotalRow>
              <TotalLabel>Total Charged</TotalLabel>
              <TotalValue>${total.toFixed(2)}</TotalValue>
            </TotalRow>

            <PaidRow>
              <CreditCard size={14} color="rgba(255,255,255,0.35)" />
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Visa ending 4242</Typography>
              <PaidCheck>
                <Check size={9} color="#4ade80" strokeWidth={3} />
              </PaidCheck>
              <Typography sx={{ color: '#4ade80', fontSize: 11.5, fontWeight: 600, ml: '6px' }}>Paid</Typography>
            </PaidRow>
          </ReceiptCard>

          {/* Subscription summary */}
          <SubscriptionCard variants={item}>
            <SubHeader>
              <Zap size={14} color="#C8FF00" />
              <SectionTag>Subscription</SectionTag>
            </SubHeader>
            {[
              { label: 'Plan',         value: `${tierLabel} Plan` },
              { label: 'Vehicles',     value: tierVehicles },
              { label: 'Next Billing', value: nextBilling },
            ].map(({ label, value }) => (
              <LineRow key={label}>
                <LineLabel>{label}</LineLabel>
                <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, fontWeight: 500 }}>{value}</Typography>
              </LineRow>
            ))}
          </SubscriptionCard>

        </motion.div>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
        <FooterArea>
          <PrimaryButton onClick={() => {}} label="Acknowledge My Order" />
          <ReceiptLink>
            <ExternalLink size={13} />
            View Receipt Email
          </ReceiptLink>
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default DevicePurchaseDetails
