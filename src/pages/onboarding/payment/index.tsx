import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { styled } from '@mui/material/styles'
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material'
import { CreditCard, Lock, Shield, Tag } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'
import { usePlan } from '@/contexts/PlanContext'

const STEP = 3
const TOTAL = 10

const MotionButton = motion.create(Button)

// ── Helpers ──────────────────────────────────────────────────
const formatCard = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

const detectCard = (num: string): string => {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n))      return 'Visa'
  if (/^5[1-5]/.test(n)) return 'MC'
  if (/^3[47]/.test(n))  return 'Amex'
  return ''
}

const TIER_LABELS: Record<string, string> = { personal: 'Personal', business: 'Business', fleet: 'Fleet' }
const DEVICE_PRICE = 49.00

type PayMethod = 'card' | 'apple'

// ── Styled ───────────────────────────────────────────────────
const ScreenRoot      = styled('div')({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 16, background: 'transparent', position: 'relative' })
const ScrollArea      = styled('div')({ flex: 1, overflowY: 'auto', padding: '20px 24px 0' })
const Heading         = styled('h2')({ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.6px', fontFamily: 'Inter, sans-serif' })
const SubHeading      = styled('p')({ color: 'rgba(255,255,255,0.42)', fontSize: 14, marginBottom: 20, fontFamily: 'Inter, sans-serif' })
const SummaryCard     = styled('div')({ ...glassCard, padding: '16px 18px', marginBottom: 20 })
const SummaryTitle    = styled(Typography)({ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 })
const LineRow         = styled(Box)({ display: 'flex', justifyContent: 'space-between', marginBottom: 10 })
const LineLabel       = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.68)' })
const LineValue       = styled(Typography)({ fontSize: 13.5, fontWeight: 600, color: '#fff' })
const Divider         = styled(Box)({ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0 12px' })
const TotalRow        = styled(Box)({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })
const TotalLabel      = styled(Typography)({ fontSize: 14.5, fontWeight: 700 })
const TotalValue      = styled(Typography)({ fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px', color: '#C8FF00', fontFamily: 'Inter, sans-serif' })
const MethodTabRow    = styled(Box)({ display: 'flex', gap: 8, marginBottom: 18 })
const MethodTab       = styled(MotionButton)<{ active?: boolean }>(({ active }) => ({ flex: 1, height: 44, borderRadius: '14px', fontSize: 13.5, fontWeight: 600, background: active ? 'rgba(200,255,0,0.10)' : 'rgba(255,255,255,0.05)', border: active ? '1.5px solid rgba(200,255,0,0.4)' : '1.5px solid rgba(255,255,255,0.08)', color: active ? '#C8FF00' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s' }))
const ApplePayBox     = styled(Box)({ ...glassCard, padding: '24px 20px', textAlign: 'center' })
const FieldLabel      = styled(Typography)({ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, letterSpacing: '0.2px', display: 'block', marginBottom: 7 })
const SplitRow        = styled(Box)({ display: 'flex', gap: 12 })
const CardTypeTag     = styled('span')({ fontSize: 11, fontWeight: 700, color: '#C8FF00', background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.22)', borderRadius: 6, padding: '2px 7px' })
const ErrorText       = styled(Typography)({ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, marginTop: 5 })
const PromoToggle     = styled('button')({ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, padding: 0, marginTop: 18 })
const PromoLabel      = styled('span')({ color: '#C8FF00', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' })
const PromoRow        = styled(Box)({ display: 'flex', gap: 8, marginTop: 10, overflow: 'hidden' })
const PromoApplyBtn   = styled(MotionButton)({ height: 44, padding: '0 18px', borderRadius: '14px', background: 'rgba(200,255,0,0.12)', border: '1.5px solid rgba(200,255,0,0.3)', color: '#C8FF00', fontSize: 13, fontWeight: 600, minWidth: 0 })
const SecureRow       = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '14px 0 6px' })
const SecureItem      = styled(Box)({ display: 'flex', alignItems: 'center', gap: 5 })
const SecureText      = styled(Typography)({ fontSize: 11, color: 'rgba(255,255,255,0.28)' })
const FooterArea      = styled('div')({ padding: '16px 24px 48px' })
const RefundNote      = styled(Typography)({ color: 'rgba(255,255,255,0.22)', fontSize: 11.5, textAlign: 'center', marginTop: 10 })

const Payment = () => {
  const navigate = useNavigate()
  const { plan } = usePlan()

  const [payMethod, setPayMethod] = useState<PayMethod>('card')
  const [card, setCard]           = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [addr, setAddr]           = useState({ line1: '', line2: '', city: '', state: '', zip: '', country: 'US' })
  const [focused, setFocused]     = useState<string | null>(null)
  const [promoOpen, setPromoOpen] = useState(false)
  const [promo, setPromo]         = useState('')
  const [touched, setTouched]     = useState<Record<string, boolean>>({})

  const planLabel  = plan ? `${TIER_LABELS[plan.tier] ?? 'Personal'} Plan` : 'Personal Plan'
  const planPrice  = plan?.price ?? 9.65
  const deviceCost = plan?.deviceOrdered ? DEVICE_PRICE : 0
  const total      = planPrice + deviceCost

  const cardDigits = card.number.replace(/\s/g, '')
  const errors = {
    number:    cardDigits.length < 16 ? 'Enter a valid 16-digit card number' : null,
    expiry:    card.expiry.length < 5 ? 'Enter MM/YY' : null,
    cvv:       card.cvv.length < 3    ? 'Enter 3 or 4 digits'               : null,
    name:      !card.name.trim()      ? 'Required'                          : null,
    addrLine1: !addr.line1.trim()     ? 'Required'                          : null,
    addrCity:  !addr.city.trim()      ? 'Required'                          : null,
    addrState: !addr.state.trim()     ? 'Required'                          : null,
    addrZip:   !/^\d{5}(-\d{4})?$/.test(addr.zip.trim()) ? 'Enter a valid ZIP' : null,
  }
  const isValid = Object.values(errors).every(e => e === null)

  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }))

  const fieldStyle = (key: string) => ({
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: focused === key ? 'rgba(200,255,0,0.6) !important' : undefined,
    },
    '& .MuiOutlinedInput-root.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(200,255,0,0.10)',
    },
  })

  const handlePay = () => {
    const allTouched: Record<string, boolean> = { addrLine1: true, addrCity: true, addrState: true, addrZip: true }
    if (payMethod === 'card') Object.assign(allTouched, { number: true, expiry: true, cvv: true, name: true })
    setTouched(allTouched)
    if (!isValid) return
    // Only show order-tracking when a device was ordered
    navigate(plan?.deviceOrdered ? '/onboarding/order-tracking' : '/onboarding/device-purchase-details')
  }

  const cardType = detectCard(card.number)

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Payment" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Heading>Complete your order</Heading>
          <SubHeading>Secure checkout · Cancel anytime</SubHeading>
        </motion.div>

        {/* Order summary */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SummaryCard>
            <SummaryTitle>Order Summary</SummaryTitle>
            <LineRow>
              <LineLabel>{planLabel}</LineLabel>
              <LineValue>${planPrice.toFixed(2)}/mo</LineValue>
            </LineRow>
            {plan?.deviceOrdered && (
              <LineRow>
                <LineLabel>TrackLynk OBD Pro · ×1</LineLabel>
                <LineValue>${deviceCost.toFixed(2)}</LineValue>
              </LineRow>
            )}
            <Divider />
            <TotalRow>
              <TotalLabel>Total today</TotalLabel>
              <TotalValue>${total.toFixed(2)}</TotalValue>
            </TotalRow>
          </SummaryCard>
        </motion.div>

        {/* Payment method tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <MethodTabRow>
            {([{ id: 'card', label: '💳  Card' }, { id: 'apple', label: '  Apple Pay' }] as { id: PayMethod; label: string }[]).map(({ id, label }) => (
              <MethodTab key={id} active={payMethod === id} variant="outlined" onClick={() => setPayMethod(id)}>
                {label}
              </MethodTab>
            ))}
          </MethodTabRow>
        </motion.div>

        <AnimatePresence mode="wait">
          {payMethod === 'card' ? (
            <motion.div
              key="card-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {/* Card number */}
              <Box>
                <FieldLabel>Card Number</FieldLabel>
                <TextField
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  inputMode="numeric"
                  onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                  onFocus={() => setFocused('number')}
                  onBlur={() => { setFocused(null); touch('number') }}
                  sx={fieldStyle('number')}
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
                {touched.number && errors.number && <ErrorText>{errors.number}</ErrorText>}
              </Box>

              {/* Expiry + CVV */}
              <SplitRow>
                <Box sx={{ flex: 1 }}>
                  <FieldLabel>Expiry</FieldLabel>
                  <TextField
                    fullWidth placeholder="MM / YY" value={card.expiry} inputMode="numeric"
                    onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    onFocus={() => setFocused('expiry')} onBlur={() => { setFocused(null); touch('expiry') }}
                    sx={fieldStyle('expiry')}
                  />
                  {touched.expiry && errors.expiry && <ErrorText>{errors.expiry}</ErrorText>}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FieldLabel>CVV</FieldLabel>
                  <TextField
                    fullWidth placeholder="•••" type="password" value={card.cvv} inputMode="numeric"
                    onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    onFocus={() => setFocused('cvv')} onBlur={() => { setFocused(null); touch('cvv') }}
                    sx={fieldStyle('cvv')}
                  />
                  {touched.cvv && errors.cvv && <ErrorText>{errors.cvv}</ErrorText>}
                </Box>
              </SplitRow>

              {/* Name */}
              <Box>
                <FieldLabel>Name on Card</FieldLabel>
                <TextField
                  fullWidth placeholder="Jane Smith" value={card.name} autoCapitalize="words"
                  onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                  onFocus={() => setFocused('name')} onBlur={() => { setFocused(null); touch('name') }}
                  sx={fieldStyle('name')}
                />
                {touched.name && errors.name && <ErrorText>{errors.name}</ErrorText>}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="apple-pay"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <ApplePayBox>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🍎</div>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, lineHeight: 1.6 }}>
                  Use Touch ID or Face ID to pay{' '}
                  <span style={{ color: '#fff', fontWeight: 600 }}>${total.toFixed(2)}</span>{' '}
                  with Apple Pay
                </Typography>
              </ApplePayBox>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shipping address */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FieldLabel sx={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1px', mb: 0 }}>Shipping Address</FieldLabel>

            {/* Grouped container */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '16px', padding: '16px' }}>
              {/* Address line 1 */}
              <Box>
                <FieldLabel>Address Line 1</FieldLabel>
                <TextField
                  fullWidth placeholder="123 Main St" value={addr.line1} autoCapitalize="words"
                  onChange={e => setAddr(a => ({ ...a, line1: e.target.value }))}
                  onFocus={() => setFocused('addrLine1')} onBlur={() => { setFocused(null); touch('addrLine1') }}
                  sx={fieldStyle('addrLine1')}
                />
                {touched.addrLine1 && errors.addrLine1 && <ErrorText>{errors.addrLine1}</ErrorText>}
              </Box>

              {/* Address line 2 */}
              <Box>
                <FieldLabel>Address Line 2 <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11 }}>(optional)</span></FieldLabel>
                <TextField
                  fullWidth placeholder="Apt, suite, unit…" value={addr.line2} autoCapitalize="words"
                  onChange={e => setAddr(a => ({ ...a, line2: e.target.value }))}
                  onFocus={() => setFocused('addrLine2')} onBlur={() => setFocused(null)}
                  sx={fieldStyle('addrLine2')}
                />
              </Box>

              {/* City + State */}
              <SplitRow>
                <Box sx={{ flex: 2 }}>
                  <FieldLabel>City</FieldLabel>
                  <TextField
                    fullWidth placeholder="New York" value={addr.city} autoCapitalize="words"
                    onChange={e => setAddr(a => ({ ...a, city: e.target.value }))}
                    onFocus={() => setFocused('addrCity')} onBlur={() => { setFocused(null); touch('addrCity') }}
                    sx={fieldStyle('addrCity')}
                  />
                  {touched.addrCity && errors.addrCity && <ErrorText>{errors.addrCity}</ErrorText>}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FieldLabel>State</FieldLabel>
                  <TextField
                    fullWidth placeholder="NY" value={addr.state} inputProps={{ maxLength: 2 }}
                    onChange={e => setAddr(a => ({ ...a, state: e.target.value.toUpperCase().replace(/[^A-Z]/g, '') }))}
                    onFocus={() => setFocused('addrState')} onBlur={() => { setFocused(null); touch('addrState') }}
                    sx={fieldStyle('addrState')}
                  />
                  {touched.addrState && errors.addrState && <ErrorText>{errors.addrState}</ErrorText>}
                </Box>
              </SplitRow>

              {/* ZIP */}
              <Box>
                <FieldLabel>ZIP Code</FieldLabel>
                <TextField
                  fullWidth placeholder="10001" value={addr.zip} inputMode="numeric"
                  onChange={e => setAddr(a => ({ ...a, zip: e.target.value.replace(/[^\d-]/g, '').slice(0, 10) }))}
                  onFocus={() => setFocused('addrZip')} onBlur={() => { setFocused(null); touch('addrZip') }}
                  sx={fieldStyle('addrZip')}
                />
                {touched.addrZip && errors.addrZip && <ErrorText>{errors.addrZip}</ErrorText>}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Promo code */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
          <PromoToggle onClick={() => setPromoOpen(o => !o)}>
            <Tag size={14} color="#C8FF00" />
            <PromoLabel>{promoOpen ? 'Hide promo code' : 'Have a promo code?'}</PromoLabel>
          </PromoToggle>
          <AnimatePresence>
            {promoOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <PromoRow>
                  <TextField
                    fullWidth size="small" placeholder="PROMO CODE"
                    value={promo}
                    onChange={e => setPromo(e.target.value.toUpperCase())}
                    sx={{ '& input': { letterSpacing: promo ? '2px' : 0, fontWeight: 600, textTransform: 'uppercase' } }}
                  />
                  <PromoApplyBtn variant="outlined" whileTap={{ scale: 0.96 }}>Apply</PromoApplyBtn>
                </PromoRow>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Security badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
          <SecureRow>
            {[{ Icon: Lock, label: '256-bit SSL' }, { Icon: Shield, label: 'PCI DSS' }].map(({ Icon, label }) => (
              <SecureItem key={label}>
                <Icon size={12} color="rgba(255,255,255,0.28)" />
                <SecureText>{label}</SecureText>
              </SecureItem>
            ))}
          </SecureRow>
        </motion.div>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <FooterArea>
          <PrimaryButton onClick={handlePay} label={`Pay $${total.toFixed(2)}`} />
          <RefundNote>Cancel within 14 days for a full refund</RefundNote>
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default Payment
