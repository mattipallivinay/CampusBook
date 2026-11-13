
import axios from 'axios'

const libraryApi = axios.create({
  baseURL: 'http://localhost:5000/api/resources',
  headers: {
    'Content-Type': 'application/json',
  },
})

libraryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getLibraryResources = async () => {
  const response = await libraryApi.get('/')
  return response.data
}
