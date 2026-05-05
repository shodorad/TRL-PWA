import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Camera, HelpCircle } from 'lucide-react'
import ProgressBar from '@/components/common/ProgressBar'
import PrimaryButton from '@/components/common/PrimaryButton'
import { useVehicle } from '@/contexts/VehicleContext'

const STEP = 4
const TOTAL = 8

const MotionButton = motion.create(Button)

const ScreenRoot    = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px', position: 'relative' })
const ContentArea   = styled(Box)({ flex: 1, padding: '16px 24px 0' })
const HeadingText   = styled(Typography)({ fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', marginBottom: '6px' })
const SubText       = styled(Typography)({ fontSize: 14, marginBottom: '24px' })
const ScanButton    = styled(MotionButton, { shouldForwardProp: p => p !== 'scanning' })<{ scanning?: boolean }>(({ scanning }) => ({ height: 76, borderRadius: '20px', gap: '12px', marginBottom: '18px', background: scanning ? 'rgba(200,255,0,0.12)' : 'rgba(200,255,0,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderStyle: 'dashed', borderColor: scanning ? 'rgba(200,255,0,0.7)' : 'rgba(200,255,0,0.3)', color: 'primary.main' }))
const ScanButtonLabel = styled(Typography)({ color: 'primary.main', fontSize: 15, fontWeight: 600 })
const DividerRow    = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' })
const DividerLine   = styled(Box)({ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' })
const DividerLabel  = styled(Typography)({ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.28)' })
const VinInputLabel = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '8px' })
const VinCounterText = styled(Typography, { shouldForwardProp: p => p !== 'valid' })<{ valid?: boolean }>(({ valid }) => ({ color: valid ? '#4ade80' : undefined, fontSize: 11.5, fontWeight: 700 }))
const MatchBadge    = styled(Box)({ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '10px', padding: '10px 14px', borderRadius: '13px', backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' })
const MatchDot      = styled(Box)({ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.6)', flexShrink: 0 })
const SpinnerShell  = styled('div')({ width: 22, height: 22, border: '2.5px solid #C8FF00', borderTopColor: 'transparent', borderRadius: '50%' })
const MotionSpinner = motion.create(SpinnerShell)
const MatchText     = styled(Typography)({ color: '#4ade80', fontSize: 13, fontWeight: 600 })
const HintCard      = styled(Box)({ display: 'flex', gap: '10px', marginTop: '18px', padding: '14px', borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)' })
const HintText      = styled(Typography)({ fontSize: 12.5, lineHeight: 1.65 })
const FooterBox     = styled(Box)({ padding: '12px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' })
const SkipButton    = styled(MotionButton)({ color: 'rgba(255,255,255,0.38)', fontSize: 13.5, fontWeight: 500, paddingTop: '6px', paddingBottom: '6px' })

const AddVehicle = () => {
  const navigate = useNavigate()
  const { setVehicle } = useVehicle()
  const [vin, setVin]         = useState('')
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => { setVin('3TMLB5JN1RM038617'); setScanning(false) }, 1400)
  }

  const isValid = vin.length === 17

  const handleContinue = () => {
    if (isValid) setVehicle(v => ({ ...v, vin, model: 'Toyota Tacoma 2024' }))
    navigate('/onboarding/vehicle-details')
  }

  return (
    <ScreenRoot>
      <ProgressBar current={STEP} total={TOTAL} onBack={() => navigate(-1)} title="Add Your Vehicle" />

      <ContentArea>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <HeadingText>Add your vehicle</HeadingText>
          <SubText variant="body2">We'll use your VIN to sync device data with your vehicle.</SubText>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <ScanButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={handleScan} scanning={scanning}>
            {scanning ? <MotionSpinner animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} /> : <Camera size={20} color="#C8FF00" />}
            <ScanButtonLabel>{scanning ? 'Scanning barcode...' : 'Scan VIN barcode'}</ScanButtonLabel>
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

          {isValid && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <MatchBadge><MatchDot /><MatchText>Match found — Toyota Tacoma 2024</MatchText></MatchBadge>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <HintCard>
              <HelpCircle size={17} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: 1 }} />
              <HintText variant="body2">Your VIN is on a sticker inside your driver's door frame, or on the dashboard near the windshield.</HintText>
            </HintCard>
          </motion.div>
        </motion.div>
      </ContentArea>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <FooterBox>
          {isValid ? (
            <PrimaryButton onClick={handleContinue} label="Continue" />
          ) : (
            <SkipButton fullWidth variant="text" whileTap={{ scale: 0.97 }} onClick={handleContinue}>Skip for now</SkipButton>
          )}
        </FooterBox>
      </motion.div>
    </ScreenRoot>
  )
}

export default AddVehicle
