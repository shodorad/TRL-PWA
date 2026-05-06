import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { Check, Zap, Shield, MapPin, Building2, Truck } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'
import { usePlan } from '@/contexts/PlanContext'
import type { PlanTier } from '@/contexts/PlanContext'
import { SegmentedControl, IconBox } from '@/components'
import { colors } from '@/styles/tokens'

const STEP = 1
const TOTAL = 10

// ── Pricing ──────────────────────────────────────────────────
const PLANS: {
  tier: PlanTier
  label: string
  icon: typeof MapPin
  monthly: number
  annual: number
  badge?: string
  vehicles: string
  features: string[]
}[] = [
  {
    tier: 'personal',
    label: 'Personal',
    icon: MapPin,
    monthly: 9.65,
    annual: 7.99,
    vehicles: '1 vehicle',
    features: [
      'Real-time GPS tracking',
      'Speed & trip alerts',
      'Geofence zones',
      'Unlimited trip history',
    ],
  },
  {
    tier: 'business',
    label: 'Business',
    icon: Building2,
    monthly: 24.99,
    annual: 19.99,
    badge: 'Most popular',
    vehicles: 'Up to 5 vehicles',
    features: [
      'Everything in Personal',
      'Driver behavior reports',
      'Fleet trip reporting',
      'Priority support',
      'Export data (CSV)',
    ],
  },
  {
    tier: 'fleet',
    label: 'Fleet',
    icon: Truck,
    monthly: 59.99,
    annual: 49.99,
    vehicles: 'Unlimited vehicles',
    features: [
      'Everything in Business',
      'Fleet analytics dashboard',
      'API access',
      'Multi-driver management',
      'Dedicated account manager',
    ],
  },
]

// ── Styled ───────────────────────────────────────────────────
const ScreenRoot      = styled('div')({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 16, background: 'transparent', position: 'relative' })
const ScrollArea      = styled('div')({ flex: 1, overflowY: 'auto', padding: '16px 24px 0' })
const Heading         = styled('h2')({ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.6px', fontFamily: 'Inter, sans-serif' })
const SubHeading      = styled('p')({ color: 'rgba(255,255,255,0.42)', fontSize: 14, marginBottom: 20, fontFamily: 'Inter, sans-serif' })
const PlanCardWrapper = styled('div')<{ selected: boolean }>(({ selected }) => ({ ...glassCard, padding: '18px', marginBottom: 12, cursor: 'pointer', border: selected ? '1.5px solid rgba(200,255,0,0.55)' : '1px solid rgba(255,255,255,0.10)', background: selected ? 'rgba(200,255,0,0.05)' : 'rgba(255,255,255,0.055)', boxShadow: selected ? '0 0 24px rgba(200,255,0,0.08), 0 8px 32px rgba(0,0,0,0.55)' : '0 8px 32px rgba(0,0,0,0.55)', transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden' }))
const CardTopRow      = styled('div')({ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 })
const CardLeft        = styled('div')({ display: 'flex', alignItems: 'center', gap: 10 })
const TierLabel       = styled('span')<{ selected: boolean }>(({ selected }) => ({ fontSize: 16, fontWeight: 800, color: selected ? '#fff' : 'rgba(255,255,255,0.85)', letterSpacing: '-0.3px', fontFamily: 'Inter, sans-serif', display: 'block' }))
const VehicleCaption  = styled('span')({ fontSize: 11.5, color: 'rgba(255,255,255,0.32)', fontFamily: 'Inter, sans-serif', display: 'block', marginTop: 1 })
const PopularBadge    = styled('span')({ fontSize: 10, background: 'rgba(200,255,0,0.14)', color: '#C8FF00', padding: '3px 9px', borderRadius: 99, fontWeight: 700, border: '1px solid rgba(200,255,0,0.28)', flexShrink: 0 })
const PriceBlock      = styled('div')({ marginBottom: 12 })
const PriceAmount     = styled('span')<{ selected: boolean }>(({ selected }) => ({ fontSize: 30, fontWeight: 900, color: selected ? '#C8FF00' : '#fff', lineHeight: 1, fontFamily: 'Inter, sans-serif', letterSpacing: '-1.5px', transition: 'color 0.2s' }))
const PricePeriod     = styled('span')({ color: 'rgba(255,255,255,0.38)', fontSize: 12, fontFamily: 'Inter, sans-serif' })
const Divider         = styled('div')({ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0' })
const FeatureList     = styled('div')({ display: 'flex', flexDirection: 'column', gap: 7 })
const FeatureRow      = styled('div')({ display: 'flex', alignItems: 'center', gap: 8 })
const CheckDot        = styled('div')<{ selected: boolean }>(({ selected }) => ({ width: 16, height: 16, borderRadius: '50%', background: selected ? 'rgba(200,255,0,0.15)' : 'rgba(255,255,255,0.07)', border: selected ? '1px solid rgba(200,255,0,0.35)' : '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s, border-color 0.2s' }))
const FeatureText     = styled('span')({ color: 'rgba(255,255,255,0.68)', fontSize: 12.5, fontFamily: 'Inter, sans-serif' })
const LegalNote       = styled('p')({ color: 'rgba(255,255,255,0.22)', fontSize: 11, textAlign: 'center', lineHeight: 1.7, marginBottom: 8, fontFamily: 'Inter, sans-serif' })
const FooterArea      = styled('div')({ padding: '14px 24px 48px' })

const PlanCard = ({ plan, selected, annual, onSelect }: {
  plan: typeof PLANS[0]
  selected: boolean
  annual: boolean
  onSelect: () => void
}) => {
  const price = annual ? plan.annual : plan.monthly
  const Icon = plan.icon
  return (
    <motion.div whileTap={{ scale: 0.985 }} onClick={onSelect}>
      <PlanCardWrapper selected={selected}>
        <CardTopRow>
          <CardLeft>
            <IconBox
              icon={<Icon size={16} color={selected ? colors.lime : colors.textSecondary} />}
              size="sm"
              variant={selected ? 'lime' : 'surface'}
              borderRadius={999}
            />
            <div>
              <TierLabel selected={selected}>{plan.label}</TierLabel>
              <VehicleCaption>{plan.vehicles}</VehicleCaption>
            </div>
          </CardLeft>
          {plan.badge && <PopularBadge>{plan.badge}</PopularBadge>}
          {selected && !plan.badge && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 20, height: 20, borderRadius: '50%', background: '#C8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={12} color="#000" strokeWidth={3} />
            </motion.div>
          )}
        </CardTopRow>

        <PriceBlock>
          <motion.span key={price} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <PriceAmount selected={selected}>${price.toFixed(2)}</PriceAmount>
          </motion.span>
          <PricePeriod>/mo{annual ? ', billed yearly' : ''}</PricePeriod>
        </PriceBlock>

        <Divider />

        <FeatureList>
          {plan.features.map(text => (
            <FeatureRow key={text}>
              <CheckDot selected={selected}>
                <Check size={9} color={selected ? '#C8FF00' : 'rgba(255,255,255,0.3)'} strokeWidth={3} />
              </CheckDot>
              <FeatureText>{text}</FeatureText>
            </FeatureRow>
          ))}
        </FeatureList>
      </PlanCardWrapper>
    </motion.div>
  )
}

const ChoosePlan = () => {
  const navigate = useNavigate()
  const { setPlan } = usePlan()
  const [annual, setAnnual] = useState(false)
  const [selectedTier, setSelectedTier] = useState<PlanTier>('personal')

  const selected = PLANS.find(p => p.tier === selectedTier)!
  const price = annual ? selected.annual : selected.monthly

  const handleNext = () => {
    setPlan({ tier: selectedTier, type: annual ? 'annual' : 'monthly', price, deviceOrdered: false })
    navigate('/onboarding/select-device')
  }

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Choose Your Plan" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Heading>Pick your plan</Heading>
          <SubHeading>Upgrade or downgrade any time.</SubHeading>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Box sx={{ mb: '20px' }}>
            <SegmentedControl
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual',  label: 'Annual · Save 20%' },
              ]}
              value={annual ? 'annual' : 'monthly'}
              onChange={(v) => setAnnual(v === 'annual')}
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {PLANS.map(plan => (
            <PlanCard
              key={plan.tier}
              plan={plan}
              selected={selectedTier === plan.tier}
              annual={annual}
              onSelect={() => setSelectedTier(plan.tier)}
            />
          ))}
        </motion.div>

        <LegalNote>Cancel any time. No hidden fees.</LegalNote>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterArea>
          <PrimaryButton onClick={handleNext} label={`Continue with ${selected.label} — $${price.toFixed(2)}/mo`} />
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default ChoosePlan
