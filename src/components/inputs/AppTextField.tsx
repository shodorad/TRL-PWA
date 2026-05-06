import { TextField, InputAdornment } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import type { ReactNode } from 'react'

interface AppTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  startIcon?: ReactNode
  endIcon?:   ReactNode
}

const AppTextField = ({ startIcon, endIcon, slotProps, ...props }: AppTextFieldProps) => (
  <TextField
    variant="outlined"
    fullWidth
    slotProps={{
      ...slotProps,
      input: {
        ...(slotProps?.input as object),
        startAdornment: startIcon
          ? <InputAdornment position="start">{startIcon}</InputAdornment>
          : undefined,
        endAdornment: endIcon
          ? <InputAdornment position="end">{endIcon}</InputAdornment>
          : undefined,
      },
    }}
    {...props}
  />
)

export default AppTextField
