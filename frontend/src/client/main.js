import { islands } from '../islands/registry.js'
import { initAccount } from './account.js'

initAccount()

const islandElements = [...document.querySelectorAll('[data-island]')]
if (islandElements.length > 0) hydrateIslands(islandElements)

const library = document.querySelector('[data-plant-library]')
if (library) import('./plantLibrary.js').then(({ initPlantLibrary }) => initPlantLibrary(library))

async function hydrateIslands(elements) {
  const [{ createElement }, { hydrateRoot }] = await Promise.all([import('react'), import('react-dom/client')])
  await Promise.all(
    elements.map(async (element) => {
      const load = islands[element.dataset.island]
      if (!load) throw new Error(`Unknown island "${element.dataset.island}"`)
      const { default: Component } = await load()
      hydrateRoot(element, createElement(Component, JSON.parse(element.dataset.props)))
    }),
  )
}
