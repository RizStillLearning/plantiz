const numberFormat = new Intl.NumberFormat('en-US')
const percentFormat = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 })
const orList = new Intl.ListFormat('en-US', { type: 'disjunction' })

export const formatNumber = (value) => numberFormat.format(value)

export const formatPercent = (share) => percentFormat.format(share)

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

// ['bright indirect', 'medium indirect'] -> 'Bright indirect or medium indirect'
export const formatOptions = (values) => capitalize(orList.format(values))

// (6, 10) -> '6 to 10'; (3, 3) -> '3'
export const formatRange = (min, max) => (min === max ? `${min}` : `${min} to ${max}`)

const SETTING_LABELS = { indoor: 'indoors', outdoor: 'outdoors' }

// ['indoor', 'outdoor'] -> 'Indoors or outdoors'
export const formatSettings = (settings) =>
  formatOptions(settings.map((setting) => SETTING_LABELS[setting] ?? setting))

// Zero-padded catalog number: 16 -> '0016'
export const formatCatalogNumber = (number) => String(number).padStart(4, '0')
