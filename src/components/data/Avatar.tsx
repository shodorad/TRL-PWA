import { Box } from '@mui/material'
import type { BoxProps } from '@mui/material'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  name?: string
  initials?: string
  size?: AvatarSize
  sx?: BoxProps['sx']
}

const SIZE_MAP: Record<AvatarSize, { dim: number; fontSize: number }> = {
  sm: { dim: 40, fontSize: 16 },
  md: { dim: 52, fontSize: 20 },
  lg: { dim: 72, fontSize: 28 },
}

export const Avatar = ({ name, initials, size = 'md', sx }: AvatarProps) => {
  const { dim, fontSize } = SIZE_MAP[size]
  const letters = (initials ?? name?.[0] ?? 'U').toUpperCase().slice(0, 2)

  return (
    <Box
      sx={{
        width: dim,
        height: dim,
        minWidth: dim,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #C8FF00, #8FB800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 900,
        color: '#000',
        flexShrink: 0,
        ...sx,
      }}
    >
      {letters}
    </Box>
  )
}
