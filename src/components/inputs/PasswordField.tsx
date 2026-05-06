import { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import AppTextField from './AppTextField'
import type { TextFieldProps } from '@mui/material'

const STRENGTH_COLORS = ['#E8656A', '#facc15', '#facc15', '#C8FF00', '#4ade80']
const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']

interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'variant'> {
  strengthScore?: number // 0–4
}

const PasswordField = ({ strengthScore, ...props }: PasswordFieldProps) => {
  const [show, setShow] = useState(false)

  const toggle = (
    <IconButton
      size="small"
      onClick={() => setShow(v => !v)}
      sx={{ color: 'rgba(255,255,255,0.38)', p: '4px' }}
      edge="end"
    >
      {show
        ? <EyeOff size={16} />
        : <Eye size={16} />
      }
    </IconButton>
  )

  return (
    <Box sx={{ width: '100%' }}>
      <AppTextField
        type={show ? 'text' : 'password'}
        endIcon={toggle}
        {...props}
      />

      {strengthScore !== undefined && (
        <Box sx={{ mt: '8px' }}>
          <Box sx={{ display: 'flex', gap: '4px', mb: '4px' }}>
            {STRENGTH_COLORS.map((color, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '99px',
                  background: i <= strengthScore ? color : 'rgba(255,255,255,0.10)',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </Box>
          <Box sx={{ fontSize: '11px', color: STRENGTH_COLORS[strengthScore], fontWeight: 600 }}>
            {STRENGTH_LABELS[strengthScore]}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default PasswordField
