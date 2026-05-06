// ─── Design Tokens — TRL-PWA ────────────────────────────────────────────────
// Single source of truth for all design values.
// Philosophy: Dark Glassmorphism — deep space backgrounds, neon-lime accent,
// frosted-glass surfaces, spring-physics motion.
// Dark-only app; no light mode variants needed.

// ── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  bg:          '#04050d',
  surface:     '#0d0d14',
  surfaceHigh: 'rgba(255,255,255,0.055)',
  surfaceMid:  'rgba(255,255,255,0.07)',
  surfaceLow:  'rgba(255,255,255,0.04)',

  // Borders
  border:      'rgba(255,255,255,0.10)',
  borderFaint: 'rgba(255,255,255,0.06)',
  borderBright:'rgba(255,255,255,0.25)',

  // Accent — Lime
  lime:        '#C8FF00',
  limeDark:    '#8FB800',
  limeGlow:    'rgba(200,255,0,0.30)',
  limeSubtle:  'rgba(200,255,0,0.10)',
  limeBorder:  'rgba(200,255,0,0.18)',

  // Semantic
  success:        '#4ade80',
  successSubtle:  'rgba(74,222,128,0.15)',
  successBorder:  'rgba(74,222,128,0.30)',

  warning:        '#facc15',
  warningSubtle:  'rgba(250,204,21,0.15)',
  warningBorder:  'rgba(250,204,21,0.30)',

  error:          '#E8656A',
  errorSubtle:    'rgba(232,101,106,0.10)',
  errorBorder:    'rgba(232,101,106,0.25)',

  info:           '#60a5fa',
  infoSubtle:     'rgba(96,165,250,0.15)',
  infoBorder:     'rgba(96,165,250,0.30)',

  // Text
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.70)',
  textDisabled:  'rgba(255,255,255,0.38)',
  textFaint:     'rgba(255,255,255,0.28)',
  textInverse:   '#000000',
} as const

// ── Spacing (4px base) ───────────────────────────────────────────────────────

export const spacing = {
  sp0:  0,
  sp1:  4,
  sp2:  8,
  sp3:  12,
  sp4:  16,
  sp5:  20,
  sp6:  24,
  sp7:  28,
  sp8:  32,
  sp9:  40,
  sp10: 48,
  sp11: 64,
  sp12: 80,
} as const

// ── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  rXs:   6,
  rSm:   10,
  rMd:   14,
  rLg:   18,
  rXl:   22,
  r2xl:  28,
  rFull: 9999,
} as const

// ── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  fontFamilyMono: '"JetBrains Mono", "Fira Code", monospace',

  // Font sizes (px)
  textXs:   10,
  textSm:   11,
  textBase: 13,
  textMd:   14,
  textLg:   16,
  textXl:   18,
  text2xl:  22,
  text3xl:  28,
  text4xl:  36,

  // Font weights
  weightNormal:   400,
  weightMedium:   500,
  weightSemibold: 600,
  weightBold:     700,
  weightExtraBold:800,
  weightBlack:    900,

  // Line heights
  lineHeightTight:   1.2,
  lineHeightNormal:  1.5,
  lineHeightRelaxed: 1.7,

  // Letter spacing
  trackingTight:  '-0.3px',
  trackingNormal: '0px',
  trackingWide:   '0.4px',
  trackingWidest: '0.8px',
} as const

// ── Glass / Backdrop ─────────────────────────────────────────────────────────

export const glass = {
  // Full glass card
  bg:             'rgba(255,255,255,0.055)',
  blur:           'blur(20px) saturate(160%)',
  border:         '1px solid rgba(255,255,255,0.10)',
  shadow:         '0 8px 32px rgba(0,0,0,0.55)',
  borderRadius:   20,

  // Smaller/lighter glass (panels, buttons)
  bgSm:           'rgba(255,255,255,0.045)',
  blurSm:         'blur(12px) saturate(140%)',
  borderSm:       '1px solid rgba(255,255,255,0.08)',
  shadowSm:       '0 4px 16px rgba(0,0,0,0.40)',
  borderRadiusSm: 14,
} as const

// ── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  sm:    '0 2px 8px rgba(0,0,0,0.40)',
  md:    '0 4px 16px rgba(0,0,0,0.50)',
  lg:    '0 8px 32px rgba(0,0,0,0.55)',
  xl:    '0 16px 48px rgba(0,0,0,0.65)',
  lime:  '0 0 16px rgba(200,255,0,0.45)',
  limeSm:'0 0 8px rgba(200,255,0,0.35)',
  focus: '0 0 0 3px rgba(200,255,0,0.35)',
} as const

// ── Motion / Spring Presets ───────────────────────────────────────────────────

export const spring = {
  standard: { type: 'spring' as const, stiffness: 320, damping: 28 },
  snappy:   { type: 'spring' as const, stiffness: 400, damping: 30 },
  bouncy:   { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.8 },
  gentle:   { type: 'spring' as const, stiffness: 200, damping: 24 },
  stiff:    { type: 'spring' as const, stiffness: 500, damping: 35 },
} as const

export const duration = {
  instant: 50,
  fast:    150,
  normal:  250,
  slow:    400,
  slower:  600,
} as const

export const easing = {
  default: [0.4, 0, 0.2, 1] as const,
  in:      [0.4, 0, 1, 1]   as const,
  out:     [0, 0, 0.2, 1]   as const,
  bounce:  [0.34, 1.56, 0.64, 1] as const,
} as const

// ── Breakpoints ───────────────────────────────────────────────────────────────

export const breakpoints = {
  sm:  375,
  md:  600,
  lg:  960,
  xl:  1280,
} as const

// ── Convenience re-export ─────────────────────────────────────────────────────

const tokens = { colors, spacing, radius, typography, glass, shadows, spring, duration, easing, breakpoints }
export default tokens
