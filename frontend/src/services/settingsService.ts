
import axios from 'axios'
export interface UserProfile {
    id: string
    name: string
    email: string
    role: 'STUDENT' | 'FACULTY' | 'ADMIN'
    createdAt: string
    updatedAt: string
  }

const settingsApi = axios.create({
  baseURL: 'http://localhost:5000/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
})

settingsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getMyProfile = async () => {
  const response = await settingsApi.get('/me')
  return response.data
}
export const getCurrentUser = async (): Promise<UserProfile> => {
    const response = await settingsApi.get('/me')
    return response.data.data
  }