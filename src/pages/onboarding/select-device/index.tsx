import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { Check, Package, Wifi } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'
import { usePlan } from '@/contexts/PlanContext'

const STEP = 2
const TOTAL = 8

type DeviceOption = 'buy' | 'have'

interface DeviceConfig {
  id: DeviceOption
  label: string
  sublabel: string
  price: string | null
  badge: string | null
  features: string[]
  icon: typeof Package
}

const DEVICE_OPTIONS: DeviceConfig[] = [
  {
    id: 'buy',
    label: 'Order a new device',
    sublabel: 'TrackLynk OBD-II — Ships in 2–3 days',
    price: '$49.99',
    badge: 'Recommended',
    features: [
      'Real-time GPS + cellular',
      'OBD-II engine diagnostics',
      'Trip & event recording',
      '5-year hardware warranty',
    ],
    icon: Package,
  },
  {
    id: 'have',
    label: 'I already have a device',
    sublabel: 'Activate your existing TrackLynk unit',
    price: null,
    badge: null,
    features: [
      'Scan barcode to pair',
      'No shipping required',
      'Activate in minutes',
    ],
    icon: Wifi,
  },
]

// ── Styled ───────────────────────────────────────────────────
const ScreenRoot      = styled('div')({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 16, background: 'transparent', position: 'relative' })
const ScrollArea      = styled('div')({ flex: 1, overflowY: 'auto', padding: '16px 24px 0' })
const Heading         = styled('h2')({ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.6px', fontFamily: 'Inter, sans-serif' })
const SubHeading      = styled('p')({ color: 'rgba(255,255,255,0.42)', fontSize: 14, marginBottom: 24, fontFamily: 'Inter, sans-serif' })
const DeviceCard      = styled('div')<{ selected: boolean }>(({ selected }) => ({ ...glassCard, padding: '20px', marginBottom: 14, cursor: 'pointer', border: selected ? '1.5px solid rgba(200,255,0,0.55)' : '1px solid rgba(255,255,255,0.10)', background: selected ? 'rgba(200,255,0,0.05)' : 'rgba(255,255,255,0.055)', boxShadow: selected ? '0 0 24px rgba(200,255,0,0.08), 0 8px 32px rgba(0,0,0,0.55)' : '0 8px 32px rgba(0,0,0,0.55)', transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden' }))
const CardTop         = styled('div')({ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 })
const CardLeft        = styled('div')({ display: 'flex', gap: 12 })
const IconBox         = styled('div')<{ selected: boolean }>(({ selected }) => ({ width: 44, height: 44, borderRadius: 14, background: selected ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.07)', border: selected ? '1px solid rgba(200,255,0,0.28)' : '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s, border-color 0.2s' }))
const CardLabelBlock  = styled('div')({})
const CardLabel       = styled(Typography)({ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', marginBottom: 2 })
const CardSublabel    = styled(Typography)({ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 })
const BadgeRow        = styled('div')({ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 })
const RecommendBadge  = styled('span')({ fontSize: 10, background: 'rgba(200,255,0,0.14)', color: '#C8FF00', padding: '3px 9px', borderRadius: 99, fontWeight: 700, border: '1px solid rgba(200,255,0,0.28)' })
const PriceTag        = styled('span')({ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'Inter, sans-serif' })
const PriceCaption    = styled('span')({ fontSize: 10, color: 'rgba(255,255,255,0.32)', display: 'block', textAlign: 'right' })
const Divider         = styled('div')({ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 14 })
const FeatureList     = styled('div')({ display: 'flex', flexDirection: 'column', gap: 8 })
const FeatureRow      = styled('div')({ display: 'flex', alignItems: 'center', gap: 9 })
const FeatureDot      = styled('div')<{ selected: boolean }>(({ selected }) => ({ width: 16, height: 16, borderRadius: '50%', background: selected ? 'rgba(200,255,0,0.15)' : 'rgba(255,255,255,0.07)', border: selected ? '1px solid rgba(200,255,0,0.35)' : '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s, border-color 0.2s' }))
const FeatureText     = styled('span')({ color: 'rgba(255,255,255,0.68)', fontSize: 12.5, fontFamily: 'Inter, sans-serif' })
const DeviceVisual    = styled(Box)({ margin: '20px 0 8px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' })
const OBDUnit         = styled(Box)({ width: 140, height: 96, borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', overflow: 'hidden' })
const OBDLabel        = styled(Typography)({ fontSize: 7, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' })
const Barcode         = styled(Box)({ display: 'flex', gap: 2.5, alignItems: 'center' })
const Bar             = styled(Box)<{ h: number }>(({ h }) => ({ width: 2, height: h * 2.8, background: 'rgba(255,255,255,0.55)', borderRadius: 1 }))
const Serial          = styled(Typography)({ fontSize: 7, letterSpacing: '1.5px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)' })
const FooterArea      = styled('div')({ padding: '14px 24px 48px' })

const DeviceCard3D = () => (
  <DeviceVisual>
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
      <OBDUnit>
        <OBDLabel>TRACKLYNK OBD-II</OBDLabel>
        <Barcode>
          {[8, 4, 7, 3, 9, 4, 6, 3, 8, 5, 7, 4, 6].map((h, i) => <Bar key={i} h={h} />)}
        </Barcode>
        <Serial>352602116146553</Serial>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ position: 'absolute', top: 10, right: 12, width: 7, height: 7, borderRadius: '50%', background: '#C8FF00', boxShadow: '0 0 6px rgba(200,255,0,0.7)' }}
        />
      </OBDUnit>
    </motion.div>
  </DeviceVisual>
)

const SelectDevice = () => {
  const navigate = useNavigate()
  const { plan, setPlan } = usePlan()
  const [selected, setSelected] = useState<DeviceOption>('buy')

  const handleNext = () => {
    if (plan) setPlan({ ...plan, deviceOrdered: selected === 'buy' })
    navigate('/onboarding/payment')
  }

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Select Device" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Heading>Get your device</Heading>
          <SubHeading>Choose how you'd like to set up your TrackLynk hardware.</SubHeading>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <DeviceCard3D />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {DEVICE_OPTIONS.map(opt => {
            const isSelected = selected === opt.id
            const Icon = opt.icon
            return (
              <motion.div key={opt.id} whileTap={{ scale: 0.985 }} onClick={() => setSelected(opt.id)}>
                <DeviceCard selected={isSelected}>
                  <CardTop>
                    <CardLeft>
                      <IconBox selected={isSelected}>
                        <Icon size={20} color={isSelected ? '#C8FF00' : 'rgba(255,255,255,0.45)'} />
                      </IconBox>
                      <CardLabelBlock>
                        <CardLabel>{opt.label}</CardLabel>
                        <CardSublabel variant="caption">{opt.sublabel}</CardSublabel>
                      </CardLabelBlock>
                    </CardLeft>
                    <BadgeRow>
                      {opt.badge && <RecommendBadge>{opt.badge}</RecommendBadge>}
                      {opt.price ? (
                        <div>
                          <PriceTag>{opt.price}</PriceTag>
                          <PriceCaption>one-time</PriceCaption>
                        </div>
                      ) : (
                        isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 22, height: 22, borderRadius: '50%', background: '#C8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={13} color="#000" strokeWidth={3} />
                          </motion.div>
                        )
                      )}
                    </BadgeRow>
                  </CardTop>

                  <Divider />

                  <FeatureList>
                    {opt.features.map(text => (
                      <FeatureRow key={text}>
                        <FeatureDot selected={isSelected}>
                          <Check size={9} color={isSelected ? '#C8FF00' : 'rgba(255,255,255,0.3)'} strokeWidth={3} />
                        </FeatureDot>
                        <FeatureText>{text}</FeatureText>
                      </FeatureRow>
                    ))}
                  </FeatureList>
                </DeviceCard>
              </motion.div>
            )
          })}
        </motion.div>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterArea>
          <PrimaryButton onClick={handleNext} label="Continue to Payment" />
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default SelectDevice
