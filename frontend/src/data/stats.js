import { plants } from './plants.js'

const countBy = (items, keyOf) =>
  items.reduce((counts, item) => counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1), new Map())

const growsIndoors = (plant) => plant.settings.includes('indoor')
const growsOutdoors = (plant) => plant.settings.includes('outdoor')

export const speciesCount = plants.length

// Largest group first; ties break alphabetically so the order is stable.
export const groups = [...countBy(plants, (plant) => plant.category)]
  .map(([name, count]) => ({ name, count, share: count / speciesCount }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

export const indoorCount = plants.filter(growsIndoors).length

export const easyCareCount = plants.filter((plant) => plant.careLevel === 'easy').length

const zonedPlants = plants.filter((plant) => plant.zoneMin !== null && plant.zoneMax !== null)
export const zoneRange = {
  min: Math.min(...zonedPlants.map((plant) => plant.zoneMin)),
  max: Math.max(...zonedPlants.map((plant) => plant.zoneMax)),
}

// Ordered indoor -> outdoor, which is why the chart gives it a one-hue ramp.
export const settingSplit = [
  { key: 'indoor', label: 'Indoors only', test: (p) => growsIndoors(p) && !growsOutdoors(p) },
  { key: 'both', label: 'Indoors or out', test: (p) => growsIndoors(p) && growsOutdoors(p) },
  { key: 'outdoor', label: 'Outdoors only', test: (p) => !growsIndoors(p) && growsOutdoors(p) },
].map(({ key, label, test }) => ({ key, label, count: plants.filter(test).length }))
