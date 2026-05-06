import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, Select, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CheckCircle2, Car, Plus, Trash2 } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { glassCard } from '@/styles/glass'
import { useDevice } from '@/contexts/DeviceContext'

const VEHICLES = [
  { id: '1', nickname: 'My Honda', model: 'Honda Civic 2021' },
  { id: '2', nickname: 'Family SUV', model: 'Toyota RAV4 2022' },
  { id: '3', nickname: 'Work Truck', model: 'Ford F-150 2020' },
]

const STEP = 8
const TOTAL = 10

const MotionButton = motion.create(Button)

const ScreenRoot    = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px', position: 'relative' })
const ContentArea   = styled(Box)({ flex: 1, padding: '16px 24px 0', display: 'flex', flexDirection: 'column' })
const HeadingText   = styled(Typography)({ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', marginBottom: '6px' })
const SubText       = styled(Typography)({ fontSize: 14, marginBottom: '24px' })
const DeviceVisualWrapper = styled('div')({ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 24 })
const DevicePositioner = styled(Box)({ position: 'relative' })
const GlowRingBase  = styled('div')({ position: 'absolute', inset: -12, borderRadius: 30, border: '1px solid rgba(200,255,0,0.25)', pointerEvents: 'none' })
const MotionGlowRing = motion.create(GlowRingBase)
const OBDCard       = styled(Box)({ ...glassCard, width: 160, height: 110, borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden' })
const DeviceLabel   = styled(Typography)({ position: 'absolute', top: 10, left: 12, right: 12, color: 'rgba(255,255,255,0.25)', fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace', textAlign: 'center' })
const BarcodeRow    = styled(Box)({ display: 'flex', gap: '2.5px', alignItems: 'center', marginTop: '10px' })
const BarcodeBar    = styled(Box)<{ barheight: number }>(({ barheight }) => ({ width: 2, height: barheight * 2.8, backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: '1px' }))
const BarcodeSerial = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 8, letterSpacing: '1.5px', fontFamily: 'monospace' })
const ScanLineBase  = styled('div')({ position: 'absolute', left: 8, right: 8, height: 1.5, background: 'linear-gradient(90deg, transparent, #C8FF00 30%, #C8FF00 70%, transparent)', borderRadius: 99, boxShadow: '0 0 6px rgba(200,255,0,0.7)' })
const MotionScanLine = motion.create(ScanLineBase)
const StatusLEDBase = styled('div')({ position: 'absolute', top: 10, right: 12, width: 7, height: 7, borderRadius: '50%' })
const MotionStatusLED = motion.create(StatusLEDBase)
const SuccessBadgeBase = styled('div')({ position: 'absolute', top: -10, right: -10, width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(74,222,128,0.4)' })
const MotionSuccessBadge = motion.create(SuccessBadgeBase)
const ValidatedBox  = styled(Box)({ textAlign: 'center', padding: '16px 24px', borderRadius: '18px', backgroundColor: 'rgba(74,222,128,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(74,222,128,0.2)' })
const ValidatedTitle = styled(Typography)({ color: '#4ade80', fontWeight: 700, fontSize: 16 })
const ValidatedImei = styled(Typography)({ fontSize: 12.5, marginTop: '4px', display: 'block' })
const HintText      = styled(Typography)({ fontSize: 13, maxWidth: 240, lineHeight: 1.6 })
const FooterArea    = styled(Box)({ padding: '12px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' })
const SkipButton    = styled(MotionButton)({ color: 'rgba(255,255,255,0.38)', fontSize: 13.5, fontWeight: 500, paddingTop: '6px', paddingBottom: '6px' })

const ScanDevice = () => {
  const navigate = useNavigate()
  const { setDeviceScanned } = useDevice()
  const [scanned, setScanned] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLES[0].id)
  const [pairedDevices, setPairedDevices] = useState<{ imei: string; vehicleId: string }[]>([])

  const handleScan = () => {
    setTimeout(() => {
      setScanned(true)
      setDeviceScanned(true)
      setPairedDevices(prev => [...prev, { imei: `35260211614${6553 + prev.length}`, vehicleId: selectedVehicleId }])
    }, 1200)
  }

  const handlePairAnother = () => {
    setScanned(false)
    const nextVehicle = VEHICLES.find(v => !pairedDevices.some(p => p.vehicleId === v.id) && v.id !== selectedVehicleId)
    if (nextVehicle) setSelectedVehicleId(nextVehicle.id)
  }

  const removePaired = (imei: string) => {
    setPairedDevices(prev => prev.filter(p => p.imei !== imei))
    if (pairedDevices.length === 1) setScanned(false)
  }

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Connect Device" />

      <ContentArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeadingText>Scan your device</HeadingText>
          <SubText variant="body2">Scan the barcode on the back of your TrackLynk OBD-II device.</SubText>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.6px', textTransform: 'uppercase', mb: '10px' }}>
            Pair to vehicle
          </Typography>

          {VEHICLES.length > 2 ? (
            <Select
              fullWidth
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
              renderValue={id => {
                const v = VEHICLES.find(v => v.id === id)!
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Car size={15} color="#C8FF00" />
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{v.nickname}</Typography>
                      <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{v.model}</Typography>
                    </Box>
                  </Box>
                )
              }}
              sx={{
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&.Mui-focused': { border: '1.5px solid rgba(200,255,0,0.5)' },
                '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    mt: 1,
                  },
                },
              }}
            >
              {VEHICLES.map(v => (
                <MenuItem key={v.id} value={v.id} sx={{ gap: 1.5, py: 1.5, '&.Mui-selected': { background: 'rgba(200,255,0,0.08)' }, '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.id === selectedVehicleId ? 'rgba(200,255,0,0.12)' : 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <Car size={14} color={v.id === selectedVehicleId ? '#C8FF00' : 'rgba(255,255,255,0.35)'} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{v.nickname}</Typography>
                    <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.3 }}>{v.model}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {VEHICLES.map(v => {
                const selected = v.id === selectedVehicleId
                return (
                  <Box
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.25, p: '10px 14px', borderRadius: '16px', cursor: 'pointer', border: selected ? '1.5px solid rgba(200,255,0,0.55)' : '1.5px solid rgba(255,255,255,0.08)', background: selected ? 'rgba(200,255,0,0.07)' : 'rgba(255,255,255,0.04)', transition: 'all 0.18s ease' }}
                  >
                    <Box sx={{ width: 30, height: 30, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected ? 'rgba(200,255,0,0.15)' : 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                      <Car size={14} color={selected ? '#C8FF00' : 'rgba(255,255,255,0.35)'} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: selected ? '#fff' : 'rgba(255,255,255,0.5)', lineHeight: 1.2 }}>{v.nickname}</Typography>
                      <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.3 }}>{v.model}</Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </motion.div>

        <AnimatePresence>
          {pairedDevices.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ marginTop: 20 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.6px', textTransform: 'uppercase', mb: '10px' }}>
                Paired devices
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {pairedDevices.map(p => {
                  const vehicle = VEHICLES.find(v => v.id === p.vehicleId)
                  return (
                    <motion.div key={p.imei} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25, borderRadius: '14px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.18)' }}>
                        <CheckCircle2 size={16} color="#4ade80" />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{vehicle?.nickname}</Typography>
                          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.3, fontFamily: 'monospace' }}>IMEI: {p.imei}</Typography>
                        </Box>
                        <Box component="button" onClick={() => removePaired(p.imei)} sx={{ background: 'none', border: 'none', cursor: 'pointer', p: 0.5, display: 'flex', color: 'rgba(255,255,255,0.25)', '&:hover': { color: 'rgba(255,80,80,0.7)' } }}>
                          <Trash2 size={14} />
                        </Box>
                      </Box>
                    </motion.div>
                  )
                })}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }} style={{ marginTop: 28 }}>
          <DeviceVisualWrapper>
            <DevicePositioner>
              {!scanned && <MotionGlowRing animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} />}
              <OBDCard>
                <DeviceLabel>TRACKLYNK OBD-II</DeviceLabel>
                <BarcodeRow>{[8,4,7,3,9,4,6,3,8,5,7,4,6].map((h, i) => <BarcodeBar key={i} barheight={h} />)}</BarcodeRow>
                <BarcodeSerial>352602116146553</BarcodeSerial>
                {!scanned && <MotionScanLine animate={{ top: ['18%', '78%', '18%'] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} />}
                <MotionStatusLED
                  animate={scanned ? { background: ['#4ade80', '#4ade80'] } : { opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ background: scanned ? '#4ade80' : '#C8FF00', boxShadow: scanned ? '0 0 6px rgba(74,222,128,0.8)' : '0 0 6px rgba(200,255,0,0.6)' }}
                />
              </OBDCard>
              {scanned && <MotionSuccessBadge initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}><CheckCircle2 size={18} color="#fff" /></MotionSuccessBadge>}
            </DevicePositioner>

            <AnimatePresence mode="wait">
              {scanned ? (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <ValidatedBox><ValidatedTitle>Device validated!</ValidatedTitle><ValidatedImei variant="caption">IMEI: 352602116146553</ValidatedImei></ValidatedBox>
                </motion.div>
              ) : (
                <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ textAlign: 'center' }}><HintText variant="body2">Scan the barcode on the back of the device to pair it</HintText></div>
                </motion.div>
              )}
            </AnimatePresence>

            {!scanned && <PrimaryButton onClick={handleScan} label="Scan Barcode" />}
          </DeviceVisualWrapper>
        </motion.div>
      </ContentArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FooterArea>
          {pairedDevices.length > 0 ? (
            <>
              <MotionButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={() => navigate('/onboarding/device-setup-wizard')} sx={{ height: 50, borderRadius: '18px', fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.11)', color: 'rgba(255,255,255,0.72)' }}>
                Continue →
              </MotionButton>
              {scanned && (
                <SkipButton variant="text" whileTap={{ scale: 0.96 }} onClick={handlePairAnother} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Plus size={14} />
                  Pair another device
                </SkipButton>
              )}
            </>
          ) : (
            <SkipButton variant="text" whileTap={{ scale: 0.96 }} onClick={() => navigate('/')}>Skip for now</SkipButton>
          )}
        </FooterArea>
      </motion.div>
    </ScreenRoot>
  )
}

export default ScanDevice
