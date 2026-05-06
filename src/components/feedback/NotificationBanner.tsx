import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Package, PackageCheck, Layers } from 'lucide-react'
import { colors, radius, spring } from '../../styles/tokens'

export type BannerVariant = 'order_in_progress' | 'order_delivered' | 'devices_delivered'

export interface NotificationBannerProps {
  variant:          BannerVariant
  deviceCount?:     number
  onAcknowledge?:   () => void
  onSetupDevice?:   () => void
  onPairVehicles?:  () => void
}

// ─── Variant config ───────────────────────────────────────────────────────────

const VARIANT_CONFIG = {
  order_in_progress: {
    Icon:    Package,
    accent:  colors.warning,
    accentBg: colors.warningSubtle,
    title:   'Order In Progress',
    body:    "Your device is on its way · Est. 2–3 days",
    ctas:    [] as string[],
  },
  order_delivered: {
    Icon:    PackageCheck,
    accent:  colors.success,
    accentBg: colors.successSubtle,
    title:   'Order Delivered',
    body:    'Your device has arrived and is ready to set up.',
    ctas:    ['acknowledge', 'setup_device'] as string[],
  },
  devices_delivered: {
    Icon:    Layers,
    accent:  colors.lime,
    accentBg: colors.limeSubtle,
    title:   'Devices Delivered',
    body:    'Your devices are ready. Pair them to your vehicles.',
    ctas:    ['pair_vehicles'] as string[],
  },
} as const

// ─── Styled ───────────────────────────────────────────────────────────────────

const BannerRoot = styled(motion.div)({
  position:          'relative',
  background:        'rgba(10,12,20,0.94)',
  backdropFilter:    'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border:            `1px solid rgba(255,255,255,0.09)`,
  borderRadius:      radius.rLg,
  overflow:          'hidden',
  boxShadow:         '0 8px 32px rgba(0,0,0,0.60)',
})

const AccentBar = styled('div')<{ color: string }>(({ color }) => ({
  position:     'absolute',
  left:         0,
  top:          0,
  bottom:       0,
  width:        3,
  background:   color,
  borderRadius: `${radius.rLg}px 0 0 ${radius.rLg}px`,
}))

const BannerInner = styled(Box)({
  display:    'flex',
  alignItems: 'flex-start',
  gap:        10,
  padding:    '10px 12px 10px 18px',
})

const IconWrap = styled(Box)<{ bg: string }>(({ bg }) => ({
  flexShrink:      0,
  width:           34,
  height:          34,
  borderRadius:    radius.rSm,
  background:      bg,
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  marginTop:       1,
}))

const ContentCol = styled(Box)({
  flex:    1,
  minWidth: 0,
})

const BannerTitle = styled(Typography)({
  fontSize:      13,
  fontWeight:    700,
  letterSpacing: '-0.2px',
  lineHeight:    1.3,
  color:         colors.textPrimary,
})

const BannerBody = styled(Typography)({
  fontSize:      11,
  fontWeight:    400,
  color:         colors.textSecondary,
  lineHeight:    1.45,
  marginTop:     2,
})

const CtaRow = styled(Box)({
  display:    'flex',
  alignItems: 'center',
  gap:        6,
  marginTop:  8,
})

const GhostBtn = styled(motion.create(Button))({
  minWidth:      0,
  height:        28,
  borderRadius:  radius.rSm,
  padding:       '0 10px',
  fontSize:      11,
  fontWeight:    600,
  background:    'rgba(255,255,255,0.07)',
  border:        '1px solid rgba(255,255,255,0.12)',
  color:         colors.textSecondary,
  letterSpacing: '0.1px',
  '&:hover': {
    background: 'rgba(255,255,255,0.12)',
  },
})

const PrimaryBtn = styled(motion.create(Button))<{ accent: string; accentbg: string }>(({ accent, accentbg }) => ({
  minWidth:      0,
  height:        28,
  borderRadius:  radius.rSm,
  padding:       '0 10px',
  fontSize:      11,
  fontWeight:    700,
  background:    accentbg,
  border:        `1px solid ${accent}30`,
  color:         accent,
  letterSpacing: '0.1px',
  '&:hover': {
    background: `${accentbg}cc`,
  },
}))

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationBanner = ({
  variant,
  deviceCount,
  onAcknowledge,
  onSetupDevice,
  onPairVehicles,
}: NotificationBannerProps) => {
  const config = VARIANT_CONFIG[variant]
  const { Icon, accent, accentBg, ctas } = config

  const title = variant === 'devices_delivered' && deviceCount != null
    ? `${deviceCount} Devices Delivered`
    : config.title

  return (
    <BannerRoot
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.standard}
      layout
    >
      <AccentBar color={accent} />
      <BannerInner>
        <IconWrap bg={accentBg}>
          <Icon size={16} color={accent} />
        </IconWrap>

        <ContentCol>
          <BannerTitle>{title}</BannerTitle>
          <BannerBody>{config.body}</BannerBody>

          {ctas.length > 0 && (
            <CtaRow>
              {ctas.includes('acknowledge') && (
                <GhostBtn
                  variant="text"
                  whileTap={{ scale: 0.95 }}
                  transition={spring.snappy}
                  onClick={onAcknowledge}
                >
                  Acknowledge
                </GhostBtn>
              )}
              {ctas.includes('setup_device') && (
                <PrimaryBtn
                  variant="text"
                  accent={accent}
                  accentbg={accentBg}
                  whileTap={{ scale: 0.95 }}
                  transition={spring.snappy}
                  onClick={onSetupDevice}
                >
                  Setup Device →
                </PrimaryBtn>
              )}
              {ctas.includes('pair_vehicles') && (
                <PrimaryBtn
                  variant="text"
                  accent={accent}
                  accentbg={accentBg}
                  whileTap={{ scale: 0.95 }}
                  transition={spring.snappy}
                  onClick={onPairVehicles}
                >
                  Pair to Vehicles →
                </PrimaryBtn>
              )}
            </CtaRow>
          )}
        </ContentCol>
      </BannerInner>
    </BannerRoot>
  )
}

export default NotificationBanner
