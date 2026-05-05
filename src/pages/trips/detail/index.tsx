import { useCallback, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api'
import { ArrowLeft, CheckCircle, AlertTriangle, Zap, Gauge } from 'lucide-react'
import { glassCard } from '@/styles/glass'

// ─── Dark map styles (shared with Home) ───────────────────────────────────────

const DARK_MAP_STYLES = [
  { elementType: 'geometry',           stylers: [{ color: '#0d0d14' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d0d14' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi',            stylers: [{ visibility: 'off' }] },
  { featureType: 'road',    elementType: 'geometry',       stylers: [{ color: '#1a1a24' }] },
  { featureType: 'road',    elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry',  stylers: [{ color: '#242430' }] },
  { featureType: 'road.local',   elementType: 'labels',    stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water',  elementType: 'geometry',        stylers: [{ color: '#060d14' }] },
]

// ─── Score config ──────────────────────────────────────────────────────────────

const SCORE_CONFIG = {
  A: { color: '#C8FF00', label: 'Excellent', numeric: 92 },
  B: { color: '#F59E0B', label: 'Good',      numeric: 76 },
  C: { color: '#E74C3C', label: 'Fair',      numeric: 60 },
  D: { color: '#E74C3C', label: 'Poor',      numeric: 42 },
} as const

type ScoreGrade = keyof typeof SCORE_CONFIG

// ─── Event config ──────────────────────────────────────────────────────────────

const EVENT_CONFIG = {
  brake: { label: 'Hard Braking',  Icon: AlertTriangle, color: '#E74C3C' },
  accel: { label: 'Rapid Accel',   Icon: Zap,           color: '#F59E0B' },
  speed: { label: 'Speed Alert',   Icon: Gauge,         color: '#F59E0B' },
} as const

type EventType = keyof typeof EVENT_CONFIG

interface TripEvent { type: EventType; location: string; time: string }

// ─── Mock data ─────────────────────────────────────────────────────────────────

interface TripDetail {
  id: number; name: string; date: string; start: string; end: string
  startAddr: string; endAddr: string; distance: string; duration: string
  avgSpeed: number; maxSpeed: number; score: ScoreGrade
  route: { lat: number; lng: number }[]
  events: TripEvent[]
}

const TRIP_DETAILS: Record<number, TripDetail> = {
  1: {
    id: 1, name: 'Morning Commute', date: 'Today', start: '8:14 AM', end: '8:42 AM',
    startAddr: '412 W 35th St, New York', endAddr: '1865 Broadway, New York',
    distance: '4.2 mi', duration: '28 min', avgSpeed: 22, maxSpeed: 42, score: 'A',
    route: [
      { lat: 40.7484, lng: -73.9967 }, { lat: 40.7495, lng: -73.9912 },
      { lat: 40.7520, lng: -73.9870 }, { lat: 40.7549, lng: -73.9842 },
      { lat: 40.7580, lng: -73.9818 }, { lat: 40.7614, lng: -73.9832 },
    ],
    events: [],
  },
  2: {
    id: 2, name: 'Lunch Run', date: 'Today', start: '12:05 PM', end: '12:18 PM',
    startAddr: 'Times Square, New York', endAddr: 'Grand Central Terminal, NY',
    distance: '1.8 mi', duration: '13 min', avgSpeed: 18, maxSpeed: 35, score: 'A',
    route: [
      { lat: 40.7580, lng: -73.9855 }, { lat: 40.7570, lng: -73.9830 },
      { lat: 40.7555, lng: -73.9800 }, { lat: 40.7527, lng: -73.9772 },
    ],
    events: [],
  },
  3: {
    id: 3, name: 'Evening Commute', date: 'Yesterday', start: '5:30 PM', end: '6:08 PM',
    startAddr: '350 5th Ave, New York', endAddr: 'Brooklyn Bridge, New York',
    distance: '5.1 mi', duration: '38 min', avgSpeed: 24, maxSpeed: 58, score: 'B',
    route: [
      { lat: 40.7484, lng: -73.9967 }, { lat: 40.7460, lng: -73.9920 },
      { lat: 40.7420, lng: -73.9880 }, { lat: 40.7380, lng: -73.9820 },
      { lat: 40.7320, lng: -73.9760 }, { lat: 40.7061, lng: -73.9969 },
    ],
    events: [
      { type: 'brake', location: 'Park Ave & 34th St', time: '5:44 PM' },
    ],
  },
  4: {
    id: 4, name: 'Grocery Run', date: 'Yesterday', start: '10:20 AM', end: '10:35 AM',
    startAddr: '180 9th Ave, New York', endAddr: '250 7th Ave, New York',
    distance: '2.3 mi', duration: '15 min', avgSpeed: 20, maxSpeed: 38, score: 'A',
    route: [
      { lat: 40.7448, lng: -74.0021 }, { lat: 40.7440, lng: -73.9995 },
      { lat: 40.7430, lng: -73.9972 }, { lat: 40.7418, lng: -73.9950 },
    ],
    events: [],
  },
  5: {
    id: 5, name: 'Morning Commute', date: 'Apr 15', start: '8:22 AM', end: '8:49 AM',
    startAddr: 'W 72nd St & Broadway, NY', endAddr: 'Rockefeller Center, NY',
    distance: '4.0 mi', duration: '27 min', avgSpeed: 21, maxSpeed: 40, score: 'A',
    route: [
      { lat: 40.7780, lng: -73.9815 }, { lat: 40.7730, lng: -73.9810 },
      { lat: 40.7680, lng: -73.9820 }, { lat: 40.7614, lng: -73.9832 },
      { lat: 40.7580, lng: -73.9830 },
    ],
    events: [],
  },
  6: {
    id: 6, name: 'Evening Commute', date: 'Apr 15', start: '5:45 PM', end: '6:22 PM',
    startAddr: 'Grand Central, New York', endAddr: 'LaGuardia Airport, NY',
    distance: '5.3 mi', duration: '37 min', avgSpeed: 28, maxSpeed: 65, score: 'C',
    route: [
      { lat: 40.7527, lng: -73.9772 }, { lat: 40.7570, lng: -73.9650 },
      { lat: 40.7620, lng: -73.9540 }, { lat: 40.7700, lng: -73.9420 },
      { lat: 40.7769, lng: -73.8740 },
    ],
    events: [
      { type: 'speed', location: 'Queens Midtown Tunnel', time: '5:58 PM' },
      { type: 'brake', location: 'Grand Central Pkwy',    time: '6:10 PM' },
    ],
  },
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Root        = styled(Box)({ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: 'transparent', paddingBottom: 82 })
const Header      = styled(Box)({ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px', flexShrink: 0 })
const BackBtn     = styled(IconButton)({ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.07)', flexShrink: 0 })
const HeaderInfo  = styled(Box)({ flex: 1, minWidth: 0 })
const TripTitle   = styled(Typography)({ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
const TripSubline = styled(Typography)({ fontSize: 12, color: 'rgba(255,255,255,0.40)', marginTop: '1px' })
const ScoreBadge  = styled(Box)<{ gradecolor: string }>(({ gradecolor }) => ({
  width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: `${gradecolor}18`, border: `1px solid ${gradecolor}35`, flexShrink: 0,
}))

const MapSection  = styled(Box)({ position: 'relative', height: 220, flexShrink: 0, margin: '0 16px', overflow: 'hidden', ...glassCard, borderRadius: 16 })
const MapFade     = styled('div')({ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, #04050d, transparent)', pointerEvents: 'none', zIndex: 2 })
const MapLoading  = styled(Box)({ width: '100%', height: '100%', backgroundColor: '#0d0d14' })

const StatsRow    = styled(Box)({ display: 'flex', margin: '12px 16px 0', ...glassCard, borderRadius: 14, padding: '14px 0', flexShrink: 0 })
const StatCell    = styled(Box)({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 })
const StatDivider = styled(Box)({ width: 1, backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'stretch' })
const StatValue   = styled(Typography)({ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1 })
const StatLabel   = styled(Typography)({ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 1 })

const Body        = styled(Box)({ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 })
const SectionLabel = styled(Typography)({ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 })

const ScoreCard   = styled(Box)({ ...glassCard, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 20 })
const GaugeWrap   = styled(Box)({ position: 'relative', width: 96, height: 96, flexShrink: 0 })
const GaugeCenterText = styled(Box)({ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' })
const GaugeGrade  = styled(Typography)({ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1 })
const GaugeLabel  = styled(Typography)({ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.4px' })
const ScoreDetail = styled(Box)({ flex: 1 })
const ScoreTitle  = styled(Typography)({ fontSize: 15, fontWeight: 700, marginBottom: 2 })
const ScoreDesc   = styled(Typography)({ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 })

const EventCard   = styled(Box)({ ...glassCard, borderRadius: 14, padding: '14px 16px' })
const EventRow    = styled(Box)({ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, paddingBottom: 10 })
const EventIconBox = styled(Box)<{ iconcolor: string }>(({ iconcolor }) => ({
  width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: `${iconcolor}18`, border: `1px solid ${iconcolor}30`, flexShrink: 0,
}))
const EventInfo   = styled(Box)({ flex: 1, minWidth: 0 })
const EventName   = styled(Typography)({ fontSize: 13, fontWeight: 600 })
const EventLoc    = styled(Typography)({ fontSize: 11.5, color: 'rgba(255,255,255,0.40)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
const EventTime   = styled(Typography)({ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', flexShrink: 0 })
const EventDivider = styled(Box)({ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '0' })
const CleanDrive  = styled(Box)({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 0 8px' })
const CleanText   = styled(Typography)({ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.60)' })

// ─── Route map sub-component ───────────────────────────────────────────────────

const RouteMap = ({ route, score }: { route: { lat: number; lng: number }[]; score: ScoreGrade }) => {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' })
  const onLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; setMapReady(true) }, [])

  const center = route[Math.floor(route.length / 2)]
  const strokeColor = SCORE_CONFIG[score].color

  const startIcon = mapReady ? { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#C8FF00', fillOpacity: 1, strokeColor: '#000', strokeWeight: 2 } : null
  const endIcon   = mapReady ? { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#ffffff', fillOpacity: 1, strokeColor: '#000', strokeWeight: 2 } : null

  if (loadError) return <MapLoading />
  if (!isLoaded) return <MapLoading />

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={13}
      onLoad={onLoad}
      options={{ styles: DARK_MAP_STYLES, disableDefaultUI: true, gestureHandling: 'none', clickableIcons: false, zoomControl: false }}
    >
      {mapReady && <Polyline path={route} options={{ strokeColor, strokeOpacity: 0.9, strokeWeight: 4 }} />}
      {startIcon && <Marker position={route[0]} icon={startIcon} />}
      {endIcon   && <Marker position={route[route.length - 1]} icon={endIcon} />}
    </GoogleMap>
  )
}

// ─── Score gauge ───────────────────────────────────────────────────────────────

const ScoreGauge = ({ grade }: { grade: ScoreGrade }) => {
  const cfg  = SCORE_CONFIG[grade]
  const r    = 42
  const circ = 2 * Math.PI * r
  const fill = (cfg.numeric / 100) * circ

  return (
    <GaugeWrap>
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <motion.circle
          cx="48" cy="48" r={r} fill="none"
          stroke={cfg.color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${fill} ${circ}` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.0, 0.0, 0.2, 1] }}
        />
      </svg>
      <GaugeCenterText>
        <GaugeGrade sx={{ color: cfg.color }}>{grade}</GaugeGrade>
        <GaugeLabel>Score</GaugeLabel>
      </GaugeCenterText>
    </GaugeWrap>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

const TripDetail = () => {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const trip     = TRIP_DETAILS[Number(id)]

  if (!trip) {
    return (
      <Root style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.40)', fontSize: 14 }}>Trip not found</Typography>
      </Root>
    )
  }

  const scoreConfig = SCORE_CONFIG[trip.score]

  const stagger = (i: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 + i * 0.06, type: 'spring', stiffness: 320, damping: 28 } })

  return (
    <Root>
      {/* Header */}
      <Header>
        <BackBtn onClick={() => navigate('/trips')} size="small">
          <ArrowLeft size={17} color="rgba(255,255,255,0.80)" />
        </BackBtn>
        <HeaderInfo>
          <TripTitle color="text.primary">{trip.name}</TripTitle>
          <TripSubline>{trip.date} · {trip.start} — {trip.end}</TripSubline>
        </HeaderInfo>
        <ScoreBadge gradecolor={scoreConfig.color}>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: scoreConfig.color }}>{trip.score}</Typography>
        </ScoreBadge>
      </Header>

      {/* Map */}
      <motion.div {...stagger(0)}>
        <MapSection>
          <RouteMap route={trip.route} score={trip.score} />
          <MapFade />
        </MapSection>
      </motion.div>

      {/* Stats row */}
      <motion.div {...stagger(1)}>
        <StatsRow>
          <StatCell>
            <StatValue color="text.primary">{trip.distance.replace(' mi', '')}</StatValue>
            <StatLabel>Miles</StatLabel>
          </StatCell>
          <StatDivider />
          <StatCell>
            <StatValue color="text.primary">{trip.duration.replace(' min', '')}</StatValue>
            <StatLabel>Minutes</StatLabel>
          </StatCell>
          <StatDivider />
          <StatCell>
            <StatValue color="text.primary">{trip.avgSpeed}</StatValue>
            <StatLabel>Avg MPH</StatLabel>
          </StatCell>
          <StatDivider />
          <StatCell>
            <StatValue color="text.primary">{trip.maxSpeed}</StatValue>
            <StatLabel>Max MPH</StatLabel>
          </StatCell>
        </StatsRow>
      </motion.div>

      <Body>
        {/* Score section */}
        <motion.div {...stagger(2)}>
          <SectionLabel>Driving Score</SectionLabel>
          <ScoreCard>
            <ScoreGauge grade={trip.score} />
            <ScoreDetail>
              <ScoreTitle color="text.primary">{scoreConfig.label}</ScoreTitle>
              <ScoreDesc>
                {trip.events.length === 0
                  ? 'No driving events detected. Clean trip.'
                  : `${trip.events.length} event${trip.events.length > 1 ? 's' : ''} detected on this trip.`}
              </ScoreDesc>
            </ScoreDetail>
          </ScoreCard>
        </motion.div>

        {/* Events section */}
        <motion.div {...stagger(3)}>
          <SectionLabel>Driving Events</SectionLabel>
          <EventCard>
            {trip.events.length === 0 ? (
              <CleanDrive>
                <CheckCircle size={28} color="#2ECC71" />
                <CleanText>Clean drive — no events</CleanText>
              </CleanDrive>
            ) : (
              trip.events.map((event, i) => {
                const cfg = EVENT_CONFIG[event.type]
                return (
                  <Box key={i}>
                    {i > 0 && <EventDivider />}
                    <EventRow>
                      <EventIconBox iconcolor={cfg.color}>
                        <cfg.Icon size={16} color={cfg.color} />
                      </EventIconBox>
                      <EventInfo>
                        <EventName color="text.primary">{cfg.label}</EventName>
                        <EventLoc>{event.location}</EventLoc>
                      </EventInfo>
                      <EventTime>{event.time}</EventTime>
                    </EventRow>
                  </Box>
                )
              })
            )}
          </EventCard>
        </motion.div>
      </Body>
    </Root>
  )
}

export default TripDetail
