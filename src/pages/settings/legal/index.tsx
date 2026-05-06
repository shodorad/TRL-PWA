import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FileText, Shield, Cookie, Code, ChevronRight, ExternalLink } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { PageHeader, SegmentedControl } from '@/components'

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.8 }

const ScreenRoot  = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea  = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const SectionHead = styled(Typography)({ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: '6px', marginTop: '20px' })
const SectionBody = styled(Typography)({ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 })

const TERMS_SECTIONS = [
  { heading: 'Acceptance of Terms',      body: 'By accessing or using the TrackLynk application and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
  { heading: 'License to Use',           body: 'TrackLynk grants you a limited, non-exclusive, non-transferable license to use the application for personal, non-commercial purposes. You may not sublicense, sell, or distribute the application.' },
  { heading: 'Restrictions',             body: 'You agree not to reverse engineer, decompile, or disassemble the application. You may not use the service for any illegal purpose or in violation of any applicable laws or regulations.' },
  { heading: 'Limitation of Liability',  body: 'TrackLynk shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid for the service in the past 12 months.' },
]

const PRIVACY_SECTIONS = [
  { heading: 'Information We Collect',   body: 'We collect location data from your OBD-II device, account information you provide, usage analytics, and diagnostic data from your vehicle. This data is used to provide and improve our tracking services.' },
  { heading: 'How We Use Your Data',     body: 'Your data is used to display your vehicle\'s location, generate trip reports, send alerts, and improve the TrackLynk experience. We do not sell your personal data to third parties.' },
  { heading: 'Your Rights',              body: 'You have the right to access, correct, or delete your personal data at any time. You can export a copy of your data from Settings → Privacy & Data. To request account deletion, go to Settings → Account.' },
  { heading: 'Contact Us',               body: 'If you have any questions about our privacy practices, please contact our Data Protection Officer at privacy@tracklynk.com or write to TrackLynk Inc., 123 Tech Street, New York, NY 10001.' },
]

/* ── LegalContentView ── */
function LegalContentView({ defaultTab, onBack }: { defaultTab: 'terms' | 'privacy'; onBack: () => void }) {
  const [tab, setTab] = useState<'terms' | 'privacy'>(defaultTab)
  const sections = tab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS

  return (
    <ScreenRoot>
      <PageHeader title={tab === 'terms' ? 'Terms of Service' : 'Privacy Policy'} onBack={onBack} />

      <Box sx={{ px: '20px', pb: '12px', flexShrink: 0 }}>
        <SegmentedControl
          options={[{ value: 'terms', label: 'Terms' }, { value: 'privacy', label: 'Privacy' }]}
          value={tab}
          onChange={(v) => setTab(v as 'terms' | 'privacy')}
        />
      </Box>

      <ScrollArea>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', mb: '4px' }}>Last updated: January 1, 2025</Typography>
            {sections.map(({ heading, body }) => (
              <Box key={heading}>
                <SectionHead>{heading}</SectionHead>
                <SectionBody>{body}</SectionBody>
              </Box>
            ))}
            <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', mt: '28px', mb: '8px' }}>
              For questions, contact us at legal@tracklynk.com
            </Typography>
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── Legal (main) ── */
type LegalView = 'main' | 'terms' | 'privacy'

const LEGAL_ITEMS = [
  { icon: FileText, label: 'Terms of Service',      sub: 'Usage terms and conditions',       view: 'terms'   as LegalView, external: false },
  { icon: Shield,   label: 'Privacy Policy',         sub: 'How we collect and use your data', view: 'privacy' as LegalView, external: false },
  { icon: Cookie,   label: 'Cookie Policy',          sub: 'How we use cookies',               view: null,                   external: true  },
  { icon: Code,     label: 'Open Source Licenses',   sub: 'Third-party software licenses',    view: null,                   external: true  },
]

const Legal = () => {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<LegalView>('main')
  const [contentTab, setContentTab] = useState<'terms' | 'privacy'>('terms')

  const openContent = (tab: 'terms' | 'privacy') => {
    setContentTab(tab)
    setActiveView(tab)
  }

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <ScreenRoot>
        <PageHeader title="Legal" onBack={() => navigate('/settings')} />

        <ScrollArea>
          <GlassCard sx={{ p: '4px', mt: 2 }}>
            {LEGAL_ITEMS.map(({ icon: Icon, label, sub, view, external }, i, arr) => (
              <Box
                key={label}
                onClick={view ? () => openContent(view as 'terms' | 'privacy') : undefined}
                sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.04)' }, borderRadius: '14px' }}
              >
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="rgba(255,255,255,0.55)" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>{label}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', mt: '2px' }}>{sub}</Typography>
                </Box>
                {external ? <ExternalLink size={14} color="rgba(255,255,255,0.25)" /> : <ChevronRight size={15} color="rgba(255,255,255,0.22)" />}
              </Box>
            ))}
          </GlassCard>
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
            <LegalContentView defaultTab={contentTab} onBack={() => setActiveView('main')} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default Legal
