import axiosInstance from './axiosInstance'

export interface Trip {
  id:           string
  vehicleId:    string
  startTime:    string
  endTime:      string
  distanceMiles: number
  startAddress: string
  endAddress:   string
}

export const getTrips = async (vehicleId?: string) => {
  const params = vehicleId ? { vehicleId } : {}
  const { data } = await axiosInstance.get<Trip[]>('/trips', { params })
  return data
}

export const getTripById = async (id: string) => {
  const { data } = await axiosInstance.get<Trip>(`/trips/${id}`)
  return data
}
