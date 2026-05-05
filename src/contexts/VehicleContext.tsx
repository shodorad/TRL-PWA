import { createContext, useContext, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

export interface Vehicle {
  vin:      string
  nickname: string
  plate:    string
  model:    string
}

interface VehicleContextType {
  vehicle:    Vehicle
  setVehicle: Dispatch<SetStateAction<Vehicle>>
}

const VehicleContext = createContext<VehicleContextType | null>(null)

const DEFAULT_VEHICLE: Vehicle = { vin: '', nickname: '', plate: '', model: '' }

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
  const [vehicle, setVehicle] = useState<Vehicle>(DEFAULT_VEHICLE)

  return (
    <VehicleContext.Provider value={{ vehicle, setVehicle }}>
      {children}
    </VehicleContext.Provider>
  )
}

export const useVehicle = (): VehicleContextType => {
  const ctx = useContext(VehicleContext)
  if (!ctx) throw new Error('useVehicle must be used within VehicleProvider')
  return ctx
}
