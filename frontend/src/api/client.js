import axios from 'axios'

// `??`, not `||`: an explicitly empty VITE_API_BASE_URL (same-origin deploys)
// must stay empty rather than falling back to the local dev default.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
const TOKEN_KEY = 'plantiz_token'

const client = axios.create({ baseURL: BASE_URL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function extractErrorMessage(error) {
  return (
    error.response?.data?.detail ||
    error.message ||
    'Something went wrong. Please try again.'
  )
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function signUp(email, password) {
  try {
    const { data } = await client.post('/api/auth/signup', { email, password })
    setToken(data.access_token)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function login(email, password) {
  try {
    const { data } = await client.post('/api/auth/login', { email, password })
    setToken(data.access_token)
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function getRecommendations(environment) {
  try {
    const { data } = await client.post('/api/recommend', environment)
    return data.results
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function identifyPlant(file, organ) {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('organ', organ)

  try {
    const { data } = await client.post('/api/identify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function sendChatMessage(question, context) {
  try {
    const { data } = await client.post('/api/chat', { question, context })
    return data.reply
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}
