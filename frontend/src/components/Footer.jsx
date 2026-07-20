function Footer() {
  return (
    <footer className="plantiz-footer text-center py-4 mt-auto">
      <p className="mb-1 fw-semibold">
        <i className="bi bi-flower1 me-1" />
        Plantiz
      </p>
      <p className="mb-0 small text-muted">
        Plant identification powered by{' '}
        <a href="https://plantnet.org" target="_blank" rel="noreferrer">
          Pl@ntNet
        </a>
      </p>
    </footer>
  )
}

export default Footer
