import SiteLayout from '../components/SiteLayout.jsx'

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="hero not-found" aria-labelledby="not-found-title">
        <div className="container not-found__inner">
          <p className="overline">Page not found</p>
          <h1 id="not-found-title" className="hero__title">
            This page has not been planted yet.
          </h1>
          <p className="hero__lede">The link may be out of date, or the page may have moved.</p>
          <div className="actions">
            <a className="btn btn--primary" href="/">
              Back to the welcome page
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
