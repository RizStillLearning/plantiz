import { plantFacts } from '../lib/plantFacts.jsx'
import Icon from './Icon.jsx'

// `matches` lists fact keys that agree with what the visitor asked for; each
// gets a labelled badge so the agreement is never shown by color alone.
export default function PlantFacts({ plant, extra = [], matches = [] }) {
  return (
    <dl className="facts">
      {[...plantFacts(plant), ...extra].map(({ key, label, value, meter }) => (
        <div key={key} className="facts__row">
          <dt>{label}</dt>
          <dd>
            {meter}
            <span>{value}</span>
            {matches.includes(key) && (
              <span className="match-badge">
                <Icon name="check" size={14} />
                Match
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
