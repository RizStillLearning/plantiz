// Inline <head> scripts that send visitors to the right place before the page
// paints. They run before any bundle loads, so they carry their own copy of
// the token check.
import { HOME_PATH, TOKEN_KEY, tokenIsValid } from './session.js'

const hasSession = `(${tokenIsValid.toString()})((function(){try{return localStorage.getItem(${JSON.stringify(TOKEN_KEY)})}catch(e){return null}})())`

const scripts = {
  // Member pages: no valid session -> log in, then come back here.
  member: `if(!${hasSession}){location.replace('/login?next='+encodeURIComponent(location.pathname+location.search+location.hash))}`,
  // Welcome, log in and sign up: already signed in -> straight to the library.
  guest: `if(${hasSession}){location.replace(${JSON.stringify(HOME_PATH)})}`,
}

export function guardScript(access) {
  return scripts[access] ? `<script>${scripts[access]}</script>` : ''
}
