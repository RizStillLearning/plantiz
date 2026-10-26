import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fillTemplate } from './scripts/template.js'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

// The FastAPI backend in dev and `npm run preview` (see backend/README.md).
const API_TARGET = process.env.PLANTIZ_API_URL ?? 'http://localhost:8000'

// Every page is static HTML rendered from src/entry-server.jsx. `npm run build`
// writes those files out (scripts/prerender.js); this plugin renders the same
// pages per request in dev so both match.
function staticPages() {
  return {
    name: 'plantiz:static-pages',
    configureServer(server) {
      // Pages are rendered on the server, so HMR cannot patch them in place.
      // Reload whenever a page's source or data changes.
      server.watcher.on('change', (file) => {
        if (/\.(jsx?|csv)$/.test(file)) server.ws.send({ type: 'full-reload' })
      })

      server.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl
        const pathname = url.split('?')[0]
        const isPageRequest =
          req.method === 'GET' &&
          req.headers.accept?.includes('text/html') &&
          !pathname.startsWith('/@') &&
          !/\.\w+$/.test(pathname)
        if (!isPageRequest) return next()

        try {
          const template = await readFile(new URL('./index.html', import.meta.url), 'utf8')
          const transformed = await server.transformIndexHtml(url, template)
          const { render } = await server.ssrLoadModule('/src/entry-server.jsx')
          const page = render(pathname)
          res.statusCode = page.status
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(fillTemplate(transformed, page))
        } catch (error) {
          server.ssrFixStacktrace(error)
          next(error)
        }
      })
    },
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [react(), staticPages()],
  resolve: {
    alias: {
      // The plant dataset lives at the repo root so the backend reads the same file.
      '@data': fileURLToPath(new URL('../data', import.meta.url)),
    },
  },
  server: {
    fs: { allow: [repoRoot] },
    proxy: { '/api': API_TARGET },
  },
  preview: {
    proxy: { '/api': API_TARGET },
  },
})
