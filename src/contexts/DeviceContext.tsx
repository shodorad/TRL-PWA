import { createContext, useContext, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

interface DeviceContextType {
  deviceScanned:    boolean
  setDeviceScanned: Dispatch<SetStateAction<boolean>>
  deviceReady:      boolean
  setDeviceReady:   Dispatch<SetStateAction<boolean>>
}

const DeviceContext = createContext<DeviceContextType | null>(null)

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [deviceScanned, setDeviceScanned] = useState(false)
  const [deviceReady,   setDeviceReady]   = useState(false)

  return (
    <DeviceContext.Provider value={{ deviceScanned, setDeviceScanned, deviceReady, setDeviceReady }}>
      {children}
    </DeviceContext.Provider>
  )
}

export const useDevice = (): DeviceContextType => {
  const ctx = useContext(DeviceContext)
  if (!ctx) throw new Error('useDevice must be used within DeviceProvider')
  return ctx
}
