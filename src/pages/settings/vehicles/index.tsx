import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Car, Plus, ChevronRight } from 'lucide-react'
import { useVehicle } from '@/contexts/VehicleContext'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion.create(Button)
const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header       = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn      = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle    = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })

const Vehicles = () => {
  const navigate       = useNavigate()
  const { vehicle }    = useVehicle()
  const hasVehicle     = Boolean(vehicle.vin || vehicle.model)

  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle>Vehicles</PageTitle>
      </Header>

      <ScrollArea>
        {hasVehicle && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <GlassCard sx={{ p: '14px 16px', mb: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
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
          fullWidth
          variant="outlined"
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/onboarding/add-vehicle')}
          sx={{ height: 54, borderRadius: '16px', borderStyle: 'dashed', borderColor: 'rgba(200,255,0,0.3)', background: 'rgba(200,255,0,0.05)', gap: '8px', mt: hasVehicle ? 0 : 2 }}
        >
          <Plus size={18} color="#C8FF00" />
          <Typography sx={{ color: '#C8FF00', fontWeight: 600 }}>Add a Vehicle</Typography>
        </MotionButton>
      </ScrollArea>
    </ScreenRoot>
  )
}

export default Vehicles
