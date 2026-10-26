import { renderToString } from 'react-dom/server'
import { speciesCount } from './data/stats.js'
import { formatNumber } from './lib/format.js'
import { guardScript } from './lib/guard.js'
import Identify from './pages/Identify.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Plants from './pages/Plants.jsx'
import Recommend from './pages/Recommend.jsx'
import Signup from './pages/Signup.jsx'
import Welcome from './pages/Welcome.jsx'

const species = formatNumber(speciesCount)

// access: 'guest' pages send signed-in visitors to /plants, 'member' pages send
// everyone else to log in (see lib/guard.js). client: false pages ship no
// JavaScript bundle.
const pages = {
  '/': {
    Page: Welcome,
    access: 'guest',
    client: false,
    title: 'Plantiz · Find the plants that suit your space',
    description: `A field guide to ${species} plant species, with plant recommendations for your space and plant identification from a photo.`,
  },
  '/login': {
    Page: Login,
    access: 'guest',
    client: true,
    title: 'Log in · Plantiz',
    description: 'Log in to Plantiz to browse plants, get recommendations and identify plants from photos.',
  },
  '/signup': {
    Page: Signup,
    access: 'guest',
    client: true,
    title: 'Create an account · Plantiz',
    description: 'Create a free Plantiz account.',
  },
  '/plants': {
    Page: Plants,
    access: 'member',
    client: true,
    title: 'Plant library · Plantiz',
    description: `Browse ${species} plant species and what each one needs to grow well.`,
  },
  '/recommend': {
    Page: Recommend,
    access: 'member',
    client: true,
    title: 'Recommendations · Plantiz',
    description: 'Get up to five plant recommendations for your space, each with a confidence score.',
  },
  '/identify': {
    Page: Identify,
    access: 'member',
    client: true,
    title: 'Identify a plant · Plantiz',
    description: 'Identify a plant from a photo, with a confidence score.',
  },
}

const notFound = {
  Page: NotFound,
  client: false,
  title: 'Page not found · Plantiz',
  description: 'This page could not be found on Plantiz.',
}

export const routes = Object.keys(pages)

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

function renderPage({ Page, title, description, access, client }, status) {
  return {
    status,
    client,
    head: [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      guardScript(access),
    ]
      .filter(Boolean)
      .join('\n    '),
    html: renderToString(<Page />),
  }
}

export function render(pathname) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const page = pages[normalized]
  return page ? renderPage(page, 200) : renderNotFound()
}

export function renderNotFound() {
  return renderPage(notFound, 404)
}
