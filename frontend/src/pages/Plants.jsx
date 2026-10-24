import SelectField from '../components/form/SelectField.jsx'
import Icon from '../components/Icon.jsx'
import PageIntro from '../components/PageIntro.jsx'
import PlantFacts from '../components/PlantFacts.jsx'
import SiteLayout from '../components/SiteLayout.jsx'
import { plants } from '../data/plants.js'
import { groups, speciesCount } from '../data/stats.js'
import { capitalize, formatNumber } from '../lib/format.js'
import { CARE_LEVELS } from '../lib/levels.js'
import { lifecycleFact, settingFact } from '../lib/plantFacts.jsx'

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const byName = (a, b) => a.commonName.localeCompare(b.commonName)

const SETTING_TAGS = { indoor: 'Indoors', outdoor: 'Outdoors' }

const filters = [
  {
    name: 'group',
    label: 'Plant group',
    options: [{ value: '', label: 'All groups' }, ...groups.map(({ name }) => ({ value: name, label: name }))],
  },
  {
    name: 'setting',
    label: 'Grows',
    options: [
      { value: '', label: 'Indoors or outdoors' },
      { value: 'indoor', label: 'Indoors' },
      { value: 'outdoor', label: 'Outdoors' },
    ],
  },
  {
    name: 'care',
    label: 'Care level',
    options: [{ value: '', label: 'Any care level' }, ...CARE_LEVELS.map((level) => ({ value: level, label: capitalize(level) }))],
  },
]

function PlantItem({ plant }) {
  return (
    <li
      data-plant
      data-search={`${plant.commonName} ${plant.botanicalName}`.toLowerCase()}
      data-group={plant.category}
      data-settings={plant.settings.join(' ')}
      data-care={plant.careLevel}
    >
      <details className="plant" id={plant.id}>
        <summary className="plant__summary">
          <span className="plant__names">
            <span className="plant__name">{plant.commonName}</span>
            <span className="plant__botanical">{plant.botanicalName}</span>
          </span>
          <span className="plant__tags">
            {plant.settings.map((setting) => (
              <span key={setting} className="chip">
                {SETTING_TAGS[setting]}
              </span>
            ))}
            <span className="chip">{capitalize(plant.careLevel)} care</span>
          </span>
          <Icon name="chevronDown" size={20} className="plant__chevron" />
        </summary>
        <div className="plant__body">
          <PlantFacts plant={plant} extra={[settingFact(plant), lifecycleFact(plant)]} />
        </div>
      </details>
    </li>
  )
}

export default function Plants() {
  const species = formatNumber(speciesCount)
  return (
    <SiteLayout currentPath="/plants" member>
      <PageIntro id="plants-title" overline="Plant library" title={`Browse ${species} plant species`}>
        Open any plant to see the light, water and care it needs. Narrow the list by name, plant
        group, where it grows or how much care it takes.
      </PageIntro>

      <section className="library" aria-label="Plants" data-plant-library>
        <div className="container">
          <form className="filter-bar" role="search" aria-label="Filter plants" data-plant-filter>
            <div className="field filter-bar__search">
              <label className="field__label" htmlFor="plant-search">
                Search by name
              </label>
              <div className="field__control">
                <Icon name="search" size={18} className="input__icon" />
                <input
                  id="plant-search"
                  className="input input--with-icon"
                  type="search"
                  name="q"
                  placeholder="Try fern, rose or Ficus"
                  autoComplete="off"
                />
              </div>
            </div>
            {filters.map(({ name, label, options }) => (
              <SelectField key={name} id={`plant-${name}`} name={name} label={label} options={options} defaultValue="" />
            ))}
            <button type="reset" className="btn btn--secondary filter-bar__reset">
              Clear filters
            </button>
          </form>

          <p className="library__count" aria-live="polite" data-plant-count>
            Showing all {species} plants
          </p>
          <div className="library__empty" data-plant-empty hidden>
            <p>No plants match those filters. Try a shorter search or another group.</p>
            <button type="button" className="btn btn--secondary" data-plant-clear>
              Clear filters
            </button>
          </div>

          {groups.map(({ name, count }) => (
            <section key={name} className="plant-group" aria-labelledby={`group-${slug(name)}`} data-plant-group>
              <h2 id={`group-${slug(name)}`} className="plant-group__title">
                {name}
                <span className="plant-group__count">
                  <span data-group-count>{formatNumber(count)}</span>
                  <span className="visually-hidden"> plants</span>
                </span>
              </h2>
              <ul className="plant-list" role="list">
                {plants
                  .filter((plant) => plant.category === name)
                  .sort(byName)
                  .map((plant) => (
                    <PlantItem key={plant.id} plant={plant} />
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </SiteLayout>
  )
}
