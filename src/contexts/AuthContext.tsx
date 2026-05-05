import { createContext, useContext, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

export interface User {
  firstName: string
  lastName:  string
  phone:     string
  email:     string
}

interface AuthContextType {
  user:            User
  setUser:         Dispatch<SetStateAction<User>>
  token:           string | null
  setToken:        Dispatch<SetStateAction<string | null>>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEFAULT_USER: User = { firstName: '', lastName: '', phone: '', email: '' }

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]   = useState<User>(DEFAULT_USER)
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'))

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
