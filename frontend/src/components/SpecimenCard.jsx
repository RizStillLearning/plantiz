import { speciesCount } from '../data/stats.js'
import { capitalize, formatCatalogNumber, formatNumber } from '../lib/format.js'
import { plantFacts } from '../lib/plantFacts.jsx'
import Icon from './Icon.jsx'

// One dataset entry styled like a field-guide index card, with two blank
// cards fanned out behind it to suggest the rest of the collection.
export default function SpecimenCard({ plant }) {
  const facts = plantFacts(plant)

  return (
    <aside className="specimen" aria-label={`Featured species: ${plant.commonName}`}>
      <div className="specimen__card">
        <div className="specimen__top">
          <span className="tag">Featured species</span>
          <span className="specimen__number">
            No. {formatCatalogNumber(plant.catalogNumber)} of {formatNumber(speciesCount)}
          </span>
        </div>

        <p className="specimen__name">{plant.commonName}</p>
        <p className="specimen__botanical">{plant.botanicalName}</p>

        <ul className="specimen__chips" role="list">
          {[plant.category, ...plant.settings, plant.lifecycle].map((chip) => (
            <li key={chip} className="chip">
              {capitalize(chip)}
            </li>
          ))}
        </ul>

        <dl className="specimen__facts">
          {facts.map(({ icon, label, value, meter }) => (
            <div key={label} className="specimen__fact">
              <dt>
                <Icon name={icon} size={18} />
                {label}
              </dt>
              <dd>
                {meter}
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <a className="text-link specimen__link" href={`/plants#${plant.id}`}>
          See it in the plant library
          <Icon name="arrowRight" size={18} className="nudge" />
        </a>
      </div>
    </aside>
  )
}
