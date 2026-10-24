import { clearSession, getUser } from '../lib/session.js'

// Member headers render a greeting slot and a log-out button on the server;
// the visitor's name is only known in the browser.
export function initAccount() {
  const user = getUser()
  for (const greeting of document.querySelectorAll('[data-account-name]')) {
    if (!user?.name) continue
    greeting.textContent = `Hi, ${user.name}`
    greeting.hidden = false
  }

  for (const button of document.querySelectorAll('[data-logout]')) {
    button.addEventListener('click', () => {
      clearSession()
      window.location.assign('/')
    })
  }
}
