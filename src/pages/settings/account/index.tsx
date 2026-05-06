import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, TextField, Button, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  User, Mail, Phone, Lock, LogOut, Fingerprint,
  Monitor, Shield, ChevronRight, Eye, EyeOff, AlertTriangle,
  Download, ExternalLink, ShieldCheck, MessageSquare, QrCode,
  Copy, CheckCircle2, Check, X,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/common/GlassCard'
import { SectionLabel, PageHeader, Avatar, AppToggle, DangerButton, ListRow } from '@/components'

const MotionButton = motion.create(Button)
const SPRING       = { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.8 }

const ScreenRoot = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const FieldLabel = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, marginBottom: '6px' })
const CodeBox    = styled(Box)({ fontFamily: 'monospace', fontSize: 13, background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px 14px', letterSpacing: '2px', color: '#C8FF00', textAlign: 'center' })

function PasswordStrengthBar({ score }: { score: number }) {
  const COLORS = ['#E8656A', '#facc15', '#facc15', '#C8FF00', '#4ade80']
  return (
    <Box sx={{ display: 'flex', gap: '4px', mt: '8px' }}>
      {COLORS.map((c, i) => (
        <Box key={i} sx={{ flex: 1, height: 4, borderRadius: 2, background: i < score ? c : 'rgba(255,255,255,0.12)', transition: 'background 0.25s' }} />
      ))}
    </Box>
  )
}

/* ── ChangePasswordView ── */
function ChangePasswordView({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext]       = useState('')
  const [confirm, setConfirm] = useState('')
  const [showC, setShowC]     = useState(false)
  const [showN, setShowN]     = useState(false)
  const [saving, setSaving]   = useState(false)
  const [done, setDone]       = useState(false)

  const score = useMemo(() => {
    let s = 0
    if (next.length >= 8)          s++
    if (next.length >= 12)         s++
    if (/[A-Z]/.test(next))        s++
    if (/[0-9]/.test(next))        s++
    if (/[^a-zA-Z0-9]/.test(next)) s++
    return s
  }, [next])

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score]
  const mismatch = confirm.length > 0 && next !== confirm
  const canSave  = current.length > 0 && next.length >= 8 && next === confirm

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setDone(true); setTimeout(onBack, 1000) }, 1200)
  }

  return (
    <ScreenRoot>
      <PageHeader title="Change Password" onBack={onBack} />
      <ScrollArea>
        <GlassCard sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Box>
            <FieldLabel>Current Password</FieldLabel>
            <TextField fullWidth type={showC ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)}
              slotProps={{ input: { startAdornment: <Lock size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} />, endAdornment: <Box onClick={() => setShowC(v => !v)} sx={{ cursor: 'pointer', display: 'flex' }}>{showC ? <EyeOff size={15} color="rgba(255,255,255,0.35)" /> : <Eye size={15} color="rgba(255,255,255,0.35)" />}</Box> } }}
            />
          </Box>
          <Box>
            <FieldLabel>New Password</FieldLabel>
            <TextField fullWidth type={showN ? 'text' : 'password'} value={next} onChange={e => setNext(e.target.value)}
              slotProps={{ input: { startAdornment: <Lock size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} />, endAdornment: <Box onClick={() => setShowN(v => !v)} sx={{ cursor: 'pointer', display: 'flex' }}>{showN ? <EyeOff size={15} color="rgba(255,255,255,0.35)" /> : <Eye size={15} color="rgba(255,255,255,0.35)" />}</Box> } }}
            />
            {next.length > 0 && (
              <>
                <PasswordStrengthBar score={score} />
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', mt: '4px' }}>{strengthLabel}</Typography>
              </>
            )}
          </Box>
          <Box>
            <FieldLabel>Confirm New Password</FieldLabel>
            <TextField fullWidth type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              error={mismatch}
              helperText={mismatch ? 'Passwords do not match' : ''}
              slotProps={{ input: { startAdornment: <Lock size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} /> } }}
            />
          </Box>
        </GlassCard>

        <MotionButton
          fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={handleSave}
          disabled={!canSave || saving || done}
          sx={{ mt: 3, height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}
        >
          {done ? <><Check size={16} style={{ marginRight: 6 }} /> Updated!</> : saving ? 'Updating…' : 'Update Password'}
        </MotionButton>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── TwoFactorView ── */
const BACKUP_CODES = ['4F2A-9K1B', 'R7X3-M8C2', 'N5P0-L4D6', 'W1Q8-T3Z9', 'H6V2-E7J5', 'U9B4-S0G3', 'C8F1-Y2N7', 'A3K6-P5W0']

function TwoFactorView({ onBack }: { onBack: () => void }) {
  type TFAStep = 'main' | 'sms' | 'app' | 'backup' | 'done'
  const [step, setStep]     = useState<TFAStep>('main')
  const [code, setCode]     = useState('')
  const [countdown, setCd]  = useState(30)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (step !== 'sms') return
    setCd(30)
    const t = setInterval(() => setCd(c => c > 0 ? c - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [step])

  const handleCopyAll = () => {
    navigator.clipboard.writeText(BACKUP_CODES.join('\n')).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const TFA_METHODS = [
    { icon: MessageSquare, label: 'SMS Authentication', sub: 'Receive codes via text message', m: 'sms' as const },
    { icon: QrCode, label: 'Authenticator App', sub: 'Use Google or Authy authenticator', m: 'app' as const },
  ]

  return (
    <ScreenRoot>
      <PageHeader title="Two-Factor Auth" onBack={step === 'main' ? onBack : () => setStep('main')} />
      <ScrollArea>
        <AnimatePresence mode="wait">
          {step === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
              <GlassCard sx={{ p: '16px', mb: '16px', textAlign: 'center' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '18px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <ShieldCheck size={26} color="#C8FF00" />
                </Box>
                <Typography sx={{ fontWeight: 700, mb: '4px' }}>Two-Factor Authentication</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Add an extra layer of security to your account</Typography>
              </GlassCard>
              <SectionLabel sx={{ mt: 0, mb: '8px' }}>Choose a method</SectionLabel>
              <GlassCard sx={{ p: '4px' }}>
                {TFA_METHODS.map(({ icon: Icon, label, sub, m }, i, arr) => (
                  <ListRow
                    key={m}
                    icon={<Icon size={18} color="#C8FF00" />}
                    iconVariant="lime"
                    title={label}
                    subtitle={sub}
                    onClick={() => setStep(m)}
                    divider={i < arr.length - 1}
                  />
                ))}
              </GlassCard>
            </motion.div>
          )}

          {step === 'sms' && (
            <motion.div key="sms" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
              <GlassCard sx={{ p: '20px', mb: '16px' }}>
                <Typography sx={{ fontWeight: 700, mb: '6px' }}>Enter verification code</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '20px' }}>We sent a 6-digit code to your phone number</Typography>
                <TextField
                  fullWidth
                  placeholder="000000"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputProps={{ style: { textAlign: 'center', fontSize: 24, letterSpacing: '8px', fontWeight: 700 } }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '12px' }}>
                  {countdown > 0
                    ? <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Resend in {countdown}s</Typography>
                    : <Typography sx={{ fontSize: 12, color: '#C8FF00', cursor: 'pointer' }} onClick={() => setCd(30)}>Resend code</Typography>
                  }
                </Box>
              </GlassCard>
              <MotionButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} disabled={code.length < 6} onClick={() => setStep('backup')} sx={{ height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}>
                Verify
              </MotionButton>
            </motion.div>
          )}

          {step === 'app' && (
            <motion.div key="app" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
              <GlassCard sx={{ p: '20px', mb: '16px', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, mb: '6px' }}>Scan this QR code</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '20px' }}>Open your authenticator app and scan</Typography>
                <Box sx={{ width: 160, height: 160, background: 'rgba(255,255,255,0.07)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <QrCode size={80} color="rgba(255,255,255,0.3)" />
                </Box>
                <Divider sx={{ mb: '16px' }} />
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', mb: '8px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>Or enter manually</Typography>
                <CodeBox sx={{ fontSize: 12, letterSpacing: '3px' }}>TRLK-7X4P-2M9B-K1Q3</CodeBox>
              </GlassCard>
              <MotionButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={() => setStep('backup')} sx={{ height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}>
                I've Scanned It →
              </MotionButton>
            </motion.div>
          )}

          {step === 'backup' && (
            <motion.div key="backup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
              <GlassCard sx={{ p: '20px', mb: '16px' }}>
                <Typography sx={{ fontWeight: 700, mb: '4px' }}>Save your backup codes</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '16px' }}>Store these somewhere safe — you'll need them if you lose access to your device</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {BACKUP_CODES.map(c => <CodeBox key={c}>{c}</CodeBox>)}
                </Box>
                <MotionButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={handleCopyAll}
                  sx={{ mt: '14px', height: 44, borderRadius: '12px', gap: '6px' }}>
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy All</>}
                </MotionButton>
              </GlassCard>
              <MotionButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={() => setStep('done')} sx={{ height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}>
                Done
              </MotionButton>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING}>
              <Box sx={{ textAlign: 'center', pt: '40px' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}>
                  <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle2 size={36} color="#4ade80" />
                  </Box>
                </motion.div>
                <Typography sx={{ fontSize: 20, fontWeight: 800, mb: '8px' }}>Two-Factor Enabled</Typography>
                <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', mb: '32px' }}>Your account is now more secure</Typography>
                <MotionButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={onBack} sx={{ height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}>
                  Back to Account
                </MotionButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── ActiveSessionsView ── */
const SESSIONS_DATA = [
  { id: 1, name: 'iPhone 15 Pro', os: 'iOS 17',      loc: 'New York, US',   active: 'Now',       current: true  },
  { id: 2, name: 'MacBook Pro',   os: 'macOS 14',    loc: 'New York, US',   active: '2h ago',    current: false },
  { id: 3, name: 'iPad Air',      os: 'iPadOS 17',   loc: 'Brooklyn, US',   active: 'Yesterday', current: false },
]

function ActiveSessionsView({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState(SESSIONS_DATA)

  const revoke = (id: number) => setSessions(s => s.filter(x => x.id !== id))
  const revokeAll = () => {
    if (window.confirm('Sign out all other devices?')) setSessions(s => s.filter(x => x.current))
  }

  return (
    <ScreenRoot>
      <PageHeader title="Active Sessions" onBack={onBack} />
      <ScrollArea>
        <SectionLabel sx={{ mt: '4px', mb: '8px' }}>Signed-in Devices</SectionLabel>
        <GlassCard sx={{ p: '4px' }}>
          <AnimatePresence>
            {sessions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', borderBottom: i < sessions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '11px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Monitor size={17} color="#C8FF00" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }} noWrap>{s.name}</Typography>
                      {s.current && <Box sx={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '99px', px: '6px', py: '1px', flexShrink: 0 }}><Typography sx={{ color: '#4ade80', fontSize: 10, fontWeight: 700 }}>This device</Typography></Box>}
                    </Box>
                    <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', mt: '2px' }}>{s.os} · {s.loc} · {s.active}</Typography>
                  </Box>
                  {!s.current && (
                    <MotionButton whileTap={{ scale: 0.90 }} onClick={() => revoke(s.id)} variant="text" sx={{ minWidth: 0, color: '#E8656A', fontSize: 12, fontWeight: 600, p: '6px 10px', borderRadius: '10px', background: 'rgba(232,101,106,0.08)' }}>
                      Revoke
                    </MotionButton>
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </GlassCard>

        {sessions.filter(s => !s.current).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <DangerButton label="Sign Out All Other Devices" onClick={revokeAll} fullWidth />
          </Box>
        )}
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── PrivacyDataView ── */
function PrivacyDataView({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState({ analytics: false, suggestions: false, marketing: false, location: true })

  const PREF_ROWS = [
    { key: 'analytics'   as const, label: 'Share Analytics',          sub: 'Help improve TrackLynk' },
    { key: 'suggestions' as const, label: 'Personalised Suggestions',  sub: 'Tailored tips and insights' },
    { key: 'marketing'   as const, label: 'Marketing Emails',          sub: 'Product updates and offers' },
    { key: 'location'    as const, label: 'Location History',          sub: 'Store location data for trips' },
  ]

  return (
    <ScreenRoot>
      <PageHeader title="Privacy & Data" onBack={onBack} />
      <ScrollArea>
        <SectionLabel sx={{ mt: '4px', mb: '8px' }}>Data Preferences</SectionLabel>
        <GlassCard sx={{ p: '4px' }}>
          {PREF_ROWS.map(({ key, label, sub }, i, arr) => (
            <ListRow
              key={key}
              icon={<Shield size={16} color="#C8FF00" />}
              iconVariant="lime"
              title={label}
              subtitle={sub}
              rightSlot={
                <div onClick={(e) => e.stopPropagation()}>
                  <AppToggle checked={prefs[key]} onChange={(v) => setPrefs(p => ({ ...p, [key]: v }))} />
                </div>
              }
              onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
              showChevron={false}
              divider={i < arr.length - 1}
            />
          ))}
        </GlassCard>

        <SectionLabel sx={{ mb: '8px' }}>Your Data</SectionLabel>
        <GlassCard sx={{ p: '4px' }}>
          <ListRow
            icon={<Download size={16} color="#C8FF00" />}
            iconVariant="lime"
            title="Export My Data"
            subtitle="Download a copy of all your data"
            divider
          />
          <ListRow
            icon={<ExternalLink size={16} color="rgba(255,255,255,0.55)" />}
            iconVariant="surface"
            title="Privacy Policy"
            subtitle="Read our full privacy policy"
            onClick={() => window.open('https://tracklynk.com/privacy', '_blank')}
            showChevron={false}
            rightSlot={<ExternalLink size={15} color="rgba(255,255,255,0.22)" />}
            divider={false}
          />
        </GlassCard>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── DeleteAccountView ── */
function DeleteAccountView({ onBack }: { onBack: () => void }) {
  const { user, setToken } = useAuth()
  const navigate = useNavigate()
  type DelStep = 'warning' | 'confirm' | 'deleting'
  const [step, setStep]   = useState<DelStep>('warning')
  const [typed, setTyped] = useState('')

  const CONSEQUENCES = [
    'All trip history and tracking data deleted',
    'Vehicle and device associations removed',
    'Subscription cancelled immediately',
    'Account data permanently erased',
  ]

  useEffect(() => {
    if (step !== 'deleting') return
    const t = setTimeout(() => {
      setToken(null)
      localStorage.removeItem('accessToken')
      navigate('/onboarding/welcome')
    }, 2000)
    return () => clearTimeout(t)
  }, [step])

  return (
    <ScreenRoot>
      <PageHeader title="Delete Account" onBack={step === 'deleting' ? () => undefined : onBack} />
      <ScrollArea>
        <AnimatePresence mode="wait">
          {step === 'warning' && (
            <motion.div key="warning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
              <GlassCard sx={{ p: '20px', mb: '16px', border: '1px solid rgba(232,101,106,0.20)' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '16px', background: 'rgba(232,101,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '14px' }}>
                  <AlertTriangle size={24} color="#E8656A" />
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, mb: '6px' }}>This action is permanent</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '16px' }}>Deleting your account cannot be undone. The following will be removed:</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CONSEQUENCES.map(c => (
                    <Box key={c} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <X size={14} color="#E8656A" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{c}</Typography>
                    </Box>
                  ))}
                </Box>
              </GlassCard>
              <DangerButton label="I Understand, Continue" onClick={() => setStep('confirm')} fullWidth />
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
              <GlassCard sx={{ p: '20px', mb: '16px' }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600, mb: '4px' }}>Confirm deletion</Typography>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', mb: '16px' }}>
                  Type your email address <Typography component="span" sx={{ color: '#C8FF00', fontWeight: 600 }}>{user.email}</Typography> to confirm
                </Typography>
                <TextField
                  fullWidth type="email" value={typed} onChange={e => setTyped(e.target.value)}
                  placeholder={user.email || 'your@email.com'}
                />
              </GlassCard>
              <DangerButton label="Delete My Account" onClick={() => setStep('deleting')} disabled={typed !== user.email} fullWidth />
            </motion.div>
          )}

          {step === 'deleting' && (
            <motion.div key="deleting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Box sx={{ textAlign: 'center', pt: '60px' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(232,101,106,0.3)', borderTopColor: '#E8656A', margin: '0 auto 20px' }} />
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Deleting account…</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── Account (main) ── */
type AccountView = 'main' | 'changePassword' | 'twoFactor' | 'sessions' | 'privacy' | 'deleteAccount'

const Account = () => {
  const navigate = useNavigate()
  const { user, setToken } = useAuth()
  const [activeView, setActiveView] = useState<AccountView>('main')
  const [name, setName]   = useState(`${user.firstName} ${user.lastName}`.trim() || 'Shobhit Singh')
  const [email, setEmail] = useState(user.email || 'user@tracklynk.com')
  const [phone, setPhone] = useState(user.phone || '+1 (555) 000-0000')

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('accessToken')
    navigate('/onboarding/welcome')
  }

  const SECURITY_ROWS = [
    { icon: Lock,        label: 'Change Password',           sub: 'Last changed 3 months ago',  view: 'changePassword' as AccountView, iconVariant: 'lime'    as const },
    { icon: Fingerprint, label: 'Two-Factor Authentication', sub: 'Currently disabled',          view: 'twoFactor'      as AccountView, iconVariant: 'lime'    as const },
    { icon: Monitor,     label: 'Active Sessions',           sub: '2 devices signed in',         view: 'sessions'       as AccountView, iconVariant: 'surface' as const },
    { icon: Shield,      label: 'Privacy & Data',            sub: 'Analytics, export, history',  view: 'privacy'        as AccountView, iconVariant: 'surface' as const },
  ]

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <ScreenRoot>
        <PageHeader title="Account" onBack={() => navigate('/settings')} />

        <ScrollArea>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Avatar name={user.firstName || 'S'} size="lg" sx={{ margin: '0 auto 16px' }} />
          </motion.div>

          <SectionLabel sx={{ mb: '8px' }}>Profile</SectionLabel>
          <GlassCard sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Box>
              <FieldLabel>Full Name</FieldLabel>
              <TextField fullWidth value={name} onChange={e => setName(e.target.value)}
                slotProps={{ input: { startAdornment: <User size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} /> } }}
              />
            </Box>
            <Box>
              <FieldLabel>Email Address</FieldLabel>
              <TextField fullWidth type="email" value={email} onChange={e => setEmail(e.target.value)}
                slotProps={{ input: { startAdornment: <Mail size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} /> } }}
              />
            </Box>
            <Box>
              <FieldLabel>Phone Number</FieldLabel>
              <TextField fullWidth type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                slotProps={{ input: { startAdornment: <Phone size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} /> } }}
              />
            </Box>
          </GlassCard>

          <SectionLabel sx={{ mb: '8px' }}>Security</SectionLabel>
          <GlassCard sx={{ p: '4px' }}>
            {SECURITY_ROWS.map(({ icon: Icon, label, sub, view, iconVariant }, i, arr) => (
              <ListRow
                key={label}
                icon={<Icon size={16} color={iconVariant === 'lime' ? '#C8FF00' : 'rgba(255,255,255,0.55)'} />}
                iconVariant={iconVariant}
                title={label}
                subtitle={sub}
                onClick={() => setActiveView(view)}
                divider={i < arr.length - 1}
              />
            ))}
          </GlassCard>

          <SectionLabel sx={{ mb: '8px' }}>Danger Zone</SectionLabel>
          <DangerButton label="Sign Out" onClick={handleLogout} fullWidth />
          <MotionButton fullWidth whileTap={{ scale: 0.97 }} onClick={() => setActiveView('deleteAccount')}
            variant="text" sx={{ mt: '8px', color: 'rgba(232,101,106,0.55)', fontSize: 13 }}>
            Delete Account
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
            {activeView === 'changePassword' && <ChangePasswordView onBack={() => setActiveView('main')} />}
            {activeView === 'twoFactor'      && <TwoFactorView      onBack={() => setActiveView('main')} />}
            {activeView === 'sessions'       && <ActiveSessionsView onBack={() => setActiveView('main')} />}
            {activeView === 'privacy'        && <PrivacyDataView    onBack={() => setActiveView('main')} />}
            {activeView === 'deleteAccount'  && <DeleteAccountView  onBack={() => setActiveView('main')} />}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default Account
