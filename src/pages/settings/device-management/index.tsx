import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Cpu, Wifi, RotateCcw, Trash2 } from 'lucide-react'
import { useDevice } from '@/contexts/DeviceContext'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion.create(Button)
const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header       = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn      = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle    = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const SectionLabel = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', marginTop: '20px' })
const StatusDot    = styled(Box)<{ online: boolean }>(({ online }) => ({ width: 8, height: 8, borderRadius: '50%', background: online ? '#4ade80' : '#facc15', boxShadow: online ? '0 0 6px rgba(74,222,128,0.6)' : '0 0 6px rgba(250,204,21,0.6)', flexShrink: 0 }))
const DangerButton = styled(MotionButton)({ background: 'rgba(232,101,106,0.10)', color: '#E8656A', border: '1px solid rgba(232,101,106,0.25)', borderRadius: '14px', '&:hover': { background: 'rgba(232,101,106,0.18)' } })

const DeviceManagement = () => {
  const navigate       = useNavigate()
  const { deviceReady, deviceScanned } = useDevice()

  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle>Device Management</PageTitle>
      </Header>

      <ScrollArea>
        <SectionLabel>Connected Device</SectionLabel>
        {deviceScanned || deviceReady ? (
          <GlassCard sx={{ p: '16px', mb: '12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '14px' }}>
              <Box sx={{ width: 42, height: 42, borderRadius: '13px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={20} color="#C8FF00" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>TrackLynk OBD-II</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '3px' }}>
                  <StatusDot online={deviceReady} />
                  <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{deviceReady ? 'Online' : 'Paired, not active'}</Typography>
                </Box>
              </Box>
            </Box>
            {[
              { label: 'IMEI', value: '352602116146553' },
              { label: 'Signal', value: 'Strong' },
              { label: 'Firmware', value: 'v2.4.1' },
              { label: 'Last Sync', value: '12 seconds ago' },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{label}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{value}</Typography>
              </Box>
            ))}
          </GlassCard>
        ) : (
          <GlassCard sx={{ p: '20px', textAlign: 'center' }}>
            <Wifi size={32} color="rgba(255,255,255,0.25)" style={{ marginBottom: 12 }} />
            <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>No device connected</Typography>
            <MotionButton variant="outlined" whileTap={{ scale: 0.97 }} onClick={() => navigate('/onboarding/device-setup-wizard')} sx={{ mt: 2, borderRadius: '12px' }}>
              Set Up Device
            </MotionButton>
          </GlassCard>
        )}

        {(deviceScanned || deviceReady) && (
          <>
            <SectionLabel>Actions</SectionLabel>
            <GlassCard sx={{ p: '4px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RotateCcw size={16} color="#C8FF00" />
                </Box>
                <Typography sx={{ fontSize: 14.5, fontWeight: 500 }}>Restart Device</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', cursor: 'pointer' }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(232,101,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={16} color="#E8656A" />
                </Box>
                <Typography sx={{ fontSize: 14.5, fontWeight: 500, color: '#E8656A' }}>Remove Device</Typography>
              </Box>
            </GlassCard>
          </>
        )}
      </ScrollArea>
    </ScreenRoot>
  )
}

export default DeviceManagement
