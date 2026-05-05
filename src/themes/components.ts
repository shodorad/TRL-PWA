import { alpha } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'
import { PRIMARY_LIME, PRIMARY_OLIVE } from './palette'

export const componentOverrides: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: { backgroundColor: '#04050d' },
    },
  },

  MuiButton: {
    defaultProps: { disableElevation: true, variant: 'contained' },
    styleOverrides: {
      root: {
        borderRadius: 99,
        padding: '14px 24px',
        fontSize: '1rem',
        fontWeight: 600,
        '&.MuiButton-containedPrimary': {
          background: `linear-gradient(135deg, ${PRIMARY_LIME} 0%, ${PRIMARY_OLIVE} 100%)`,
          color: '#000',
          boxShadow: `0 8px 32px ${alpha(PRIMARY_LIME, 0.30)}, inset 0 1px 0 ${alpha('#fff', 0.25)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${PRIMARY_LIME} 0%, ${PRIMARY_OLIVE} 100%)`,
            boxShadow: `0 12px 40px ${alpha(PRIMARY_LIME, 0.45)}`,
          },
        },
      },
      outlined: {
        borderRadius: 18,
        borderColor: 'rgba(255,255,255,0.10)',
        '&:hover': { borderColor: 'rgba(255,255,255,0.25)' },
      },
      sizeLarge: { padding: '16px 32px', fontSize: '1.0625rem' },
      sizeSmall: { padding: '8px 16px', fontSize: '0.875rem', borderRadius: 99 },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: { height: 36, borderRadius: 99 },
      label: { padding: '0 13px' },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: { borderRadius: 13 },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        background: 'rgba(255,255,255,0.055)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255,255,255,0.10)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255,255,255,0.25)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: PRIMARY_LIME,
        },
      },
      input: { color: '#fff' },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: 'rgba(255,255,255,0.38)',
        '&.Mui-focused': { color: PRIMARY_LIME },
      },
    },
  },

  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 28,
        boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        height: 64,
      },
    },
  },

  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        color: 'rgba(255,255,255,0.38)',
        minWidth: 0,
        '&.Mui-selected': { color: PRIMARY_LIME },
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        '&:hover': { background: 'rgba(255,255,255,0.06)' },
      },
    },
  },

  MuiListSubheader: {
    styleOverrides: {
      root: {
        background: 'transparent',
        color: 'rgba(255,255,255,0.38)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: { borderColor: 'rgba(255,255,255,0.07)' },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        height: 4,
        borderRadius: 99,
        backgroundColor: 'rgba(255,255,255,0.10)',
      },
      bar: {
        borderRadius: 99,
        background: `linear-gradient(90deg, ${PRIMARY_LIME}, ${PRIMARY_OLIVE})`,
      },
    },
  },
}
