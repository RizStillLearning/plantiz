import { clearSession, getUser } from '../lib/session.js'

export function initAccount() {
  const greeting = document.querySelector('[data-account-name]')
  if (greeting) {
    greeting.textContent = `Hi, ${getUser().name}`
    greeting.hidden = false
  }

  document.querySelector('[data-logout]')?.addEventListener('click', () => {
    clearSession()
    window.location.assign('/')
  })
}
