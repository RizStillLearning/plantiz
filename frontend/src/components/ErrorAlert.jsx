import { Alert } from 'react-bootstrap'

function ErrorAlert({ message }) {
  if (!message) return null

  return (
    <Alert variant="danger" className="d-flex align-items-start">
      <i className="bi bi-exclamation-octagon-fill me-2 mt-1" />
      <div>{message}</div>
    </Alert>
  )
}

export default ErrorAlert
