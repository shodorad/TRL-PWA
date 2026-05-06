import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Box } from '@mui/material'
import { MapPin, Shield, Zap, Check } from 'lucide-react'
import Car3D from '@/components/common/Car3D'
import { GlassCard } from '@/components/common/GlassCard'
import {
  WelcomeRoot, LeftPanel, RightPanel, CarouselWrapper, HeroRoot, HeroTitle, HeroSubtitle,
  VehicleCountRow, VehicleIconBox, VehicleCountLabel,
  FeaturesRoot, FeaturesHeadingBox, SlideHeading, SlideCaption,
  FeatureIconBox, FeatureTitle, FeatureDesc,
  PricingRoot, PricingHeadingBox, ToggleTrack, ToggleThumb, ToggleButton, SaveBadge,
  PricingGlowBox, PriceAmountText, PricePerMonthText, PricingDivider,
  PlanFeaturesList, PlanFeatureRow, CheckIconBox, PlanFeatureLabel,
  DotsRow, DotButton, CtaSection, GetStartedButton, ExploreButton, SignInButton, SignInHighlight,
} from './WelcomeStyled'

const featureItems = [
  { icon: MapPin, title: 'Real-time tracking',  desc: 'Know exactly where your vehicle is, always.' },
  { icon: Shield, title: 'Instant alerts',       desc: 'Speed, geofence & trip notifications instantly.' },
  { icon: Zap,    title: 'Plug in and go',       desc: 'OBD device setup in under 2 minutes.' },
]

const planFeatures = ['Real-time GPS tracking', 'Unlimited trip history', 'Geofence zones', 'Multi-vehicle dashboard']

const TOTAL_SLIDES    = 3
const AUTO_ADVANCE_MS = 4500

const slideVariants = {
  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
}
const slideSpring = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } } }
const fadeUp  = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 360, damping: 28 } } }

const HeroSlide = () => (
  <HeroRoot>
    <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 28 }}>
      <HeroTitle>Track<Box component="span" sx={{ color: 'primary.main' }}>Lynk</Box></HeroTitle>
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
      <HeroSubtitle variant="caption">Know where your vehicle is — always.</HeroSubtitle>
    </motion.div>
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, type: 'spring', stiffness: 240, damping: 26 }} className="car-float" style={{ position: 'relative', width: '100%' }}>
      <Car3D width={360} />
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
      <VehicleCountRow>
        {[0, 1, 2].map(i => (
          <VehicleIconBox key={i}>
            <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
              <path d="M11.5 5.3L10.6 3H3.4L2.5 5.3H11.5Z" fill="#C8FF00" opacity="0.9"/>
              <rect x="1" y="5.3" width="12" height="3" rx="1" fill="#C8FF00" opacity="0.7"/>
              <circle cx="3.5" cy="9" r="1.2" fill="#C8FF00"/>
              <circle cx="10.5" cy="9" r="1.2" fill="#C8FF00"/>
            </svg>
          </VehicleIconBox>
        ))}
        <VehicleCountLabel variant="caption">10,000+ vehicles protected</VehicleCountLabel>
      </VehicleCountRow>
    </motion.div>
  </HeroRoot>
)

const FeaturesSlide = () => (
  <FeaturesRoot>
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <FeaturesHeadingBox>
        <SlideHeading>Everything you need</SlideHeading>
        <SlideCaption variant="caption">One device. Full vehicle intelligence.</SlideCaption>
      </FeaturesHeadingBox>
    </motion.div>
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {featureItems.map(({ icon: Icon, title, desc }) => (
        <motion.div key={title} variants={fadeUp}>
          <GlassCard sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '14px 16px', borderRadius: '18px' }}>
            <FeatureIconBox><Icon size={19} color="#C8FF00" /></FeatureIconBox>
            <Box>
              <FeatureTitle>{title}</FeatureTitle>
              <FeatureDesc variant="caption">{desc}</FeatureDesc>
            </Box>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  </FeaturesRoot>
)

const PricingSlide = () => {
  const [annual, setAnnual] = useState(false)
  const price = annual ? 7.99 : 9.65
  return (
    <PricingRoot>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <PricingHeadingBox>
          <SlideHeading>Simple pricing</SlideHeading>
          <SlideCaption variant="caption">No contracts. Cancel any time.</SlideCaption>
        </PricingHeadingBox>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <ToggleTrack>
          <ToggleThumb animate={{ x: annual ? '100%' : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          {['Monthly', 'Annual'].map((label, i) => (
            <ToggleButton key={label} onClick={() => setAnnual(i === 1)} style={{ color: (i === 1) === annual ? '#C8FF00' : 'rgba(255,255,255,0.4)' }}>
              {label}{i === 1 && <SaveBadge>SAVE $21</SaveBadge>}
            </ToggleButton>
          ))}
        </ToggleTrack>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <GlassCard sx={{ position: 'relative', overflow: 'hidden', p: '20px' }}>
          <PricingGlowBox />
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '5px', mb: '14px' }}>
            <motion.span key={price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'contents' }}>
              <PriceAmountText>${price.toFixed(2)}</PriceAmountText>
            </motion.span>
            <PricePerMonthText variant="caption">/mo{annual && ', billed yearly'}</PricePerMonthText>
          </Box>
          <PricingDivider />
          <PlanFeaturesList>
            {planFeatures.map(f => (
              <PlanFeatureRow key={f}>
                <CheckIconBox><Check size={11} color="#C8FF00" /></CheckIconBox>
                <PlanFeatureLabel variant="body2">{f}</PlanFeatureLabel>
              </PlanFeatureRow>
            ))}
          </PlanFeaturesList>
        </GlassCard>
      </motion.div>
    </PricingRoot>
  )
}

const Welcome = () => {
  const navigate  = useNavigate()
  const { setToken } = useAuth()
  const [slide, setSlide] = useState(0)
  const [dir, setDir]     = useState(1)
  const timerRef          = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setDir(1)
      setSlide(s => (s + 1) % TOTAL_SLIDES)
    }, AUTO_ADVANCE_MS)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  const goToSlide = (i: number) => {
    if (i === slide) return
    setDir(i > slide ? 1 : -1)
    setSlide(i)
    startTimer()
  }

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -60 && slide < TOTAL_SLIDES - 1) { setDir(1); setSlide(s => s + 1); startTimer() }
    else if (info.offset.x > 60 && slide > 0)            { setDir(-1); setSlide(s => s - 1); startTimer() }
  }

  return (
    <WelcomeRoot>
      <LeftPanel>
        <CarouselWrapper onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current) }} onMouseLeave={startTimer}>
          <AnimatePresence custom={dir} mode="wait" initial={false}>
            <motion.div key={slide} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideSpring} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12} onDragEnd={handleDragEnd} style={{ position: 'absolute', inset: 0 }}>
              {slide === 0 && <HeroSlide />}
              {slide === 1 && <FeaturesSlide />}
              {slide === 2 && <PricingSlide />}
            </motion.div>
          </AnimatePresence>
        </CarouselWrapper>

        <DotsRow>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <DotButton key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => goToSlide(i)}>
              <motion.div animate={{ width: i === slide ? 24 : 6, background: i === slide ? '#C8FF00' : 'rgba(255,255,255,0.20)' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ height: 6, borderRadius: 99 }} />
            </DotButton>
          ))}
        </DotsRow>
      </LeftPanel>

      <RightPanel>
        <CtaSection>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GetStartedButton fullWidth variant="contained" whileTap={{ scale: 0.97 }} onClick={() => navigate('/auth/sign-up')}>
              Get Started →
            </GetStartedButton>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
            <ExploreButton fullWidth variant="outlined" whileTap={{ scale: 0.97 }} onClick={() => {
              localStorage.setItem('accessToken', 'demo-token')
              setToken('demo-token')
              navigate('/')
            }}>
              Explore the app (skip onboarding) →
            </ExploreButton>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
            <SignInButton fullWidth variant="text" whileTap={{ scale: 0.97 }} onClick={() => navigate('/auth/sign-in')}>
              Already have an account? <SignInHighlight component="span">Sign In</SignInHighlight>
            </SignInButton>
          </motion.div>
        </CtaSection>
      </RightPanel>
    </WelcomeRoot>
  )
}

export default Welcome
