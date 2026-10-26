import SiteFooter from './SiteFooter.jsx'
import SiteHeader from './SiteHeader.jsx'

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
