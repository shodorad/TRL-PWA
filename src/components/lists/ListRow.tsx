import { Box, Typography } from '@mui/material'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import IconBox from '../data/IconBox'
import { colors } from '../../styles/tokens'

type IconVariant = 'lime' | 'surface' | 'success' | 'error' | 'warning' | 'info'

interface ListRowProps {
  icon:          ReactNode
  iconVariant?:  IconVariant
  title:         string
  subtitle?:     string
  rightSlot?:    ReactNode
  onClick?:      () => void
  divider?:      boolean
  showChevron?:  boolean
}

const ListRow = ({
  icon,
  iconVariant = 'lime',
  title,
  subtitle,
  rightSlot,
  onClick,
  divider = true,
  showChevron = true,
}: ListRowProps) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      p: '12px 14px',
      cursor: onClick ? 'pointer' : 'default',
      borderBottom: divider ? `1px solid ${colors.borderFaint}` : 'none',
      borderRadius: onClick ? '10px' : 0,
      transition: 'background 0.15s ease',
      '&:hover': onClick ? { background: colors.surfaceLow } : undefined,
    }}
  >
    <IconBox icon={icon} size="sm" variant={iconVariant} />

    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 14.5,
          fontWeight: 500,
          color: colors.textPrimary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ fontSize: 12, color: colors.textDisabled, mt: '1px' }}>
          {subtitle}
        </Typography>
      )}
    </Box>

    {rightSlot ?? (showChevron && onClick
      ? <ChevronRight size={16} color={colors.textDisabled} />
      : null
    )}
  </Box>
)

export default ListRow
