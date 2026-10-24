import CollectionPanel from '../components/CollectionPanel.jsx'
import GroupChart from '../components/GroupChart.jsx'
import Icon from '../components/Icon.jsx'
import SiteLayout from '../components/SiteLayout.jsx'
import SpecimenCard from '../components/SpecimenCard.jsx'
import { getPlant } from '../data/plants.js'
import { groups, speciesCount } from '../data/stats.js'
import { formatNumber } from '../lib/format.js'

const species = formatNumber(speciesCount)

const features = [
  {
    href: '/plants',
    title: 'Browse the plant library',
    text: `Look up any of the ${species} species. Open a plant to see how much light and water it needs, how much care it takes, where it is hardy and how tall it grows.`,
    meta: [`${species} species`, `${groups.length} plant groups`],
  },
  {
    href: '/recommend',
    title: 'Get matched to your space',
    text: 'Tell us about the spot you have in mind, like how much sun it gets and whether it is indoors or out. We suggest up to five plants and show a confidence score for each one.',
    meta: ['Up to 5 matches', 'Confidence score'],
  },
  {
    href: '/identify',
    title: 'Identify a plant from a photo',
    text: 'Upload a photo of a leaf or flower and Plantiz suggests the species, with a confidence score so you know how sure it is.',
    meta: ['Photo upload', 'Confidence score'],
  },
]

function AccountActions() {
  return (
    <div className="actions">
      <a className="btn btn--primary" href="/signup">
        Create a free account
        <Icon name="arrowRight" size={18} className="nudge" />
      </a>
      <a className="btn btn--secondary" href="/login">
        Log in
      </a>
    </div>
  )
}

export default function Welcome() {
  return (
    <SiteLayout currentPath="/">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">
              <Icon name="leaf" size={16} />
              Welcome to Plantiz
            </p>
            <h1 id="hero-title" className="hero__title">
              Find the plants that <em>suit your space.</em>
            </h1>
            <p className="hero__lede">
              Plantiz is a field guide to {species} plant species, from windowsill herbs to fruit
              trees. Look any of them up, get matched with plants that fit your light and climate, or
              upload a photo to find out what is growing.
            </p>
            <AccountActions />
            <p className="hero__note">
              <Icon name="shieldCheck" size={16} />
              Free to join. All you need is a name, an email and a password.
            </p>
          </div>
          <SpecimenCard plant={getPlant('monstera')} />
        </div>
      </section>

      <section className="section" aria-labelledby="overview-title">
        <div className="container overview">
          <div className="overview__intro">
            <p className="overline">What you can do</p>
            <h2 id="overview-title" className="section-title">
              One place to choose, look up and name your plants
            </h2>
            <p className="section-lede">
              Plantiz brings a plant library, a recommender and a photo identifier together. Start
              with whichever one you need today.
            </p>
          </div>

          <ol className="feature-list" role="list">
            {features.map(({ href, title, text, meta }, index) => (
              <li key={href} className="feature">
                <span className="feature__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="feature__title">
                    <a href={href}>{title}</a>
                  </h3>
                  <p className="feature__text">{text}</p>
                  <ul className="feature__meta" role="list">
                    {meta.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="feature__go" aria-hidden="true">
                  <Icon name="arrowRight" size={20} className="nudge" />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="collection-title">
        <div className="container">
          <header className="section-head">
            <p className="overline">The collection</p>
            <h2 id="collection-title" className="section-title">
              What is growing in Plantiz
            </h2>
            <p className="section-lede">
              Every figure here is counted from the plant library itself, so it stays current as new
              species are added.
            </p>
          </header>

          <div className="split-card">
            <CollectionPanel />
            <div className="split-card__main">
              <h3 id="groups-title" className="split-card__title">
                Species by plant group
              </h3>
              <p className="split-card__lede">All {groups.length} groups, largest first.</p>
              <GroupChart titleId="groups-title" />
            </div>
          </div>
        </div>
      </section>

      <section className="section cta" aria-labelledby="cta-title">
        <div className="container cta__inner">
          <h2 id="cta-title" className="section-title">
            Ready to meet your next plant?
          </h2>
          <p className="section-lede">
            Create a free account and start exploring the library. Already have one? Log in to keep
            going.
          </p>
          <AccountActions />
        </div>
      </section>
    </SiteLayout>
  )
}
