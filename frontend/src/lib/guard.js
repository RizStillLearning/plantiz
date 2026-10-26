import { HOME_PATH, TOKEN_KEY } from './session.js'

// Runs inline in <head>, before any bundle loads, so the visitor is sent to
// the right page before anything paints.
const signedIn = `(function () {
  try {
    var token = localStorage.getItem(${JSON.stringify(TOKEN_KEY)});
    var exp = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp;
    return !exp || exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
})()`

const scripts = {
  member: `if (!${signedIn}) location.replace('/login?next=' + encodeURIComponent(location.pathname + location.search + location.hash));`,
  guest: `if (${signedIn}) location.replace(${JSON.stringify(HOME_PATH)});`,
}

export const guardScript = (access) => (access ? `<script>${scripts[access]}</script>` : '')
