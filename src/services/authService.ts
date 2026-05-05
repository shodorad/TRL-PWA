import axiosInstance from './axiosInstance'

export const login = async (email: string, password: string) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password })
  return data
}

export const register = async (email: string, password: string, name: string) => {
  const { data } = await axiosInstance.post('/auth/register', { email, password, name })
  return data
}

export const logout = async () => {
  const { data } = await axiosInstance.post('/auth/logout')
  return data
}

export const registerPushToken = async (token: string) => {
  const { data } = await axiosInstance.post('/auth/push-token', { token })
  return data
}
