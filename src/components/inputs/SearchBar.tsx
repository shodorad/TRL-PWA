import { Search } from 'lucide-react'
import AppTextField from './AppTextField'
import type { TextFieldProps } from '@mui/material'

interface SearchBarProps extends Omit<TextFieldProps, 'type' | 'variant'> {
  placeholder?: string
}

const SearchBar = ({ placeholder = 'Search…', sx, ...props }: SearchBarProps) => (
  <AppTextField
    type="search"
    placeholder={placeholder}
    startIcon={<Search size={15} color="rgba(255,255,255,0.38)" />}
    sx={{
      '& .MuiOutlinedInput-root': { borderRadius: '99px' },
      ...sx,
    }}
    {...props}
  />
)

export default SearchBar
