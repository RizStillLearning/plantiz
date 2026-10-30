import { clearSession, getToken } from './session.js'

// Empty means same origin: Vite proxies /api in dev, Vercel routes it in production.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

function messageFrom(body, status) {
  const detail = body?.detail
  if (typeof detail === 'string') return detail
  // FastAPI validation errors come as a list.
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg.replace(/^Value error, /, '')
  return status >= 500
    ? 'Something went wrong on our side. Please try again in a moment.'
    : 'Something went wrong. Please check your details and try again.'
}

async function request(path, { json, form } = {}) {
  const token = getToken()
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (json) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: json ? JSON.stringify(json) : form,
    })
  } catch {
    throw new ApiError('Could not reach Plantiz. Check your connection and try again.', 0)
  }

  const body = await response.json().catch(() => null)

  // The session expired: log in again, then come back here.
  if (response.status === 401 && token) {
    clearSession()
    const here = window.location.pathname + window.location.search
    window.location.assign(`/login?next=${encodeURIComponent(here)}`)
  }

  if (!response.ok) throw new ApiError(messageFrom(body, response.status), response.status)
  return body
}

// Same shape as the plants in src/data/plants.js.
export function toPlant(plant) {
  return {
    id: plant.id,
    commonName: plant.common_name,
    botanicalName: plant.botanical_name,
    category: plant.category,
    settings: plant.settings,
    light: plant.light,
    water: plant.water,
    careLevel: plant.care_level,
    lifecycle: plant.lifecycle,
    zoneMin: plant.zone_min,
    zoneMax: plant.zone_max,
    heightFtMin: plant.height_ft_min,
    heightFtMax: plant.height_ft_max,
  }
}

export const logIn = (email, password) => request('/api/auth/login', { json: { email, password } })

export const signUp = ({ name, email, password }) =>
  request('/api/auth/signup', { json: { name, email, password } })

export async function recommendPlants(answers) {
  const { results } = await request('/api/recommend', { json: answers })
  return results.map(({ plant, confidence }) => ({ plant: toPlant(plant), confidence }))
}

export async function identifyPlant(file, organ) {
  const form = new FormData()
  form.append('image', file)
  form.append('organ', organ)
  const { candidates } = await request('/api/identify', { form })
  return candidates.map((candidate) => ({
    scientificName: candidate.scientific_name,
    commonNames: candidate.common_names,
    family: candidate.family,
    confidence: candidate.confidence,
    plant: candidate.plant ? toPlant(candidate.plant) : null,
  }))
}
