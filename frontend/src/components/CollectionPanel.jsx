import {
  easyCareCount,
  groups,
  indoorCount,
  settingSplit,
  speciesCount,
  zoneRange,
} from '../data/stats.js'
import { formatNumber, formatRange } from '../lib/format.js'
import Icon from './Icon.jsx'

const stats = [
  { icon: 'grid', label: 'Plant groups', value: formatNumber(groups.length) },
  { icon: 'home', label: 'Grow indoors', value: formatNumber(indoorCount) },
  { icon: 'sprout', label: 'Easy to care for', value: formatNumber(easyCareCount) },
  { icon: 'thermometer', label: 'Hardiness zones', value: formatRange(zoneRange.min, zoneRange.max) },
]

export default function CollectionPanel() {
  return (
    <div className="panel-dark">
      <div>
        <h3 className="panel-dark__title">At a glance</h3>
        <p className="panel-dark__lede">A quick read of the whole library.</p>
      </div>

      <p className="figure">
        <span className="figure__value">{formatNumber(speciesCount)}</span>
        <span className="figure__label">plant species, each with notes on light, water and care</span>
      </p>

      <ul className="stat-list" role="list">
        {stats.map(({ icon, label, value }) => (
          <li key={label} className="stat">
            <span className="stat__tile">
              <Icon name={icon} size={20} />
            </span>
            <span>
              <span className="stat__label">{label}</span>
              <span className="stat__value">{value}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="panel-dark__foot">
        <h4 className="stat__label" id="setting-split-title">
          Where they grow
        </h4>
        <div className="stack-bar" aria-hidden="true">
          {settingSplit.map(({ key, count }) => (
            <span
              key={key}
              className={`stack-bar__segment stack-bar__segment--${key}`}
              style={{ '--count': count }}
            />
          ))}
        </div>
        <ul className="legend" role="list" aria-labelledby="setting-split-title">
          {settingSplit.map(({ key, label, count }) => (
            <li key={key} className="legend__item">
              <span className={`legend__swatch stack-bar__segment--${key}`} aria-hidden="true" />
              {label}
              <span className="legend__value">{formatNumber(count)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
