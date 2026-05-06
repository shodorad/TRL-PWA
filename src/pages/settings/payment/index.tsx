import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CreditCard, Check, Calendar, ChevronRight, ArrowLeftRight, X, CheckCircle2 } from 'lucide-react'
import { usePlan } from '@/contexts/PlanContext'
import { GlassCard } from '@/components/common/GlassCard'
import { SectionLabel, PageHeader, DangerButton, ListRow } from '@/components'

const MotionButton = motion.create(Button)
const SPRING       = { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.8 }

const ScreenRoot = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const FieldLabel = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, marginBottom: '6px' })

const PLAN_FEATURES = ['Real-time GPS tracking', 'Unlimited trip history', 'Geofence zones', 'Multi-vehicle dashboard']

const PLANS = [
  { type: 'monthly' as const, label: 'Monthly', price: 9.65, sub: 'Cancel anytime' },
  { type: 'annual'  as const, label: 'Annual',  price: 7.99, sub: 'Save $21/year · billed $95.88/yr' },
]

const CANCEL_REASONS = ['Too expensive', 'Not using it enough', 'Found an alternative', 'Other']
const CANCEL_LOSSES  = ['Real-time GPS tracking', 'Trip history & reports', 'Geofence alerts', 'Vehicle health monitoring']

/* ── SwitchPlanView ── */
function SwitchPlanView({ onBack }: { onBack: () => void }) {
  const { plan, setPlan }       = usePlan()
  const [selected, setSelected] = useState<'monthly' | 'annual'>(plan?.type || 'monthly')
  const [confirming, setConf]   = useState(false)
  const [done, setDone]         = useState(false)

  const handleConfirm = () => {
    setConf(true)
    setTimeout(() => {
      if (plan) setPlan({ ...plan, type: selected, price: selected === 'annual' ? 7.99 : 9.65 })
      setConf(false)
      setDone(true)
      setTimeout(onBack, 900)
    }, 1000)
  }

  const isCurrent = selected === (plan?.type || 'monthly')

  return (
    <ScreenRoot>
      <PageHeader title="Switch Plan" onBack={onBack} />
      <ScrollArea>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: 1 }}>
          {PLANS.map(p => {
            const isSelected = selected === p.type
            const isCur      = p.type === (plan?.type || 'monthly')
            return (
              <GlassCard key={p.type} onClick={() => setSelected(p.type)} sx={{ p: '16px', cursor: 'pointer', border: isSelected ? '1.5px solid rgba(200,255,0,0.5)' : '1px solid rgba(255,255,255,0.10)', background: isSelected ? 'rgba(200,255,0,0.05)' : undefined, transition: 'all 0.2s' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{p.label}</Typography>
                      {isCur && <Box sx={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '99px', px: '8px', py: '2px' }}><Typography sx={{ color: '#4ade80', fontSize: 10, fontWeight: 700 }}>Current</Typography></Box>}
                    </Box>
                    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', mt: '2px' }}>{p.sub}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 900 }}>${p.price}<Typography component="span" sx={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>/mo</Typography></Typography>
                  </Box>
                </Box>
                {isSelected && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '10px' }}>
                    <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: '#C8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={11} color="#000" />
                    </Box>
                    <Typography sx={{ fontSize: 12, color: '#C8FF00', fontWeight: 600 }}>Selected</Typography>
                  </Box>
                )}
              </GlassCard>
            )
          })}
        </Box>

        <MotionButton
          fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={handleConfirm}
          disabled={isCurrent || confirming || done}
          sx={{ mt: 3, height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}
        >
          {done ? 'Plan Updated!' : confirming ? 'Switching…' : isCurrent ? 'Already on this plan' : `Switch to ${selected === 'annual' ? 'Annual' : 'Monthly'}`}
        </MotionButton>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── PaymentMethodView ── */
function PaymentMethodView({ onBack }: { onBack: () => void }) {
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry]   = useState('')
  const [cvv, setCvv]         = useState('')
  const [name, setName]       = useState('')

  const formatCardNum = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry  = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  return (
    <ScreenRoot>
      <PageHeader title="Payment Method" onBack={onBack} />
      <ScrollArea>
        <GlassCard sx={{ p: '14px 16px', mb: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(74,222,128,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={18} color="#4ade80" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>Visa ending in 4242</Typography>
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', mt: '2px' }}>Expires 12/26</Typography>
          </Box>
          <MotionButton whileTap={{ scale: 0.90 }} variant="text" sx={{ color: '#E8656A', fontSize: 12, fontWeight: 600, p: '4px 10px', borderRadius: '8px', background: 'rgba(232,101,106,0.08)', minWidth: 0 }}>
            Remove
          </MotionButton>
        </GlassCard>

        <SectionLabel sx={{ mt: 0, mb: '8px' }}>Add New Card</SectionLabel>
        <GlassCard sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Box>
            <FieldLabel>Card Number</FieldLabel>
            <TextField fullWidth value={cardNum} onChange={e => setCardNum(formatCardNum(e.target.value))} placeholder="0000 0000 0000 0000"
              slotProps={{ input: { startAdornment: <CreditCard size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} />, inputProps: { style: { letterSpacing: '2px' } } } }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <Box sx={{ flex: 1 }}>
              <FieldLabel>Expiry</FieldLabel>
              <TextField fullWidth value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" />
            </Box>
            <Box sx={{ width: 100 }}>
              <FieldLabel>CVV</FieldLabel>
              <TextField fullWidth value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" type="password" />
            </Box>
          </Box>
          <Box>
            <FieldLabel>Name on Card</FieldLabel>
            <TextField fullWidth value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
          </Box>
        </GlassCard>

        <MotionButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} sx={{ mt: 3, height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}>
          Save Card
        </MotionButton>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── CancelFlowView ── */
function CancelFlowView({ onBack }: { onBack: () => void }) {
  type CancelStep = 0 | 1 | 2
  const [step, setStep]       = useState<CancelStep>(0)
  const [reason, setReason]   = useState<string | null>(null)
  const [details, setDetails] = useState('')
  const [cancelling, setCanc] = useState(false)

  const handleCancel = () => {
    setCanc(true)
    setTimeout(() => { setCanc(false); setStep(2) }, 1000)
  }

  return (
    <ScreenRoot>
      <PageHeader
        title="Cancel Subscription"
        onBack={step === 0 ? onBack : () => setStep(s => (s - 1) as CancelStep)}
      />
      <ScrollArea>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
              <GlassCard sx={{ p: '20px', mb: '16px', border: '1px solid rgba(232,101,106,0.15)' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, mb: '4px' }}>You'll lose access to:</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '14px' }}>These features will no longer be available</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CANCEL_LOSSES.map(l => (
                    <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <X size={13} color="#E8656A" style={{ flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{l}</Typography>
                    </Box>
                  ))}
                </Box>
              </GlassCard>
              <DangerButton label="I Understand, Continue" onClick={() => setStep(1)} fullWidth />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
              <Typography sx={{ fontSize: 14.5, fontWeight: 600, mb: '12px' }}>Why are you cancelling?</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '16px' }}>
                {CANCEL_REASONS.map(r => (
                  <GlassCard key={r} onClick={() => setReason(r)} sx={{ p: '12px 16px', cursor: 'pointer', border: reason === r ? '1.5px solid rgba(200,255,0,0.4)' : '1px solid rgba(255,255,255,0.10)', background: reason === r ? 'rgba(200,255,0,0.05)' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{r}</Typography>
                    {reason === r && <Check size={15} color="#C8FF00" />}
                  </GlassCard>
                ))}
              </Box>
              <TextField fullWidth multiline rows={3} value={details} onChange={e => setDetails(e.target.value)} placeholder="Tell us more (optional)" sx={{ mb: '16px' }} />
              <DangerButton
                label={cancelling ? 'Cancelling…' : 'Cancel Subscription'}
                onClick={handleCancel}
                loading={cancelling}
                disabled={!reason}
                fullWidth
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING}>
              <Box sx={{ textAlign: 'center', pt: '40px' }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={32} color="rgba(255,255,255,0.5)" />
                </Box>
                <Typography sx={{ fontSize: 20, fontWeight: 800, mb: '8px' }}>Subscription Cancelled</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '8px' }}>Your access continues until</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#C8FF00', mb: '32px' }}>June 15, 2025</Typography>
                <MotionButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={onBack} sx={{ height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}>
                  Back to Settings
                </MotionButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── Payment (main) ── */
type PaymentView = 'main' | 'switchPlan' | 'cancelFlow' | 'paymentMethod'

const Payment = () => {
  const navigate = useNavigate()
  const { plan }  = usePlan()
  const [activeView, setActiveView] = useState<PaymentView>('main')

  const BILLING_ROWS: { icon: typeof CreditCard; label: string; sub: string; view: PaymentView | null }[] = [
    { icon: CreditCard,     label: 'Payment Method',   sub: 'Visa •••• 4242',                                                         view: 'paymentMethod' },
    { icon: Calendar,       label: 'Next Billing Date', sub: 'June 15, 2025',                                                          view: null            },
    { icon: ArrowLeftRight, label: 'Switch Plan',       sub: plan?.type === 'annual' ? 'Switch to monthly' : 'Save $21/yr with annual', view: 'switchPlan'   },
  ]

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <ScreenRoot>
        <PageHeader title="Payment & Plan" onBack={() => navigate('/settings')} />

        <ScrollArea>
          <SectionLabel sx={{ mt: '4px', mb: '8px' }}>Current Plan</SectionLabel>
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

          <SectionLabel sx={{ mb: '8px' }}>Billing</SectionLabel>
          <GlassCard sx={{ p: '4px' }}>
            {BILLING_ROWS.map(({ icon: Icon, label, sub, view }, i, arr) => (
              <ListRow
                key={label}
                icon={<Icon size={16} color="#4ade80" />}
                iconVariant="success"
                title={label}
                subtitle={sub}
                onClick={view ? () => setActiveView(view) : undefined}
                showChevron={Boolean(view)}
                divider={i < arr.length - 1}
              />
            ))}
          </GlassCard>

          <MotionButton fullWidth variant="text" whileTap={{ scale: 0.97 }} onClick={() => setActiveView('cancelFlow')} sx={{ mt: 3, color: 'rgba(255,80,80,0.7)', fontSize: 14 }}>
            Cancel Subscription
          </MotionButton>
        </ScrollArea>
      </ScreenRoot>

      <AnimatePresence>
        {activeView !== 'main' && (
          <motion.div
            key={activeView}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={SPRING}
            style={{ position: 'absolute', inset: 0, background: '#04050d', zIndex: 10, display: 'flex', flexDirection: 'column' }}
          >
            {activeView === 'switchPlan'    && <SwitchPlanView    onBack={() => setActiveView('main')} />}
            {activeView === 'cancelFlow'    && <CancelFlowView    onBack={() => setActiveView('main')} />}
            {activeView === 'paymentMethod' && <PaymentMethodView onBack={() => setActiveView('main')} />}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default Payment
