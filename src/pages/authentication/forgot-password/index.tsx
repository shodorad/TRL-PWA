import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Mail } from 'lucide-react'
import PrimaryButton from '@/components/common/PrimaryButton'

const MotionButton = motion.create(Button)

const ScreenRoot        = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const BackButtonWrapper = styled(Box)({ padding: '12px 20px 0' })
const BackBtn           = styled(MotionButton)({ minWidth: 0, width: 44, height: 44, borderRadius: '14px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const Body              = styled(Box)({ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 26px 0' })
const Heading           = styled(Typography)({ fontSize: 30, fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '7px' })
const Subtitle          = styled(Typography)({ fontSize: 14.5, color: 'rgba(255,255,255,0.42)', marginBottom: 32 })
const FieldLabel        = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, letterSpacing: '0.2px', display: 'block', marginBottom: '8px' })
const ErrorText         = styled(Typography)({ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, marginTop: '5px' })
const FooterBox         = styled(Box)({ padding: '20px 24px 48px' })

// ── Sent state ───────────────────────────────────────────────
const SentCenter        = styled(Box)({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' })
const EnvelopeWrapper   = styled(Box)({ position: 'relative', width: 96, height: 96, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' })
const Ring              = styled(motion.div)<{ size: number }>(({ size }) => ({ position: 'absolute', width: size, height: size, borderRadius: '50%', border: '1.5px solid rgba(200,255,0,0.25)' }))
const EnvelopeCircle    = styled(Box)({ width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,255,0,0.12)', border: '1px solid rgba(200,255,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 })
const SentHeading       = styled(Typography)({ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', marginBottom: 10 })
const MaskedEmail       = styled(Typography)({ fontSize: 14, color: '#C8FF00', fontWeight: 600, marginBottom: 8 })
const SentSubtitle      = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, marginBottom: 36 })
const ResendRow         = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 })
const ResendText        = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.32)' })
const ResendLink        = styled(MotionButton)({ color: '#C8FF00', fontSize: 13.5, fontWeight: 700, padding: 0, minWidth: 0 })
const BackToSignInLink  = styled(MotionButton)({ color: 'rgba(255,255,255,0.48)', fontSize: 13, fontWeight: 600, padding: 0, minWidth: 0, marginTop: 16 })

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  const masked = '*'.repeat(Math.max(local.length - 2, 2))
  return `${visible}${masked}@${domain}`
}

const pulsing = {
  animate: { opacity: [0.6, 0.15, 0.6], scale: [1, 1.08, 1] },
  transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
}

const ForgotPassword = () => {
  const navigate        = useNavigate()
  const [email, setEmail]   = useState('')
  const [touched, setTouched] = useState(false)
  const [sent, setSent]   = useState(false)

  const emailError = !emailRe.test(email) ? 'Enter a valid email' : null
  const isValid    = emailError === null

  const handleSend = () => {
    setTouched(true)
    if (!isValid) return
    setSent(true)
  }

  return (
    <ScreenRoot>
      <BackButtonWrapper>
        <BackBtn
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.90 }}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
      </BackButtonWrapper>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="idle"
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            <Body>
              <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}>
                <Heading>Forgot password?</Heading>
                <Subtitle variant="body2">Enter your email and we'll send a reset link.</Subtitle>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                <FieldLabel>Email address</FieldLabel>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="jane@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                />
                {touched && emailError && <ErrorText>{emailError}</ErrorText>}
              </motion.div>
            </Body>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              <FooterBox>
                <PrimaryButton onClick={handleSend} label="Send reset link" disabled={touched && !isValid} />
              </FooterBox>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.28, type: 'spring', stiffness: 260, damping: 24 }}
          >
            <SentCenter>
              <EnvelopeWrapper>
                <Ring size={96} {...pulsing} transition={{ ...pulsing.transition, delay: 0 }} />
                <Ring size={72} {...pulsing} transition={{ ...pulsing.transition, delay: 0.4 }} />
                <Ring size={48} {...pulsing} transition={{ ...pulsing.transition, delay: 0.8 }} />
                <EnvelopeCircle>
                  <Mail size={26} color="#C8FF00" />
                </EnvelopeCircle>
              </EnvelopeWrapper>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <SentHeading>Check your email</SentHeading>
                <MaskedEmail>{maskEmail(email)}</MaskedEmail>
                <SentSubtitle variant="body2">
                  We've sent a password reset link. It may take a minute to arrive.
                </SentSubtitle>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResendRow>
                  <ResendText variant="caption">Didn't receive it?</ResendText>
                  <ResendLink variant="text" whileTap={{ scale: 0.95 }} onClick={() => setSent(false)}>
                    Resend
                  </ResendLink>
                </ResendRow>
                <BackToSignInLink variant="text" whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth/sign-in')}>
                  ← Back to sign in
                </BackToSignInLink>
              </motion.div>
            </SentCenter>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenRoot>
  )
}

export default ForgotPassword
