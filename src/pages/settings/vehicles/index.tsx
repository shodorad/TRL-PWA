import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Car, Plus, ChevronRight, Cpu } from 'lucide-react'
import { useVehicle } from '@/contexts/VehicleContext'
import { GlassCard } from '@/components/common/GlassCard'
import { SectionLabel, PageHeader, DangerButton, StatusDot, SignalStrength, ListRow } from '@/components'

const MotionButton = motion.create(Button)
const SPRING       = { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.8 }

const ScreenRoot = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const ScrollArea = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const FieldLabel = styled(Typography)({ color: 'rgba(255,255,255,0.48)', fontSize: 12, fontWeight: 600, marginBottom: '6px' })

/* ── VehicleDetailView ── */
function VehicleDetailView({ onBack }: { onBack: () => void }) {
  const { vehicle, setVehicle } = useVehicle()
  const [nickname, setNickname] = useState(vehicle.nickname || vehicle.model || '')
  const [plate, setPlate]       = useState(vehicle.plate || '')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    setNickname(vehicle.nickname || vehicle.model || '')
    setPlate(vehicle.plate || '')
  }, [vehicle.vin])

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setVehicle(v => ({ ...v, nickname, plate }))
      setSaving(false)
      setSaved(true)
      setTimeout(onBack, 800)
    }, 700)
  }

  const handleRemove = () => {
    if (window.confirm('Remove this vehicle? This cannot be undone.')) {
      setVehicle({ vin: '', nickname: '', plate: '', model: '' })
      onBack()
    }
  }

  return (
    <ScreenRoot>
      <PageHeader title={vehicle.nickname || 'Vehicle Details'} onBack={onBack} />
      <ScrollArea>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionLabel sx={{ mt: '4px', mb: '8px' }}>Vehicle Info</SectionLabel>
          <GlassCard sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Box>
              <FieldLabel>Nickname</FieldLabel>
              <TextField fullWidth value={nickname} onChange={e => setNickname(e.target.value)}
                placeholder="e.g. My Tacoma"
                slotProps={{ input: { startAdornment: <Car size={15} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} /> } }}
              />
            </Box>
            <Box>
              <FieldLabel>License Plate</FieldLabel>
              <TextField fullWidth value={plate} onChange={e => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                placeholder="ABC 1234"
                slotProps={{ input: { inputProps: { style: { letterSpacing: '2px', fontWeight: 600 } } } }}
              />
            </Box>
            {vehicle.vin && (
              <Box>
                <FieldLabel>VIN</FieldLabel>
                <Typography sx={{ fontSize: 13, fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', p: '10px 14px' }}>
                  {vehicle.vin}
                </Typography>
              </Box>
            )}
          </GlassCard>

          <SectionLabel sx={{ mb: '8px' }}>Device Status</SectionLabel>
          <GlassCard sx={{ p: '4px' }}>
            <ListRow
              icon={<Cpu size={16} color="#C8FF00" />}
              iconVariant="lime"
              title="TrackLynk OBD-II"
              subtitle="Device IMEI: 353-867-09-013"
              rightSlot={<SignalStrength level={3} />}
              showChevron={false}
              divider
            />
            <ListRow
              icon={<StatusDot variant="online" pulse />}
              iconVariant="surface"
              title="Connected · Last seen just now"
              showChevron={false}
              divider={false}
            />
          </GlassCard>

          <MotionButton
            fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={handleSave}
            disabled={saving || saved}
            sx={{ mt: 3, height: 52, borderRadius: '16px', fontWeight: 700, fontSize: 15 }}
          >
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </MotionButton>

          <Box sx={{ mt: '12px' }}>
            <DangerButton label="Remove Vehicle" onClick={handleRemove} fullWidth />
          </Box>
        </motion.div>
      </ScrollArea>
    </ScreenRoot>
  )
}

/* ── Vehicles (main) ── */
const Vehicles = () => {
  const navigate            = useNavigate()
  const { vehicle }         = useVehicle()
  const hasVehicle          = Boolean(vehicle.vin || vehicle.model)
  const [activeView, setAV] = useState<'main' | 'detail'>('main')

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <ScreenRoot>
        <PageHeader title="Vehicles" onBack={() => navigate('/settings')} />

        <ScrollArea>
          {hasVehicle && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <GlassCard onClick={() => setAV('detail')} sx={{ p: '14px 16px', mb: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.07)' } }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(200,255,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={20} color="#C8FF00" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{vehicle.nickname || vehicle.model || 'My Vehicle'}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>VIN: {vehicle.vin || 'Not set'} · {vehicle.plate || 'No plate'}</Typography>
                </Box>
                <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
              </GlassCard>
            </motion.div>
          )}

          <MotionButton
            fullWidth variant="outlined" whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/onboarding/add-vehicle')}
            sx={{ height: 54, borderRadius: '16px', borderStyle: 'dashed', borderColor: 'rgba(200,255,0,0.3)', background: 'rgba(200,255,0,0.05)', gap: '8px', mt: hasVehicle ? 0 : 2 }}
          >
            <Plus size={18} color="#C8FF00" />
            <Typography sx={{ color: '#C8FF00', fontWeight: 600 }}>Add a Vehicle</Typography>
          </MotionButton>
        </ScrollArea>
      </ScreenRoot>

      <AnimatePresence>
        {activeView === 'detail' && (
          <motion.div
            key="detail"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={SPRING}
            style={{ position: 'absolute', inset: 0, background: '#04050d', zIndex: 10, display: 'flex', flexDirection: 'column' }}
          >
            <VehicleDetailView onBack={() => setAV('main')} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default Vehicles
