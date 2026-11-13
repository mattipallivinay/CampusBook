
import axios from 'axios'

const dashboardApi = axios.create({
  baseURL: 'http://localhost:5000/api/dashboard',
  headers: {
    'Content-Type': 'application/json',
  },
})

dashboardApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getStudentStats = async () => {
  const response = await dashboardApi.get('/student')
  return response.data.data
}

export const getFacultyStats = async () => {
  const response = await dashboardApi.get('/faculty')
  return response.data.data
}

export const getAdminStats = async () => {
  const response = await dashboardApi.get('/admin')
  return response.data.data
}
