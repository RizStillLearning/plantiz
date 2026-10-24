import { NAV_LINKS } from '../lib/navigation.js'
import Brand from './Brand.jsx'

export default function SiteFooter({ member }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <Brand size="sm" />
        <p className="site-footer__copy">© 2026 Plantiz. A field guide for growing things.</p>
        {member && (
          <nav aria-label="Footer">
            <ul className="site-footer__links" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  )
}
