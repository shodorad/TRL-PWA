import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, TextField, Button, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, User, Mail, Phone, Lock, LogOut, Fingerprint } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion(Button)

const ScreenRoot    = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header        = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn       = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle     = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea    = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const SectionLabel  = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', marginTop: '20px' })
const FieldLabel    = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, marginBottom: '6px' })
const AvatarCircle  = styled(Box)({ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #C8FF00, #8FB800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#000', margin: '0 auto 16px' })
const DangerButton  = styled(MotionButton)({ background: 'rgba(232,101,106,0.10)', color: '#E8656A', border: '1px solid rgba(232,101,106,0.25)', borderRadius: '14px', '&:hover': { background: 'rgba(232,101,106,0.18)' } })

const Account = () => {
  const navigate = useNavigate()
  const { user, setToken } = useAuth()
  const [name, setName]   = useState(`${user.firstName} ${user.lastName}`.trim() || 'Shobhit Singh')
  const [email, setEmail] = useState(user.email || 'user@tracklynk.com')
  const [phone, setPhone] = useState(user.phone || '+1 (555) 000-0000')

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('accessToken')
    navigate('/onboarding/welcome')
  }

  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle>Account</PageTitle>
      </Header>

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <AvatarCircle>{(user.firstName?.[0] || 'S').toUpperCase()}</AvatarCircle>
        </motion.div>

        <SectionLabel>Profile</SectionLabel>
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

        <SectionLabel>Security</SectionLabel>
        <GlassCard sx={{ p: '4px' }}>
          {[
            { icon: Lock,        label: 'Change Password',   sub: 'Last changed 3 months ago' },
            { icon: Fingerprint, label: 'Face ID / Touch ID', sub: 'Enabled for quick access' },
          ].map(({ icon: Icon, label, sub }, i, arr) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: 'pointer', borderRadius: '14px', '&:hover': { background: 'rgba(255,255,255,0.04)' } }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="#C8FF00" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{label}</Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{sub}</Typography>
              </Box>
            </Box>
          ))}
        </GlassCard>

        <SectionLabel>Danger Zone</SectionLabel>
        <DangerButton fullWidth whileTap={{ scale: 0.97 }} onClick={handleLogout} sx={{ height: 50 }}>
          <LogOut size={16} style={{ marginRight: 8 }} /> Sign Out
        </DangerButton>
      </ScrollArea>
    </ScreenRoot>
  )
}

export default Account
