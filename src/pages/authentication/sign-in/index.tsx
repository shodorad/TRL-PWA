import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import PrimaryButton from '@/components/common/PrimaryButton'
import { loginUser, googleLogin } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import { GoogleLogin } from '@react-oauth/google'

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

const BackBtn           = styled(MotionButton)({ minWidth: 0, width: 44, height: 44, borderRadius: '14px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const CardHeader        = styled(Box)(({ theme }) => ({
  padding: '16px 26px 0',
  [theme.breakpoints.up('md')]: { padding: '0 0 24px' },
}))
const Body              = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: '28px 26px 0',
  [theme.breakpoints.up('md')]: {
    overflowY: 'visible',
    padding: 0,
  },
}))
const Heading           = styled(Typography)({ fontSize: 30, fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '7px' })
const Subtitle          = styled(Typography)({ fontSize: 14.5, color: 'rgba(255,255,255,0.42)', marginBottom: 32 })
const FieldLabel        = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, letterSpacing: '0.2px', display: 'block', marginBottom: '8px' })
const PasswordRow       = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' })
const ForgotLink        = styled(MotionButton)({ color: '#C8FF00', fontSize: 12, fontWeight: 600, padding: 0, minWidth: 0 })
const FieldsGroup       = styled(Box)({ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 })
const ErrorText         = styled(Typography)({ color: 'rgba(255,80,80,0.9)', fontSize: 11.5, marginTop: '5px' })
const DividerRow        = styled(Box)({ display: 'flex', alignItems: 'center', gap: '14px', margin: '4px 0' })
const DividerLine       = styled(Box)({ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' })
const DividerLabel      = styled(Typography)({ fontSize: 12, color: 'rgba(255,255,255,0.22)' })
const OAuthAppleButton  = styled(MotionButton)({ height: 54, borderRadius: '18px', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', gap: '10px' })
const OAuthGoogleButton = styled(MotionButton)({ height: 50, borderRadius: '16px', fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', gap: '10px' })
const SSOGroup          = styled(Box)({ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 })
const SignUpRow         = styled(Box)({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 8 })
const SignUpPrompt      = styled(Typography)({ fontSize: 13.5, color: 'rgba(255,255,255,0.32)' })
const SignUpLink        = styled(MotionButton)({ color: '#C8FF00', fontSize: 13.5, fontWeight: 700, padding: 0, minWidth: 0 })
const FooterBox         = styled(Box)(({ theme }) => ({
  padding: '20px 24px 48px',
  [theme.breakpoints.up('md')]: {
    padding: 0,
  },
}))
const PasswordIconBtn   = styled(IconButton)({ marginRight: '-8px' })

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

const SignIn = () => {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched]   = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const errors = {
    email:    !emailRe.test(email) ? 'Enter a valid email' : null,
    password: !password            ? 'Required'            : null,
  }
  const isValid = Object.values(errors).every(e => e === null)

  const touch = (key: string) => setTouched(t => ({ ...t, [key]: true }))

  const handleSignIn = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const data = await loginUser({ email, password })
      const accessToken = data?.data?.accessToken ?? data?.accessToken ?? data?.token
      const refreshToken = data?.data?.refreshToken ?? data?.refreshToken
      if (!accessToken) throw 'Invalid response from server.'
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      setToken(accessToken)
      if (data?.user) setUser(data.user)
      navigate('/')
    } catch (err: any) {
      setSubmitError(typeof err === 'string' ? err : 'Sign in failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential
    if (!idToken) {
      setSubmitError('Google sign-in failed. Please try again.')
      return
    }
    setSubmitError(null)
    try {
      const data = await googleLogin({ idToken })
      const accessToken = data?.data?.accessToken ?? data?.accessToken ?? data?.token
      const refreshToken = data?.data?.refreshToken ?? data?.refreshToken
      if (!accessToken) throw 'Invalid response from server.'
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      setToken(accessToken)
      if (data?.user) setUser(data.user)
      navigate('/')
    } catch (err: any) {
      setSubmitError(typeof err === 'string' ? err : 'Google sign-in failed. Please try again.')
    }
  }

  return (
    <ScreenRoot>
      <FormCard>
        <CardHeader>
          <BackBtn initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.90 }} onClick={() => navigate(-1)} variant="outlined">
            <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
          </BackBtn>
        </CardHeader>
        <Body>
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, type: 'spring', stiffness: 300, damping: 28 }}>
            <Heading>Welcome back</Heading>
            <Subtitle variant="body2">Sign in to your account.</Subtitle>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <FieldsGroup>
              <Box>
                <FieldLabel>Email address</FieldLabel>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="jane@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => touch('email')}
                />
                {touched.email && errors.email && <ErrorText>{errors.email}</ErrorText>}
              </Box>

              <Box>
                <PasswordRow>
                  <FieldLabel sx={{ mb: 0 }}>Password</FieldLabel>
                  <ForgotLink
                    variant="text"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth/forgot-password')}
                  >
                    Forgot password?
                  </ForgotLink>
                </PasswordRow>
                <TextField
                  fullWidth
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => touch('password')}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <PasswordIconBtn onClick={() => setShowPass(s => !s)} edge="end">
                            {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                          </PasswordIconBtn>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {touched.password && errors.password && <ErrorText>{errors.password}</ErrorText>}
              </Box>
            </FieldsGroup>

            <PrimaryButton onClick={handleSignIn} label={submitting ? 'Signing in...' : 'Sign in'} disabled={!isValid || submitting} />
            {submitError && <ErrorText sx={{ mt: 1, textAlign: 'center' }}>{submitError}</ErrorText>}

            <DividerRow sx={{ mt: 3 }}>
              <DividerLine /><DividerLabel variant="caption">or continue with</DividerLabel><DividerLine />
            </DividerRow>

            <SSOGroup sx={{ mt: 2 }}>
              <OAuthAppleButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={() => navigate('/')}>
                <AppleIcon /> Continue with Apple
              </OAuthAppleButton>
              <Box sx={{ position: 'relative' }}>
                <OAuthGoogleButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} sx={{ color: 'text.primary' }}>
                  <GoogleIcon /> Continue with Google
                </OAuthGoogleButton>
                <Box sx={{ position: 'absolute', inset: 0, opacity: 0, '& > div, & iframe': { width: '100% !important', height: '100% !important' } }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setSubmitError('Google sign-in failed. Please try again.')}
                    width="400"
                  />
                </Box>
              </Box>
            </SSOGroup>

            <SignUpRow>
              <SignUpPrompt variant="caption">Don't have an account?</SignUpPrompt>
              <SignUpLink variant="text" whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth/sign-up')}>
                Sign up
              </SignUpLink>
            </SignUpRow>
          </motion.div>
        </Body>

        <FooterBox />
      </FormCard>
    </ScreenRoot>
  )
}

export default SignIn
