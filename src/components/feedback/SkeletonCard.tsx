import { Box } from '@mui/material'

interface SkeletonCardProps {
  lines?:   number
  hasIcon?: boolean
  height?:  number
}

const shimmer = `
  @keyframes trl-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`

const shimmerStyle = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
  backgroundSize: '800px 100%',
  animation: 'trl-shimmer 1.4s infinite linear',
  borderRadius: '6px',
}

const SkeletonCard = ({ lines = 2, hasIcon = false, height }: SkeletonCardProps) => (
  <>
    <style>{shimmer}</style>
    <Box
      sx={{
        background: 'rgba(255,255,255,0.055)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        p: '16px',
        height: height ?? 'auto',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {hasIcon && (
        <Box sx={{ ...shimmerStyle, width: 40, height: 40, borderRadius: '12px', flexShrink: 0 }} />
      )}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', pt: '2px' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Box
            key={i}
            sx={{
              ...shimmerStyle,
              height: i === 0 ? '14px' : '11px',
              width: i === 0 ? '70%' : `${45 + Math.random() * 30}%`,
            }}
          />
        ))}
      </Box>
    </Box>
  </>
)

export default SkeletonCard
