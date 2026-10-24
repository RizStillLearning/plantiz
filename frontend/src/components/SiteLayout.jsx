import SiteFooter from './SiteFooter.jsx'
import SiteHeader from './SiteHeader.jsx'

// Public pages (welcome, log in, sign up) show only the brand and account
// actions. Pages for signed-in members pass `member` to add the app links and
// the log-out button.
export default function SiteLayout({ currentPath, member = false, children }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader currentPath={currentPath} member={member} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter member={member} />
    </>
  )
}
