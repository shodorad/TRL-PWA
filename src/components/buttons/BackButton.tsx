import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { spring } from '../../styles/tokens'

interface BackButtonProps {
  onClick:  () => void
  size?:    number
  iconSize?: number
}

const BackButton = ({ onClick, size = 44, iconSize = 17 }: BackButtonProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileTap={{ scale: 0.88 }}
    transition={spring.snappy}
    style={{
      width: size,
      height: size,
      minWidth: size,
      borderRadius: 14,
      border: '1px solid rgba(255,255,255,0.10)',
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      outline: 'none',
      flexShrink: 0,
    }}
  >
    <ArrowLeft size={iconSize} color="rgba(255,255,255,0.80)" />
  </motion.button>
)

export default BackButton
