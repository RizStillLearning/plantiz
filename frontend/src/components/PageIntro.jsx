// The tinted band that opens every member page: overline, the page's h1, lede.
export default function PageIntro({ id, overline, title, children }) {
  return (
    <section className="page-intro" aria-labelledby={id}>
      <div className="container">
        <p className="overline">{overline}</p>
        <h1 id={id} className="page-intro__title">
          {title}
        </h1>
        <p className="page-intro__lede">{children}</p>
      </div>
    </section>
  )
}
