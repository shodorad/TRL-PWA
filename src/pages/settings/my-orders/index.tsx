import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ArrowLeft, Package, ChevronRight, Truck, CheckCircle, Clock, RotateCcw } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'

const MotionButton = motion.create(Button)

const ScreenRoot   = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px' })
const Header       = styled(Box)({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px 16px' })
const BackBtn      = styled(MotionButton)({ minWidth: 0, width: 40, height: 40, borderRadius: '12px', padding: 0, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' })
const PageTitle    = styled(Typography)({ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' })
const ScrollArea   = styled(Box)({ flex: 1, overflowY: 'auto', padding: '0 20px 100px' })
const SectionLabel = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px', marginTop: '20px' })
const EmptyWrap    = styled(Box)({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px' })
const EmptyText    = styled(Typography)({ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center' })

type OrderStatus = 'delivered' | 'in_transit' | 'processing' | 'returned'

interface Order {
  id: string
  date: string
  status: OrderStatus
  items: string[]
  total: number
  tracking?: string
}

const ORDERS: Order[] = [
  {
    id: 'TLR-20250412',
    date: 'Apr 12, 2025',
    status: 'delivered',
    items: ['TrackLynk OBD Pro ×1', 'Personal Plan – Monthly'],
    total: 58.65,
    tracking: '1Z999AA10123456784',
  },
  {
    id: 'TLR-20250301',
    date: 'Mar 1, 2025',
    status: 'delivered',
    items: ['TrackLynk OBD Pro ×1'],
    total: 49.00,
    tracking: '1Z999AA10123456001',
  },
  {
    id: 'TLR-20250505',
    date: 'May 5, 2025',
    status: 'in_transit',
    items: ['TrackLynk OBD Pro ×2', 'Business Plan – Monthly'],
    total: 116.65,
    tracking: '1Z999AA10123456999',
  },
]

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; Icon: React.ElementType }> = {
  delivered:  { label: 'Delivered',  color: '#4ade80', bg: 'rgba(74,222,128,0.10)',  border: 'rgba(74,222,128,0.25)',  Icon: CheckCircle },
  in_transit: { label: 'In Transit', color: '#C8FF00', bg: 'rgba(200,255,0,0.10)',   border: 'rgba(200,255,0,0.25)',   Icon: Truck },
  processing: { label: 'Processing', color: '#facc15', bg: 'rgba(250,204,21,0.10)',  border: 'rgba(250,204,21,0.25)',  Icon: Clock },
  returned:   { label: 'Returned',   color: '#E8656A', bg: 'rgba(232,101,106,0.10)', border: 'rgba(232,101,106,0.25)', Icon: RotateCcw },
}

const MyOrders = () => {
  const navigate = useNavigate()

  return (
    <ScreenRoot>
      <Header>
        <BackBtn whileTap={{ scale: 0.90 }} onClick={() => navigate('/settings')} variant="outlined">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <PageTitle color="text.primary">My Orders</PageTitle>
      </Header>

      <ScrollArea>
        {ORDERS.length === 0 ? (
          <EmptyWrap>
            <Package size={40} color="rgba(255,255,255,0.18)" />
            <EmptyText>No orders yet</EmptyText>
          </EmptyWrap>
        ) : (
          <>
            <SectionLabel>Order History</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ORDERS.map((order, i) => {
                const { label, color, bg, border, Icon } = STATUS_CONFIG[order.status]
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 26 }}
                  >
                    <GlassCard sx={{ p: '16px', cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.07)' } }}>
                      {/* Top row */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '10px' }}>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
                            {order.id}
                          </Typography>
                          <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.38)', mt: '2px' }}>
                            {order.date}
                          </Typography>
                        </Box>
                        <Chip
                          icon={<Icon size={11} color={color} style={{ marginLeft: 6 }} />}
                          label={label}
                          size="small"
                          sx={{
                            background: bg,
                            border: `1px solid ${border}`,
                            color,
                            fontSize: 11,
                            fontWeight: 700,
                            height: 24,
                            borderRadius: '8px',
                            '& .MuiChip-label': { px: '6px' },
                            '& .MuiChip-icon': { ml: '6px', mr: '-2px' },
                          }}
                        />
                      </Box>

                      {/* Items */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mb: '12px' }}>
                        {order.items.map(item => (
                          <Typography key={item} sx={{ fontSize: 13, color: 'rgba(255,255,255,0.62)' }}>
                            {item}
                          </Typography>
                        ))}
                      </Box>

                      {/* Divider */}
                      <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.07)', mb: '12px' }} />

                      {/* Bottom row */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', mb: '2px' }}>Total</Typography>
                          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#C8FF00', letterSpacing: '-0.3px' }}>
                            ${order.total.toFixed(2)}
                          </Typography>
                        </Box>
                        {order.tracking && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Truck size={13} color="rgba(255,255,255,0.30)" />
                            <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
                              {order.tracking.slice(-8)}
                            </Typography>
                            <ChevronRight size={13} color="rgba(255,255,255,0.20)" />
                          </Box>
                        )}
                      </Box>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </Box>
          </>
        )}
      </ScrollArea>
    </ScreenRoot>
  )
}

export default MyOrders
