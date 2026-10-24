// Ordinal scales, low to high, as they appear in data/plants.csv. Shared by
// the build-time pages and the browser islands, so it must not import data.
export const WATER_LEVELS = ['low', 'moderate', 'high']
export const CARE_LEVELS = ['easy', 'moderate', 'challenging']

// Mature height buckets used by the recommender (backend/app/services/recommender.py).
export const SPACE_LEVELS = [
  { value: 'small', label: 'Small', hint: 'Up to 2 ft (60 cm) tall', maxFt: 2 },
  { value: 'medium', label: 'Medium', hint: '2 to 6 ft (60 cm to 1.8 m)', maxFt: 6 },
  { value: 'large', label: 'Large', hint: 'Over 6 ft (1.8 m)', maxFt: Infinity },
]

export const spaceForHeight = (heightFt) => SPACE_LEVELS.find(({ maxFt }) => heightFt <= maxFt).value
