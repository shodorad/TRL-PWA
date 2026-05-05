import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, Typography, TextField, InputAdornment } from '@mui/material'
import { CreditCard, Lock, ShieldCheck } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'
import { usePlan } from '@/contexts/PlanContext'

const STEP = 3
const TOTAL = 8

// ── Helpers ──────────────────────────────────────────────────
const formatCard = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

const detectCard = (num: string): string => {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n)) return 'Visa'
  if (/^5[1-5]/.test(n)) return 'MC'
  if (/^3[47]/.test(n)) return 'Amex'
  return ''
}

const TIER_LABELS: Record<string, string> = { personal: 'Personal', business: 'Business', fleet: 'Fleet' }
const DEVICE_PRICE = 49.99

// ── Styled ───────────────────────────────────────────────────
const ScreenRoot      = styled('div')({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 16, background: 'transparent', position: 'relative' })
const ScrollArea      = styled('div')({ flex: 1, overflowY: 'auto', padding: '16px 24px 0' })
const Heading         = styled('h2')({ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.6px', fontFamily: 'Inter, sans-serif' })
const SubHeading      = styled('p')({ color: 'rgba(255,255,255,0.42)', fontSize: 14, marginBottom: 20, fontFamily: 'Inter, sans-serif' })
const SummaryCard     = styled('div')({ ...glassCard, padding: '16px 18px', marginBottom: 20 })
const SummaryTitle    = styled(Typography)({ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 })
const SummaryRow      = styled('div')({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 })
const SummaryLabel    = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.65)' })
const SummaryValue    = styled(Typography)({ fontSize: 13.5, fontWeight: 600, color: '#fff' })
const Divider         = styled('div')({ height: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 0' })
const TotalRow        = styled('div')({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })
const TotalLabel      = styled(Typography)({ fontSize: 14, fontWeight: 700, color: '#fff' })
const TotalValue      = styled(Typography)({ fontSize: 20, fontWeight: 900, color: '#C8FF00', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' })
const CardSection     = styled('div')({ ...glassCard, padding: '18px', marginBottom: 16 })
const SectionLabel    = styled(Typography)({ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 16 })
const FieldGroup      = styled('div')({ display: 'flex', flexDirection: 'column', gap: 14 })
const FieldLabel      = styled(Typography)({ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, letterSpacing: '0.2px', display: 'block', marginBottom: 7 })
const SplitRow        = styled('div')({ display: 'flex', gap: 12 })
const CardTypeTag     = styled('span')({ fontSize: 11, fontWeight: 700, color: '#C8FF00', background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.22)', borderRadius: 6, padding: '2px 7px' })
const SecureRow       = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4, marginBottom: 16 })
const SecureText      = styled(Typography)({ fontSize: 11.5, color: 'rgba(255,255,255,0.28)' })
const LegalNote       = styled(Typography)({ fontSize: 11, color: 'rgba(255,255,255,0.22)', textAlign: 'center', lineHeight: 1.7, marginBottom: 8 })
const FooterArea      = styled('div')({ padding: '10px 24px 48px' })
const ErrorText       = styled(Typography)({ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, marginTop: 5 })

const Payment = () => {
  const navigate = useNavigate()
  const { plan }  = usePlan()

  const [card, setCard]       = useState('')
  const [expiry, setExpiry]   = useState('')
  const [cvv, setCvv]         = useState('')
  const [name, setName]       = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const cardDigits = card.replace(/\s/g, '')
  const errors = {
    card:   cardDigits.length < 16 ? 'Enter a valid 16-digit card number' : null,
    expiry: expiry.length < 5      ? 'Enter MM/YY'                        : null,
    cvv:    cvv.length < 3         ? 'Enter 3 or 4 digits'                : null,
    name:   !name.trim()           ? 'Required'                           : null,
  }
  const isValid = Object.values(errors).every(e => e === null)

  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }))

  const planLabel  = plan ? `${TIER_LABELS[plan.tier]} Plan (${plan.type === 'annual' ? 'Annual' : 'Monthly'})` : 'Plan'
  const planPrice  = plan ? plan.price : 0
  const deviceCost = plan?.deviceOrdered ? DEVICE_PRICE : 0
  const total      = planPrice + deviceCost

  const cardType = detectCard(card)

  const handleComplete = () => {
    if (!isValid) { setTouched({ card: true, expiry: true, cvv: true, name: true }); return }
    navigate('/onboarding/add-vehicle')
  }

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Payment" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Heading>Complete your order</Heading>
          <SubHeading>Secure payment — you won't be charged until setup is done.</SubHeading>
        </motion.div>

        {/* Order summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SummaryCard>
            <SummaryTitle>Order Summary</SummaryTitle>
            <SummaryRow>
              <SummaryLabel>{planLabel}</SummaryLabel>
              <SummaryValue>${planPrice.toFixed(2)}/mo</SummaryValue>
            </SummaryRow>
            {plan?.deviceOrdered && (
              <SummaryRow>
                <SummaryLabel>TrackLynk OBD-II Device</SummaryLabel>
                <SummaryValue>${deviceCost.toFixed(2)}</SummaryValue>
              </SummaryRow>
            )}
            <Divider />
            <TotalRow>
              <TotalLabel>Due today</TotalLabel>
              <TotalValue>${total.toFixed(2)}</TotalValue>
            </TotalRow>
          </SummaryCard>
        </motion.div>

        {/* Card form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CardSection>
            <SectionLabel>Card details</SectionLabel>
            <FieldGroup>
              {/* Card number */}
              <Box>
                <FieldLabel>Card number</FieldLabel>
                <TextField
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  value={card}
                  onChange={e => setCard(formatCard(e.target.value))}
                  onBlur={() => touch('card')}
                  inputMode="numeric"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard size={16} color="rgba(255,255,255,0.35)" />
                        </InputAdornment>
                      ),
                      endAdornment: cardType ? (
                        <InputAdornment position="end">
                          <CardTypeTag>{cardType}</CardTypeTag>
                        </InputAdornment>
                      ) : undefined,
                    },
                  }}
                />
                {touched.card && errors.card && <ErrorText>{errors.card}</ErrorText>}
              </Box>

              {/* Expiry + CVV */}
              <SplitRow>
                <Box sx={{ flex: 1 }}>
                  <FieldLabel>Expiry</FieldLabel>
                  <TextField
                    fullWidth
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    onBlur={() => touch('expiry')}
                    inputMode="numeric"
                  />
                  {touched.expiry && errors.expiry && <ErrorText>{errors.expiry}</ErrorText>}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FieldLabel>CVV</FieldLabel>
                  <TextField
                    fullWidth
                    placeholder="•••"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onBlur={() => touch('cvv')}
                    type="password"
                    inputMode="numeric"
                  />
                  {touched.cvv && errors.cvv && <ErrorText>{errors.cvv}</ErrorText>}
                </Box>
              </SplitRow>

              {/* Name */}
              <Box>
                <FieldLabel>Cardholder name</FieldLabel>
                <TextField
                  fullWidth
                  placeholder="Jane Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => touch('name')}
                  autoCapitalize="words"
                />
                {touched.name && errors.name && <ErrorText>{errors.name}</ErrorText>}
              </Box>
            </FieldGroup>
          </CardSection>

          <SecureRow>
            <Lock size={12} color="rgba(255,255,255,0.28)" />
            <SecureText>256-bit SSL encryption</SecureText>
            <ShieldCheck size={12} color="rgba(200,255,0,0.5)" />
            <SecureText>PCI DSS compliant</SecureText>
          </SecureRow>

          <LegalNote>
            Your card will be charged ${total.toFixed(2)} today. Subscription renews monthly or annually based on your plan. Cancel any time in Settings.
          </LegalNote>
        </motion.div>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterArea>
          <PrimaryButton onClick={handleComplete} label={`Pay $${total.toFixed(2)} & Continue`} />
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default Payment
