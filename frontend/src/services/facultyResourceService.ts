
import axios from 'axios'

const facultyApi = axios.create({
  baseURL: 'http://localhost:5000/api',
})

facultyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getFacultyResources = async () => {
  const response = await facultyApi.get('/resources/my-resources')
  return response.data
}

export const getFacultyCourses = async () => {
  const response = await facultyApi.get('/courses')
  return response.data
}

export const uploadFacultyResource = async (formData: FormData) => {
  const response = await facultyApi.post('/resources', formData)
  return response.data
}
