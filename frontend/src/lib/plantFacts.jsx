import LevelMeter from '../components/LevelMeter.jsx'
import { capitalize, formatOptions, formatRange, formatSettings } from './format.js'
import { CARE_LEVELS, WATER_LEVELS } from './levels.js'

// The core facts every plant view shows, in display order. Plants come either
// from the build-time dataset or from the API (via toPlant), in one shape.
export function plantFacts(plant) {
  return [
    { key: 'light', icon: 'sun', label: 'Light', value: formatOptions(plant.light) },
    {
      key: 'water',
      icon: 'droplet',
      label: 'Water',
      value: capitalize(plant.water),
      meter: <LevelMeter levels={WATER_LEVELS} value={plant.water} />,
    },
    {
      key: 'care',
      icon: 'sprout',
      label: 'Care',
      value: capitalize(plant.careLevel),
      meter: <LevelMeter levels={CARE_LEVELS} value={plant.careLevel} />,
    },
    {
      key: 'hardiness',
      icon: 'thermometer',
      label: 'Hardiness',
      value:
        plant.zoneMin === null
          ? 'Any zone (grown as an annual)'
          : `Zones ${formatRange(plant.zoneMin, plant.zoneMax)}`,
    },
    {
      key: 'height',
      icon: 'height',
      label: 'Height',
      value: `${formatRange(plant.heightFtMin, plant.heightFtMax)} ft`,
    },
  ]
}

export const settingFact = (plant) => ({ key: 'setting', label: 'Grows', value: formatSettings(plant.settings) })

export const lifecycleFact = (plant) => ({ key: 'lifecycle', label: 'Lifecycle', value: capitalize(plant.lifecycle) })

export const groupFact = (plant) => ({ key: 'group', label: 'Plant group', value: plant.category })
