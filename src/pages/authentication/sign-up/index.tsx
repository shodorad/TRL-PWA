import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import PrimaryButton from '@/components/common/PrimaryButton'
import { useAuth } from '@/contexts/AuthContext'

const MotionButton = motion.create(Button)

const ScreenRoot = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '16px',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
}))

const FormCard = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'unset',
    width: '100%',
    maxWidth: 460,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: '40px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
}))

const BackBtn            = styled(MotionButton)({ minWidth: 0, width: 44, height: 44, borderRadius: '14px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const CardHeader         = styled(Box)(({ theme }) => ({ padding: '16px 26px 0', [theme.breakpoints.up('md')]: { padding: '0 0 24px' } }))
const ScrollArea         = styled(Box)(({ theme }) => ({ flex: 1, overflowY: 'auto', padding: '20px 26px 0', [theme.breakpoints.up('md')]: { overflowY: 'visible', padding: 0 } }))
const Heading            = styled(Typography)({ fontSize: 30, fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '7px' })
const Subtitle           = styled(Typography)({ fontSize: 14.5, marginBottom: 28 })
const OAuthAppleButton   = styled(MotionButton)({ height: 54, borderRadius: '18px', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', gap: '10px' })
const OAuthGoogleButton  = styled(MotionButton)({ height: 50, borderRadius: '16px', fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', gap: '10px' })
const OAuthGroup         = styled(Box)({ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 })
const DividerRow         = styled(Box)({ display: 'flex', alignItems: 'center', gap: '14px', margin: '16px 0' })
const DividerLine        = styled(Box)({ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' })
const DividerLabel       = styled(Typography)({ fontSize: 12, color: 'rgba(255,255,255,0.22)' })
const FieldLabelText     = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, letterSpacing: '0.2px', display: 'block', marginBottom: '8px' })
const FieldRoot          = styled(Box)({ flex: 1 })
const FieldErrorText     = styled(Typography)({ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, marginTop: '5px' })
const PasswordErrorText  = styled(Typography)({ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, marginTop: '5px' })
const NameRow            = styled(Box)({ display: 'flex', gap: '10px' })
const FormFieldsColumn   = styled('div')({ display: 'flex', flexDirection: 'column', gap: 12 })
const MotionFormFields   = motion.create(FormFieldsColumn)
const LegalText          = styled(Typography)({ color: 'rgba(255,255,255,0.28)', fontSize: 11.5, textAlign: 'center', paddingTop: '4px', paddingBottom: '4px' })
const LegalLink          = styled('span')(({ theme }) => ({ color: theme.palette.primary.main }))
const SignInRow          = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 8 })
const SignInPrompt       = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.32)' })
const SignInLink         = styled(MotionButton)({ color: '#C8FF00', fontSize: 13.5, fontWeight: 700, padding: 0, minWidth: 0 })
const PasswordIconButton = styled(IconButton)({ marginRight: '-8px' })
const FooterBox          = styled(Box)(({ theme }) => ({ padding: '20px 24px 48px', [theme.breakpoints.up('md')]: { padding: 0 } }))

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const AppleIcon = () => (
  <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
    <path d="M13.17 10.04c-.02-1.96 1.6-2.9 1.67-2.95-.91-1.33-2.33-1.52-2.83-1.54-1.21-.12-2.37.72-2.99.72-.62 0-1.58-.7-2.59-.68-1.33.02-2.56.78-3.24 1.97C1.4 9.68 2.4 13.5 3.97 15.57c.79 1.13 1.73 2.39 2.96 2.35 1.19-.05 1.64-.77 3.08-.77 1.44 0 1.85.77 3.1.74 1.28-.02 2.09-1.15 2.86-2.28.9-1.31 1.27-2.58 1.29-2.65-.03-.01-2.49-1-.52-3.92z" fill="currentColor" />
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.48h4.844c-.209 1.126-.843 2.079-1.796 2.717v2.258h2.908C16.418 14.216 17.64 11.91 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.892 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

interface FieldProps {
  label:        string
  value:        string
  onChange:     (v: string) => void
  placeholder?: string
  type?:        string
  onBlur?:      () => void
  error?:       string | null
}

const Field = ({ label, value, onChange, placeholder, type = 'text', onBlur, error }: FieldProps) => (
  <FieldRoot>
    <FieldLabelText>{label}</FieldLabelText>
    <TextField fullWidth type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} />
    {error && <FieldErrorText>{error}</FieldErrorText>}
  </FieldRoot>
)

const SignUp = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ first: '', last: '', phone: '', email: '', password: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = {
    first:    !form.first.trim()        ? 'Required'             : null,
    last:     !form.last.trim()         ? 'Required'             : null,
    email:    !emailRe.test(form.email) ? 'Enter a valid email'  : null,
    password: form.password.length < 8  ? 'Min. 8 characters'   : null,
  }
  const isValid = Object.values(errors).every(e => e === null)

  const touch = (key: string) => setTouched(t => ({ ...t, [key]: true }))

  const handleNext = () => {
    if (!isValid) return
    setUser({ firstName: form.first, lastName: form.last, phone: form.phone, email: form.email })
    navigate('/auth/verify-email')
  }

  return (
    <ScreenRoot>
      <FormCard>
        <CardHeader>
          <BackBtn initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.90 }} onClick={() => navigate(-1)} variant="outlined">
            <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
          </BackBtn>
        </CardHeader>

        <ScrollArea>
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}>
            <Heading>Create your account</Heading>
            <Subtitle variant="caption">Choose how you'd like to get started.</Subtitle>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <OAuthGroup>
              <OAuthAppleButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={() => navigate('/')}>
                <AppleIcon /> Continue with Apple
              </OAuthAppleButton>
              <OAuthGoogleButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={() => navigate('/')} sx={{ color: 'text.primary' }}>
                <GoogleIcon /> Continue with Google
              </OAuthGoogleButton>
            </OAuthGroup>

            <DividerRow>
              <DividerLine /><DividerLabel variant="caption">or sign up with email</DividerLabel><DividerLine />
            </DividerRow>
          </motion.div>

          <MotionFormFields initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <NameRow>
              <Field label="First name" value={form.first} placeholder="Jane" onChange={v => setForm(f => ({ ...f, first: v }))} onBlur={() => touch('first')} error={touched.first ? errors.first : null} />
              <Field label="Last name" value={form.last} placeholder="Smith" onChange={v => setForm(f => ({ ...f, last: v }))} onBlur={() => touch('last')} error={touched.last ? errors.last : null} />
            </NameRow>
            <Field label="Mobile number" value={form.phone} placeholder="+1 (555) 000-0000" type="tel" onChange={v => setForm(f => ({ ...f, phone: v }))} />
            <Field label="Email address" value={form.email} placeholder="jane@email.com" type="email" onChange={v => setForm(f => ({ ...f, email: v }))} onBlur={() => touch('email')} error={touched.email ? errors.email : null} />

            <Box>
              <FieldLabelText>Password</FieldLabelText>
              <TextField
                fullWidth
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onBlur={() => touch('password')}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <PasswordIconButton onClick={() => setShowPass(s => !s)} edge="end">
                          {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                        </PasswordIconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {touched.password && errors.password && <PasswordErrorText>{errors.password}</PasswordErrorText>}
            </Box>

            <LegalText>
              By continuing you agree to our <LegalLink>Terms</LegalLink> &amp; <LegalLink>Privacy Policy</LegalLink>
            </LegalText>

            <SignInRow>
              <SignInPrompt variant="caption">Already have an account?</SignInPrompt>
              <SignInLink variant="text" whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth/sign-in')}>Sign in</SignInLink>
            </SignInRow>
          </MotionFormFields>
        </ScrollArea>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <FooterBox>
            <PrimaryButton onClick={handleNext} label="Continue" disabled={!isValid} />
          </FooterBox>
        </motion.div>
      </FormCard>
    </ScreenRoot>
  )
}

export default SignUp
