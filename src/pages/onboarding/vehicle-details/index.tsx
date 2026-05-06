import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, TextField, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CheckCircle2, Car, Plus, Trash2 } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import { GlassCard } from '@/components/common/GlassCard'
import PrimaryButton from '@/components/common/PrimaryButton'
import Car3D from '@/components/common/Car3D'
import { useVehicle } from '@/contexts/VehicleContext'
import { useDevice } from '@/contexts/DeviceContext'

const STEP  = 7
const TOTAL = 10

interface VehicleEntry {
  id:         string
  model:      string
  nickname:   string
  plate:      string
  scanning:   boolean
  deviceImei: string | null
}

const MotionButton   = motion.create(Button)
const ScreenRoot     = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea     = styled(Box)({ flex: 1, padding: '16px 24px 0', overflowY: 'auto' })
const HeadingText    = styled(Typography)({ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', marginBottom: '6px' })
const SubText        = styled(Typography)({ fontSize: 14, marginBottom: '24px' })
const FieldLabel     = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, marginBottom: '8px' })
const FooterBox      = styled(Box)({ padding: '20px 24px 48px', display: 'flex', flexDirection: 'column', gap: 10 })
const SkipBtn        = styled(MotionButton)({ color: 'rgba(255,255,255,0.38)', fontSize: 13.5, fontWeight: 500 })

const VehicleDetails = () => {
  const navigate = useNavigate()
  const { vehicle, setVehicle } = useVehicle()
  const { setDeviceScanned }    = useDevice()

  const [entries, setEntries] = useState<VehicleEntry[]>([{
    id:         '1',
    model:      vehicle.model || vehicle.vin || 'My Vehicle',
    nickname:   vehicle.nickname || '',
    plate:      vehicle.plate   || '',
    scanning:   false,
    deviceImei: null,
  }])

  const update = (id: string, patch: Partial<VehicleEntry>) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))

  const addVehicle = () =>
    setEntries(prev => [...prev, { id: Date.now().toString(), model: 'New Vehicle', nickname: '', plate: '', scanning: false, deviceImei: null }])

  const removeEntry = (id: string) =>
    setEntries(prev => prev.filter(e => e.id !== id))

  const handleScan = (id: string) => {
    update(id, { scanning: true })
    setTimeout(() => {
      const idx  = entries.findIndex(e => e.id === id)
      const imei = `35260211614${6553 + idx}`
      update(id, { scanning: false, deviceImei: imei })
      setDeviceScanned(true)
    }, 1200)
  }

  const handleContinue = () => {
    const first = entries[0]
    setVehicle(v => ({ ...v, nickname: first.nickname || first.model || 'My Vehicle', plate: first.plate }))
    navigate('/onboarding/device-setup-wizard')
  }

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Vehicle Setup" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeadingText>Set up your vehicles</HeadingText>
          <SubText variant="body2">Name each vehicle and pair it with your TrackLynk OBD device.</SubText>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 3 }}>
          <AnimatePresence>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.06 }}
              >
                <GlassCard sx={{ p: '16px', position: 'relative', overflow: 'hidden' }}>

                  {/* Car 3D visual — first vehicle only */}
                  {i === 0 && (
                    <Box sx={{ opacity: 0.88, mb: 1 }}>
                      <Car3D width={280} />
                    </Box>
                  )}

                  {/* Vehicle header row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {i > 0 && (
                        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Car size={18} color="rgba(255,255,255,0.45)" />
                        </Box>
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.2 }}>
                          {entry.nickname || entry.model}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.3 }}>
                          {entry.model}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {entry.deviceImei ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: '99px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                          <CheckCircle2 size={11} color="#4ade80" />
                          <Typography sx={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Paired</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ px: 1.25, py: 0.5, borderRadius: '99px', background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.22)' }}>
                          <Typography sx={{ fontSize: 11, color: '#facc15', fontWeight: 600 }}>Setting up</Typography>
                        </Box>
                      )}
                      {i > 0 && (
                        <Box
                          component="button"
                          onClick={() => removeEntry(entry.id)}
                          sx={{ background: 'none', border: 'none', cursor: 'pointer', p: 0.5, display: 'flex', color: 'rgba(255,255,255,0.25)', '&:hover': { color: 'rgba(255,80,80,0.7)' } }}
                        >
                          <Trash2 size={14} />
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Fields */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                    <Box>
                      <FieldLabel>
                        Nickname <Box component="span" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</Box>
                      </FieldLabel>
                      <TextField
                        fullWidth size="small"
                        placeholder="e.g. Daily Driver, Work Truck..."
                        value={entry.nickname}
                        onChange={e => update(entry.id, { nickname: e.target.value })}
                      />
                    </Box>
                    <Box>
                      <FieldLabel>
                        License Plate <Box component="span" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</Box>
                      </FieldLabel>
                      <TextField
                        fullWidth size="small"
                        placeholder="e.g. ABC 1234"
                        value={entry.plate}
                        onChange={e => update(entry.id, { plate: e.target.value.toUpperCase() })}
                        sx={{ '& input': { letterSpacing: entry.plate ? '2.5px' : 0, fontWeight: entry.plate ? 700 : 400 } }}
                      />
                    </Box>
                  </Box>

                  {/* OBD pairing */}
                  <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', pt: 1.5 }}>
                    {entry.deviceImei ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <CheckCircle2 size={15} color="#4ade80" />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Device paired</Typography>
                          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', lineHeight: 1.3 }}>IMEI: {entry.deviceImei}</Typography>
                        </Box>
                        <Button variant="text" size="small" onClick={() => update(entry.id, { deviceImei: null })} sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', minWidth: 0 }}>
                          Remove
                        </Button>
                      </Box>
                    ) : (
                      <MotionButton
                        fullWidth variant="outlined"
                        whileTap={{ scale: 0.97 }}
                        disabled={entry.scanning}
                        onClick={() => handleScan(entry.id)}
                        sx={{ height: 44, borderRadius: '14px', fontSize: 13.5, fontWeight: 600, background: 'rgba(200,255,0,0.04)', border: '1.5px solid rgba(200,255,0,0.2)', color: '#C8FF00', '&:hover': { background: 'rgba(200,255,0,0.08)', border: '1.5px solid rgba(200,255,0,0.35)' }, '&.Mui-disabled': { color: 'rgba(200,255,0,0.35)', border: '1.5px solid rgba(200,255,0,0.1)' } }}
                      >
                        {entry.scanning ? 'Scanning…' : 'Pair OBD Device'}
                      </MotionButton>
                    )}
                  </Box>

                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add another vehicle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <MotionButton
              fullWidth variant="outlined"
              whileTap={{ scale: 0.97 }}
              onClick={addVehicle}
              sx={{ height: 50, borderRadius: '18px', fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', gap: 1 }}
            >
              <Plus size={16} />
              Add another vehicle
            </MotionButton>
          </motion.div>
        </Box>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterBox>
          <PrimaryButton onClick={handleContinue} label="Continue" />
          <SkipBtn variant="text" fullWidth whileTap={{ scale: 0.96 }} onClick={() => navigate('/')}>
            Skip for now
          </SkipBtn>
        </FooterBox>
      </motion.div>
    </ScreenRoot>
  )
}

export default VehicleDetails
