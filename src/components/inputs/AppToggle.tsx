import { motion } from 'framer-motion'
import { spring } from '../../styles/tokens'
import { colors } from '../../styles/tokens'

interface AppToggleProps {
  checked:   boolean
  onChange:  (checked: boolean) => void
  disabled?: boolean
}

const TRACK_W = 44
const TRACK_H = 26
const THUMB   = 20
const PAD     = 3

const AppToggle = ({ checked, onChange, disabled = false }: AppToggleProps) => (
  <motion.button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    style={{
      width: TRACK_W,
      height: TRACK_H,
      borderRadius: TRACK_H / 2,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: 0,
      flexShrink: 0,
      position: 'relative',
      outline: 'none',
      opacity: disabled ? 0.45 : 1,
    }}
    animate={{ background: checked ? colors.lime : 'rgba(255,255,255,0.12)' }}
    transition={{ duration: 0.18 }}
    whileTap={disabled ? undefined : { scale: 0.92 }}
  >
    <motion.div
      animate={{ x: checked ? TRACK_W - THUMB - PAD : PAD }}
      transition={spring.snappy}
      style={{
        position: 'absolute',
        top: PAD,
        width: THUMB,
        height: THUMB,
        borderRadius: '50%',
        background: checked ? '#000' : '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }}
    />
  </motion.button>
)

export default AppToggle
