// Final build step: render every route from the SSR bundle into static HTML
// files inside dist/, then delete the SSR bundle (it is only a build tool).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { fillTemplate, stripClientScripts } from './template.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const serverBuild = join(root, 'dist-server')

const template = await readFile(join(dist, 'index.html'), 'utf8')
const staticTemplate = stripClientScripts(template)
const { render, renderNotFound, routes } = await import(
  pathToFileURL(join(serverBuild, 'entry-server.js')).href
)

async function writePage(file, page) {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, fillTemplate(page.client ? template : staticTemplate, page))
  console.log(`  prerendered ${file.slice(root.length)}${page.client ? '' : ' (no JS)'}`)
}

// Flat files (/plants -> plants.html), which Vercel (cleanUrls) and `vite preview`
// both serve without a trailing slash.
for (const route of routes) {
  const file = route === '/' ? join(dist, 'index.html') : join(dist, `${route.slice(1)}.html`)
  await writePage(file, render(route))
}
await writePage(join(dist, '404.html'), renderNotFound())

await rm(serverBuild, { recursive: true, force: true })
