import { Spinner } from 'react-bootstrap'

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center py-5">
      <Spinner animation="border" variant="success" role="status" />
      <p className="mt-3 text-muted">{label}</p>
    </div>
  )
}

export default LoadingSpinner
