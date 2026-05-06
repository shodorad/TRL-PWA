import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Camera, HelpCircle, CheckCircle2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { useVehicle } from '@/contexts/VehicleContext'

const STEP = 6
const TOTAL = 10

interface VinEntry {
  id:       string
  vin:      string
  model:    string
  nickname: string
  plate:    string
  expanded: boolean
}

const MotionButton    = motion.create(Button)
const ScreenRoot      = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px', position: 'relative' })
const ScrollArea      = styled(Box)({ flex: 1, padding: '16px 24px 0', overflowY: 'auto' })
const HeadingText     = styled(Typography)({ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', marginBottom: '6px' })
const SubText         = styled(Typography)({ fontSize: 14, marginBottom: '24px' })
const ScanButton      = styled(MotionButton, { shouldForwardProp: p => p !== 'scanning' })<{ scanning?: boolean }>(({ scanning }) => ({ height: 76, borderRadius: '20px', gap: '12px', marginBottom: '18px', background: scanning ? 'rgba(200,255,0,0.12)' : 'rgba(200,255,0,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderStyle: 'dashed', borderColor: scanning ? 'rgba(200,255,0,0.7)' : 'rgba(200,255,0,0.3)', color: 'primary.main' }))
const ScanButtonLabel = styled(Typography)({ color: 'primary.main', fontSize: 15, fontWeight: 600 })
const DividerRow      = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' })
const DividerLine     = styled(Box)({ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' })
const DividerLabel    = styled(Typography)({ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.28)' })
const VinInputLabel   = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '8px' })
const VinCounterText  = styled(Typography, { shouldForwardProp: p => p !== 'valid' })<{ valid?: boolean }>(({ valid }) => ({ color: valid ? '#4ade80' : undefined, fontSize: 11.5, fontWeight: 700 }))
const MatchBadge      = styled(Box)({ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '10px', padding: '10px 14px', borderRadius: '13px', backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' })
const MatchDot        = styled(Box)({ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.6)', flexShrink: 0 })
const SpinnerShell    = styled('div')({ width: 22, height: 22, border: '2.5px solid #C8FF00', borderTopColor: 'transparent', borderRadius: '50%' })
const MotionSpinner   = motion.create(SpinnerShell)
const MatchText       = styled(Typography)({ color: '#4ade80', fontSize: 13, fontWeight: 600 })
const HintCard        = styled(Box)({ display: 'flex', gap: '10px', marginTop: '18px', marginBottom: '24px', padding: '14px', borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)' })
const HintText        = styled(Typography)({ fontSize: 12.5, lineHeight: 1.65 })
const FieldLabel      = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, marginBottom: '8px' })
const FooterBox       = styled(Box)({ padding: '12px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' })
const SkipButton      = styled(MotionButton)({ color: 'rgba(255,255,255,0.38)', fontSize: 13.5, fontWeight: 500, paddingTop: '6px', paddingBottom: '6px' })

const MOCK_MODELS: Record<string, string> = {
  '3TMLB5JN1RM038617': 'Toyota Tacoma 2024',
  '1HGCM82633A004352': 'Honda Accord 2023',
}

const AddVehicle = () => {
  const navigate = useNavigate()
  const { setVehicle } = useVehicle()

  const [entries, setEntries]   = useState<VinEntry[]>([])
  const [vin, setVin]           = useState('')
  const [scanning, setScanning] = useState(false)

  const isValid = vin.length === 17
  const model   = MOCK_MODELS[vin] ?? (isValid ? 'Vehicle Found' : '')

  const update = (id: string, patch: Partial<VinEntry>) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => { setVin('3TMLB5JN1RM038617'); setScanning(false) }, 1400)
  }

  const handleAdd = () => {
    if (!isValid) return
    setEntries(prev => [...prev, { id: Date.now().toString(), vin, model, nickname: '', plate: '', expanded: false }])
    setVin('')
  }

  const removeEntry = (id: string) =>
    setEntries(prev => prev.filter(e => e.id !== id))

  const handleContinue = () => {
    const first = entries[0]
    if (first) setVehicle(v => ({ ...v, vin: first.vin, model: first.model, nickname: first.nickname || first.model, plate: first.plate }))
    navigate('/onboarding/vehicle-details')
  }

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Add Your Vehicle" />

      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeadingText>Add your vehicle</HeadingText>
          <SubText variant="body2">We'll use your VIN to sync device data with your vehicle.</SubText>
        </motion.div>

        {/* Added vehicles list */}
        <AnimatePresence>
          {entries.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginBottom: 20 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.6px', textTransform: 'uppercase', mb: '10px' }}>
                Added vehicles
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <AnimatePresence>
                  {entries.map(e => (
                    <motion.div key={e.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}>
                      <Box sx={{ borderRadius: '16px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.18)', overflow: 'hidden' }}>

                        {/* Entry header */}
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, cursor: 'pointer' }}
                          onClick={() => update(e.id, { expanded: !e.expanded })}
                        >
                          <CheckCircle2 size={16} color="#4ade80" style={{ flexShrink: 0 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                              {e.nickname || e.model}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', letterSpacing: '1px', lineHeight: 1.4 }}>
                              {e.vin}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {e.expanded
                              ? <ChevronUp size={15} color="rgba(255,255,255,0.3)" />
                              : <ChevronDown size={15} color="rgba(255,255,255,0.3)" />
                            }
                            <Box
                              component="button"
                              onClick={ev => { ev.stopPropagation(); removeEntry(e.id) }}
                              sx={{ background: 'none', border: 'none', cursor: 'pointer', p: 0.5, display: 'flex', color: 'rgba(255,255,255,0.25)', '&:hover': { color: 'rgba(255,80,80,0.7)' } }}
                            >
                              <Trash2 size={14} />
                            </Box>
                          </Box>
                        </Box>

                        {/* Inline setup fields */}
                        <AnimatePresence>
                          {e.expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <Box sx={{ px: 2, pb: 2, pt: 0.5, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box>
                                  <FieldLabel>Nickname <Box component="span" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</Box></FieldLabel>
                                  <TextField
                                    fullWidth size="small"
                                    placeholder="e.g. Daily Driver, Work Truck..."
                                    value={e.nickname}
                                    onChange={ev => update(e.id, { nickname: ev.target.value })}
                                  />
                                </Box>
                                <Box>
                                  <FieldLabel>License Plate <Box component="span" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</Box></FieldLabel>
                                  <TextField
                                    fullWidth size="small"
                                    placeholder="e.g. ABC 1234"
                                    value={e.plate}
                                    onChange={ev => update(e.id, { plate: ev.target.value.toUpperCase() })}
                                    sx={{ '& input': { letterSpacing: e.plate ? '2.5px' : 0, fontWeight: e.plate ? 700 : 400 } }}
                                  />
                                </Box>
                              </Box>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan + input form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <ScanButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={handleScan} scanning={scanning}>
            {scanning ? <MotionSpinner animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} /> : <Camera size={20} color="#C8FF00" />}
            <ScanButtonLabel>{scanning ? 'Scanning barcode...' : entries.length > 0 ? 'Scan another VIN' : 'Scan VIN barcode'}</ScanButtonLabel>
          </ScanButton>

          <DividerRow><DividerLine /><DividerLabel variant="caption">or type manually</DividerLabel><DividerLine /></DividerRow>

          <VinInputLabel>Vehicle Identification Number (VIN)</VinInputLabel>
          <TextField
            fullWidth
            slotProps={{
              htmlInput: { maxLength: 17 },
              input: { endAdornment: <InputAdornment position="end"><VinCounterText valid={isValid}>{vin.length}/17</VinCounterText></InputAdornment> },
            }}
            placeholder="17 characters, e.g. 3TMLB5JN1RM0..."
            value={vin}
            onChange={e => setVin(e.target.value.toUpperCase())}
            sx={{ '& input': { letterSpacing: vin ? '1.5px' : 0, fontWeight: vin ? 600 : 400, fontSize: vin ? 13 : 15 }, '& .MuiOutlinedInput-notchedOutline': isValid ? { borderColor: 'rgba(74,222,128,0.6) !important' } : {} }}
          />

          <AnimatePresence>
            {isValid && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <MatchBadge><MatchDot /><MatchText>Match found — {model}</MatchText></MatchBadge>
                <MotionButton
                  fullWidth variant="outlined"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdd}
                  sx={{ mt: 1.5, height: 50, borderRadius: '16px', fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', gap: 1 }}
                >
                  <Plus size={15} />
                  Add vehicle
                </MotionButton>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <HintCard>
              <HelpCircle size={17} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: 1 }} />
              <HintText variant="body2">Your VIN is on a sticker inside your driver's door frame, or on the dashboard near the windshield.</HintText>
            </HintCard>
          </motion.div>
        </motion.div>
      </ScrollArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <FooterBox>
          <PrimaryButton onClick={handleContinue} label="Continue" />
          {entries.length === 0 && (
            <SkipButton fullWidth variant="text" whileTap={{ scale: 0.97 }} onClick={() => navigate('/')}>Skip for now</SkipButton>
          )}
        </FooterBox>
      </motion.div>
    </ScreenRoot>
  )
}

export default AddVehicle
