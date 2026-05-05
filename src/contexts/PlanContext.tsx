import { createContext, useContext, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

export type PlanTier = 'personal' | 'business' | 'fleet'

export interface Plan {
  tier:  PlanTier
  type:  'monthly' | 'annual'
  price: number
  deviceOrdered: boolean
}

interface PlanContextType {
  plan:    Plan | null
  setPlan: Dispatch<SetStateAction<Plan | null>>
}

const PlanContext = createContext<PlanContextType | null>(null)

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<Plan | null>(null)

  return (
    <PlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = (): PlanContextType => {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}
