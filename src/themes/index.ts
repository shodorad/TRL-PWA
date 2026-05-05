import { createTheme } from '@mui/material/styles'
import type { TypographyVariants, TypographyVariantsOptions } from '@mui/material/styles'
import { PRIMARY_LIME, PRIMARY_OLIVE, SECONDARY_GREEN, WARNING_YELLOW, BG_DARK, SURFACE_DARK } from './palette'
import { componentOverrides } from './components'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontWeightBlack: number
  }
  interface TypographyVariantsOptions {
    fontWeightBlack?: number
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: PRIMARY_LIME, dark: PRIMARY_OLIVE, contrastText: '#000' },
    secondary: { main: SECONDARY_GREEN },
    warning:   { main: WARNING_YELLOW },
    background: { default: BG_DARK, paper: SURFACE_DARK },
    text: {
      primary:   '#ffffff',
      secondary: 'rgba(255,255,255,0.70)',
      disabled:  'rgba(255,255,255,0.38)',
    },
  },

  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    fontWeightBlack: 900,
    h1: { fontWeight: 900, fontSize: '2.5rem' },
    h2: { fontWeight: 800, fontSize: '2rem' },
    h3: { fontWeight: 700, fontSize: '1.5rem' },
    h4: { fontWeight: 700, fontSize: '1.25rem' },
    body1: { lineHeight: 1.6 },
    body2: { color: 'rgba(255,255,255,0.70)' },
    button: { fontWeight: 600, textTransform: 'none' },
    caption: { color: 'rgba(255,255,255,0.38)' },
  },

  shape: { borderRadius: 16 },
  spacing: 4,

  components: componentOverrides,
})

export default theme
