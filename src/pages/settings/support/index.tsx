import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LifeBuoy, MessageSquare, Star, Share2, HelpCircle, ChevronDown, CheckCircle2, Send, Mail, Phone as PhoneIcon, Check } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { SectionLabel, PageHeader, SegmentedControl, ListRow } from '@/components'

const MotionButton = motion.create(Button)
const SPRING       = { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.8 }

const ScreenRoot = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })

const FAQ_ITEMS = [
  { q: 'How does GPS tracking work?',         a: 'Your TrackLynk OBD-II device plugs into your vehicle\'s diagnostic port and transmits location data in real time via cellular networks. You can see your car\'s position updated every 30 seconds on the map.' },
  { q: 'How do I add a second vehicle?',       a: 'Go to Settings → Vehicles → Add a Vehicle. You\'ll need to purchase a second OBD-II device for each additional vehicle. Each device is paired to a specific vehicle.' },
  { q: 'What is geofencing?',                  a: 'Geofencing lets you draw a virtual boundary on the map. You\'ll receive an alert any time your vehicle enters or exits that zone. Great for monitoring teen drivers or tracking company vehicles.' },
  { q: 'How do I cancel my subscription?',     a: 'Go to Settings → Payment & Plan → Cancel Subscription. Your access continues until the end of the current billing period. You won\'t be charged again after cancellation.' },
  { q: 'What devices are supported?',          a: 'TrackLynk works with any vehicle that has an OBD-II port — most cars manufactured after 1996. The device connects to any iPhone (iOS 14+) or Android (8.0+) smartphone.' },
  { q: 'How do I update my payment method?',   a: 'Go to Settings → Payment & Plan → Payment Method. You can add a new card or remove the existing one at any time. Changes take effect on your next billing cycle.' },
]

const CONTACT_SUBJECTS = ['Billing', 'Technical Issue', 'Account', 'Other']

/* ── HelpSupportView ── */
function HelpSupportView({ onBack }: { onBack: () => void }) {
  const [tab, setTab]         = useState<'faq' | 'contact'>('faq')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [subject, setSubject] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSend = () => {
    if (!subject || !message.trim()) return
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1200)
  }

  return (
    <ScreenRoot>
      <PageHeader title="Help & Support" onBack={onBack} />

      <Box sx={{ px: '20px', pb: '12px', flexShrink: 0 }}>
        <SegmentedControl
          options={[{ value: 'faq', label: 'FAQ' }, { value: 'contact', label: 'Contact' }]}
          value={tab}
          onChange={(v) => setTab(v as 'faq' | 'contact')}
        />
      </Box>

      <ScrollArea>
        <AnimatePresence mode="wait">
          {tab === 'faq' && (
            <motion.div key="faq" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <GlassCard sx={{ p: '4px' }}>
                {FAQ_ITEMS.map(({ q, a }, i) => (
                  <Box key={q}>
                    <Box onClick={() => setOpenFaq(openFaq === i ? null : i)} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '14px', cursor: 'pointer', borderBottom: openFaq === i ? 'none' : i < FAQ_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', '&:hover': { background: 'rgba(255,255,255,0.03)' }, borderRadius: '14px' }}>
                      <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{q}</Typography>
                      <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} color="rgba(255,255,255,0.35)" />
                      </motion.div>
                    </Box>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <Box sx={{ px: '14px', pb: '14px', borderBottom: i < FAQ_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                            <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{a}</Typography>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                ))}
              </GlassCard>
            </motion.div>
          )}

          {tab === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SectionLabel sx={{ mt: 0, mb: '8px' }}>What's this about?</SectionLabel>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: '16px' }}>
                      {CONTACT_SUBJECTS.map(s => (
                        <MotionButton key={s} whileTap={{ scale: 0.94 }} onClick={() => setSubject(s)}
                          sx={{ borderRadius: '10px', height: 36, px: '14px', fontWeight: 600, fontSize: 13, textTransform: 'none', background: subject === s ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.07)', color: subject === s ? '#C8FF00' : 'rgba(255,255,255,0.55)', border: subject === s ? '1px solid rgba(200,255,0,0.3)' : '1px solid rgba(255,255,255,0.10)', transition: 'all 0.2s' }}>
                          {subject === s && <Check size={12} style={{ marginRight: 4 }} />}{s}
                        </MotionButton>
                      ))}
                    </Box>
                    <TextField
                      fullWidth multiline rows={4} value={message} onChange={e => setMessage(e.target.value)}
                      placeholder="Describe your issue or question…"
                      sx={{ mb: '16px' }}
                    />
                    <MotionButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={handleSend}
                      disabled={!subject || !message.trim() || sending}
                      sx={{ height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15, gap: '8px' }}>
                      {sending ? 'Sending…' : <><Send size={16} /> Send Message</>}
                    </MotionButton>

                    <SectionLabel sx={{ mb: '8px' }}>Other ways to reach us</SectionLabel>
                    <GlassCard sx={{ p: '4px' }}>
                      <ListRow
                        icon={<Mail size={16} color="#C8FF00" />}
                        iconVariant="lime"
                        title="Email"
                        subtitle="support@tracklynk.com"
                        showChevron={false}
                        divider
                      />
                      <ListRow
                        icon={<PhoneIcon size={16} color="#C8FF00" />}
                        iconVariant="lime"
                        title="Phone"
                        subtitle="+1 (800) 555-0123"
                        showChevron={false}
                        divider={false}
                      />
                    </GlassCard>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING}>
                    <Box sx={{ textAlign: 'center', pt: '40px' }}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}>
                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                          <CheckCircle2 size={32} color="#4ade80" />
                        </Box>
                      </motion.div>
                      <Typography sx={{ fontSize: 20, fontWeight: 800, mb: '8px' }}>Message Sent!</Typography>
                      <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '32px' }}>We'll get back to you within 24 hours</Typography>
                      <MotionButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={() => { setSent(false); setSubject(null); setMessage('') }}
                        sx={{ height: 48, borderRadius: '14px', fontWeight: 600 }}>
                        Send Another
                      </MotionButton>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── Support (main) ── */
const SUPPORT_ITEMS = [
  { icon: MessageSquare, label: 'Chat with Support', sub: 'Average response: 2 min',     iconVariant: 'lime'    as const, action: null          },
  { icon: HelpCircle,    label: 'Help Center',        sub: 'Browse FAQs and guides',      iconVariant: 'lime'    as const, action: 'helpCenter'  },
  { icon: Star,          label: 'Rate the App',       sub: 'Leave a review on the store', iconVariant: 'warning' as const, action: null          },
  { icon: Share2,        label: 'Share TrackLynk',    sub: 'Invite friends to the app',   iconVariant: 'surface' as const, action: null          },
]

const Support = () => {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'main' | 'helpCenter'>('main')

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <ScreenRoot>
        <PageHeader title="Support" onBack={() => navigate('/settings')} />

        <ScrollArea>
          <GlassCard sx={{ p: '4px', mt: 2 }}>
            {SUPPORT_ITEMS.map(({ icon: Icon, label, sub, iconVariant, action }, i, arr) => (
              <ListRow
                key={label}
                icon={<Icon size={16} color={iconVariant === 'lime' ? '#C8FF00' : iconVariant === 'warning' ? '#F5A623' : 'rgba(255,255,255,0.55)'} />}
                iconVariant={iconVariant}
                title={label}
                subtitle={sub}
                onClick={action === 'helpCenter' ? () => setActiveView('helpCenter') : undefined}
                showChevron={action === 'helpCenter'}
                divider={i < arr.length - 1}
              />
            ))}
          </GlassCard>
        </ScrollArea>
      </ScreenRoot>

      <AnimatePresence>
        {activeView === 'helpCenter' && (
          <motion.div
            key="helpCenter"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={SPRING}
            style={{ position: 'absolute', inset: 0, background: '#04050d', zIndex: 10, display: 'flex', flexDirection: 'column' }}
          >
            <HelpSupportView onBack={() => setActiveView('main')} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default Support
