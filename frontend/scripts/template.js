// Shared by the dev server (vite.config.js) and the build (prerender.js) so a
// page is assembled the same way in both. Replacer functions keep `$` in page
// content from being read as a String.replace pattern.
export function fillTemplate(template, { head, html }) {
  return template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html)
}

// Pages marked `client: false` ship no JavaScript bundle: drop the entry
// script and its preloads from the built template.
export function stripClientScripts(template) {
  return template
    .replace(/<script\b[^>]*\btype="module"[^>]*><\/script>\s*/g, '')
    .replace(/<link\b[^>]*\brel="modulepreload"[^>]*>\s*/g, '')
}
