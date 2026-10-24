// The signed-in session lives in localStorage: the JWT from the API plus the
// user's name for the header. Only call these from event handlers or effects,
// never while rendering (pages are rendered on the server first).

export const TOKEN_KEY = 'plantiz_token'
export const USER_KEY = 'plantiz_user'

// Where signed-in visitors land: the plant library is their home page.
export const HOME_PATH = '/plants'

// Self-contained on purpose: lib/guard.js inlines this function's source into
// each page's <head>, where nothing else from this module exists.
export function tokenIsValid(token) {
  if (!token) return false
  try {
    var base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    var payload = JSON.parse(atob(base64))
    return !payload.exp || payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function getToken() {
  const token = read(TOKEN_KEY)
  return tokenIsValid(token) ? token : null
}

export function getUser() {
  try {
    return JSON.parse(read(USER_KEY))
  } catch {
    return null
  }
}

export function saveSession({ access_token: token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify({ name: user.name, email: user.email }))
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    // Storage unavailable: there is no session to clear.
  }
}

// Where to go after logging in: the page that sent the visitor to /login, if
// it is a path on this site, otherwise the plant library.
export function nextPath(search = window.location.search) {
  const next = new URLSearchParams(search).get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : HOME_PATH
}
