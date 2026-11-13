import axios from 'axios'

const API_URL = 'http://localhost:5000/api/marketplace'

const marketplaceApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

marketplaceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getAllListings = async () => {
  const response = await marketplaceApi.get('/')
  return response.data
}

export const createListing = async (listing: {
  title: string
  author: string
  description?: string
  price: number
  condition: string
  imageUrl?: string
}) => {
  const response = await marketplaceApi.post('/', listing)
  return response.data
}

export const getMyListings = async () => {
  const response = await marketplaceApi.get('/my-listings')
  return response.data
}

export const updateListingStatus = async (
  id: string,
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD'
) => {
  const response = await marketplaceApi.patch(`/${id}/status`, { status })
  return response.data
}