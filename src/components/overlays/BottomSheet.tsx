import { AnimatePresence, motion } from 'framer-motion'
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { colors, spring } from '../../styles/tokens'

interface BottomSheetProps {
  open:     boolean
  onClose:  () => void
  title?:   string
  children: ReactNode
}

const BottomSheet = ({ open, onClose, title, children }: BottomSheetProps) => (
  <AnimatePresence>
    {open && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.60)',
            zIndex: 20,
          }}
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={spring.bouncy}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '85vh',
            background: colors.surface,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: `1px solid ${colors.border}`,
            borderRadius: '28px 28px 0 0',
            zIndex: 21,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Drag handle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: '12px', pb: '4px', flexShrink: 0 }}>
            <Box sx={{ width: 36, height: 4, borderRadius: '99px', background: colors.border }} />
          </Box>

          {/* Title */}
          {title && (
            <Box sx={{ px: '20px', pb: '12px', flexShrink: 0 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: colors.textPrimary }}>
                {title}
              </Typography>
            </Box>
          )}

          {/* Content */}
          <Box sx={{ overflowY: 'auto', flex: 1, pb: 'env(safe-area-inset-bottom, 16px)' }}>
            {children}
          </Box>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)

export default BottomSheet
