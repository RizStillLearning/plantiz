import { speciesCount } from '../data/stats.js'
import { formatNumber } from '../lib/format.js'
import Icon from './Icon.jsx'
import SiteLayout from './SiteLayout.jsx'

const features = [
  { icon: 'book', label: 'Plant library', text: `${formatNumber(speciesCount)} species with light, water and care notes` },
  { icon: 'sliders', label: 'Recommendations', text: 'Up to 5 plants matched to your space' },
  { icon: 'camera', label: 'Identification', text: 'Name a plant from a photo, with a confidence score' },
]

// The split card from the welcome page, reused for the account forms: the
// form on white, what an account unlocks on the dark panel.
export default function AuthLayout({ currentPath, title, lede, form, switchPrompt }) {
  return (
    <SiteLayout currentPath={currentPath}>
      <section className="auth" aria-labelledby="auth-title">
        <div className="container">
          <div className="split-card split-card--auth">
            <div className="split-card__main auth__main">
              <h1 id="auth-title" className="auth__title">
                {title}
              </h1>
              <p className="auth__lede">{lede}</p>
              {form}
              <p className="auth__switch">{switchPrompt}</p>
            </div>

            <div className="panel-dark">
              <div>
                <h2 className="panel-dark__title">Inside Plantiz</h2>
                <p className="panel-dark__lede">Everything you can do once you are signed in.</p>
              </div>
              <ul className="stat-list stat-list--stacked" role="list">
                {features.map(({ icon, label, text }) => (
                  <li key={label} className="stat">
                    <span className="stat__tile">
                      <Icon name={icon} size={20} />
                    </span>
                    <span>
                      <span className="stat__label">{label}</span>
                      <span className="stat__text">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="panel-dark__foot auth__note">
                <Icon name="shieldCheck" size={18} />
                Passwords are stored hashed, never as plain text.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
