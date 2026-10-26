// Browser-only: pages render on the server first, so only call these from
// event handlers or effects.

export const TOKEN_KEY = 'plantiz_token'
export const USER_KEY = 'plantiz_user'

// The plant library is the home page for signed-in visitors.
export const HOME_PATH = '/plants'

export function tokenIsValid(token) {
  if (!token) return false
  // A token we can't decode is as good as no token.
  try {
    const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(encodedPayload))
    return !exp || exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  return tokenIsValid(token) ? token : null
}

export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY))

export function saveSession({ access_token: token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify({ name: user.name, email: user.email }))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// Only follow `next` to a path on this site, never to another origin.
export function nextPath(search = window.location.search) {
  const next = new URLSearchParams(search).get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : HOME_PATH
}
