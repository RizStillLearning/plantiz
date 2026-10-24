import { NAV_LINKS } from '../lib/navigation.js'
import Brand from './Brand.jsx'

function PublicActions({ currentPath }) {
  return (
    <div className="site-header__actions">
      <a
        className="site-header__login"
        href="/login"
        aria-current={currentPath === '/login' ? 'page' : undefined}
      >
        Log in
      </a>
      <a
        className="btn btn--ink"
        href="/signup"
        aria-current={currentPath === '/signup' ? 'page' : undefined}
      >
        Sign up
      </a>
    </div>
  )
}

function MemberActions() {
  return (
    <div className="site-header__actions">
      {/* Filled in by client/account.js; the name only exists in the browser. */}
      <span className="site-header__greeting" data-account-name hidden />
      <button type="button" className="btn btn--quiet" data-logout>
        Log out
      </button>
    </div>
  )
}

export default function SiteHeader({ currentPath, member }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />

        {member && (
          <nav className="site-nav" aria-label="Main">
            <ul className="site-nav__list" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    className="site-nav__link"
                    href={href}
                    aria-current={currentPath === href ? 'page' : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {member ? <MemberActions /> : <PublicActions currentPath={currentPath} />}
      </div>
    </header>
  )
}
