import { AnimatePresence, motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import BackButton from '../buttons/BackButton'
import { colors, spring } from '../../styles/tokens'

interface SlidePanelProps {
  open:      boolean
  onClose:   () => void
  title?:    string
  header?:   ReactNode
  children:  ReactNode
}

const SlidePanel = ({ open, onClose, title, header, children }: SlidePanelProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={spring.bouncy}
        style={{
          position: 'absolute',
          inset: 0,
          background: colors.bg,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            p: '12px 20px 16px',
            pt: '54px',
            flexShrink: 0,
          }}
        >
          <BackButton onClick={onClose} />
          {header ?? (title && (
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: colors.textPrimary }}>
              {title}
            </Typography>
          ))}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      </motion.div>
    )}
  </AnimatePresence>
)

export default SlidePanel
