import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const MotionButton = motion.create(Button)

const ScreenRoot        = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const BackButtonWrapper = styled(Box)({ padding: '12px 20px 0' })
const BackBtn           = styled(MotionButton)({ minWidth: 0, width: 44, height: 44, borderRadius: '14px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const Body              = styled(Box)({ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 26px 0' })
const IconCircle        = styled(Box)({ width: 56, height: 56, borderRadius: '50%', background: 'rgba(200,255,0,0.10)', border: '1px solid rgba(200,255,0,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 })
const Heading           = styled(Typography)({ fontSize: 28, fontWeight: 900, letterSpacing: '-0.6px', marginBottom: '7px' })
const Subtitle          = styled(Typography)({ fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, marginBottom: 4 })
const MaskedEmail       = styled(Typography)({ fontSize: 14, color: '#C8FF00', fontWeight: 600, marginBottom: 32 })
const OTPRow            = styled(Box)({ display: 'flex', gap: 10, marginBottom: 32 })
const OTPInput          = styled('input')<{ filled: boolean }>(({ filled }) => ({
  width: '100%',
  height: 58,
  borderRadius: 14,
  border: filled ? '1.5px solid rgba(200,255,0,0.45)' : '1px solid rgba(255,255,255,0.10)',
  background: filled ? 'rgba(200,255,0,0.07)' : 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: 22,
  fontWeight: 700,
  textAlign: 'center',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  caretColor: '#C8FF00',
  transition: 'border-color 0.15s, background 0.15s',
  WebkitAppearance: 'none',
  '&:focus': {
    border: '1.5px solid rgba(200,255,0,0.6)',
    background: 'rgba(200,255,0,0.08)',
  },
}))
const ResendRow         = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 })
const ResendText        = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.32)' })
const ResendLink        = styled(MotionButton)({ color: '#C8FF00', fontSize: 13.5, fontWeight: 700, padding: 0, minWidth: 0 })
const CooldownText      = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.28)' })

const COOLDOWN_SECS = 30
const OTP_LENGTH    = 6

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  const masked = '*'.repeat(Math.max(local.length - 2, 2))
  return `${visible}${masked}@${domain}`
}

const VerifyEmail = () => {
  const navigate          = useNavigate()
  const { user }          = useAuth()
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [cooldown, setCooldown] = useState(COOLDOWN_SECS)
  const inputRefs         = useRef<(HTMLInputElement | null)[]>([])
  const timerRef          = useRef<ReturnType<typeof setInterval> | null>(null)

  // Start resend cooldown on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const resetCooldown = () => {
    setCooldown(COOLDOWN_SECS)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const submit = useCallback((code: string[]) => {
    if (code.every(d => d !== '')) {
      navigate('/onboarding/choose-plan')
    }
  }, [navigate])

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = digits.map((d, i) => i === index ? char : d)
    setDigits(next)
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    if (char) submit(next)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigits(d => d.map((v, i) => i === index ? '' : v))
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        setDigits(d => d.map((v, i) => i === index - 1 ? '' : v))
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((char, i) => { next[i] = char })
    setDigits(next)
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[lastFilled]?.focus()
    submit(next)
  }

  const maskedEmail = maskEmail(user.email || 'your email')

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

      <Body>
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}>
          <IconCircle>
            <Mail size={24} color="#C8FF00" />
          </IconCircle>
          <Heading>Verify your email</Heading>
          <Subtitle variant="body2">We sent a 6-digit code to</Subtitle>
          <MaskedEmail>{maskedEmail}</MaskedEmail>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <OTPRow>
            {digits.map((digit, i) => (
              <OTPInput
                key={i}
                ref={(el: HTMLInputElement | null) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                filled={digit !== ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e)}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                autoFocus={i === 0}
              />
            ))}
          </OTPRow>

          <ResendRow>
            <ResendText variant="caption">Didn't receive it?</ResendText>
            {cooldown > 0 ? (
              <CooldownText variant="caption">Resend ({cooldown}s)</CooldownText>
            ) : (
              <ResendLink
                variant="text"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setDigits(Array(OTP_LENGTH).fill(''))
                  inputRefs.current[0]?.focus()
                  resetCooldown()
                }}
              >
                Resend code
              </ResendLink>
            )}
          </ResendRow>
        </motion.div>
      </Body>
    </ScreenRoot>
  )
}

export default VerifyEmail
