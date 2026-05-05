import axiosInstance from './axiosInstance'

export interface VehiclePayload {
  vin:      string
  nickname: string
  plate:    string
  model:    string
}

export const getVehicles = async () => {
  const { data } = await axiosInstance.get('/vehicles')
  return data
}

export const addVehicle = async (payload: VehiclePayload) => {
  const { data } = await axiosInstance.post('/vehicles', payload)
  return data
}

export const deleteVehicle = async (id: string) => {
  const { data } = await axiosInstance.delete(`/vehicles/${id}`)
  return data
}
