import axios from 'axios'

// `??`, not `||`: an explicitly empty VITE_API_BASE_URL (same-origin deploys)
// must stay empty rather than falling back to the local dev default.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

const client = axios.create({ baseURL: BASE_URL })

function extractErrorMessage(error) {
  return (
    error.response?.data?.detail ||
    error.message ||
    'Something went wrong. Please try again.'
  )
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
