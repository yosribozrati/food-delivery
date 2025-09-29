import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({ baseURL: BASE_URL, withCredentials: false })

export async function fetchRestaurants() {
  const { data } = await api.get('/api/restaurants')
  return data
}

export async function fetchRestaurant(id) {
  const { data } = await api.get(`/api/restaurants/${id}`)
  return data
}

export async function fetchMenuByRestaurant(id) {
  const { data } = await api.get(`/api/menus/restaurant/${id}`)
  return data
}

export async function createOrder(payload) {
  const { data } = await api.post('/api/orders', payload)
  return data
}

export async function createPaymentIntent(orderId) {
  const { data } = await api.post('/api/payments/intent', { orderId })
  return data
}

export async function createRestaurant(restaurant) {
  const { data } = await api.post('/api/restaurants', restaurant)
  return data
}

export async function createMenuItem(item) {
  const { data } = await api.post('/api/menus', item)
  return data
}

export async function deleteRestaurant(id) {
  const { data } = await api.delete(`/api/restaurants/${id}`)
  return data
}

export async function deleteMenuItem(id) {
  const { data } = await api.delete(`/api/menus/${id}`)
  return data
}


