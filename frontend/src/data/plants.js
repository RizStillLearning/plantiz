// Only imported while rendering pages, so the CSV never ships to the browser.
import csv from '@data/plants.csv?raw'

// The file has no quoted fields, so a plain split is enough. Stop the build if
// that ever changes rather than render shifted columns.
function parse(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/)
  const keys = header.split(',')
  return lines.map((line, index) => {
    const values = line.split(',')
    if (values.length !== keys.length || line.includes('"')) {
      throw new Error(`data/plants.csv row ${index + 2} has an unexpected shape: ${line}`)
    }
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]))
  })
}

const toNumber = (value) => (value === '' ? null : Number(value))

export const plants = parse(csv).map((row, index) => ({
  catalogNumber: index + 1,
  id: row.id,
  commonName: row.common_name,
  botanicalName: row.botanical_name,
  category: row.category,
  settings: row.setting.split(';'),
  light: row.light.split(';'),
  water: row.water,
  careLevel: row.care_level,
  lifecycle: row.lifecycle,
  zoneMin: toNumber(row.zone_min),
  zoneMax: toNumber(row.zone_max),
  heightFtMin: toNumber(row.height_ft_min),
  heightFtMax: toNumber(row.height_ft_max),
  popularity: toNumber(row.popularity),
}))

export function getPlant(id) {
  const plant = plants.find((candidate) => candidate.id === id)
  if (!plant) throw new Error(`No plant with id "${id}" in data/plants.csv`)
  return plant
}
