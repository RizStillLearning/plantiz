import { useState } from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import ImageUploader from '../components/ImageUploader'
import PlantCard from '../components/PlantCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { identifyPlant } from '../api/client'

function Identify() {
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(file, organ) {
    setIsLoading(true)
    setError(null)
    setResponse(null)
    try {
      const data = await identifyPlant(file, organ)
      setResponse(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="my-5">
      <h1 className="mb-2">Identify a Plant</h1>
      <p className="text-muted mb-4">
        Upload a clear photo of a leaf, flower, fruit, or bark and we'll suggest the most likely
        species.
      </p>

      <Row className="g-4">
        <Col lg={5}>
          <ImageUploader onSubmit={handleSubmit} isLoading={isLoading} />
        </Col>

        <Col lg={7}>
          {isLoading && <LoadingSpinner label="Asking Pl@ntNet what this is..." />}
          <ErrorAlert message={error} />

          {response && (
            <>
              {response.remaining_requests != null && (
                <p className="text-muted small">
                  {response.remaining_requests} identification requests remaining today
                </p>
              )}
              <Row className="g-3">
                {response.candidates.map((candidate, index) => (
                  <Col md={12} key={candidate.scientific_name + index}>
                    {candidate.local_match ? (
                      <PlantCard plant={candidate.local_match} matchScore={candidate.confidence} />
                    ) : (
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <Card.Title className="mb-0 fst-italic">
                                {candidate.scientific_name}
                              </Card.Title>
                              {candidate.common_names.length > 0 && (
                                <Card.Subtitle className="text-muted small">
                                  {candidate.common_names.join(', ')}
                                </Card.Subtitle>
                              )}
                            </div>
                            <Badge bg="success">{candidate.confidence}% match</Badge>
                          </div>
                          {candidate.family && (
                            <Card.Text className="small text-muted mt-2 mb-0">
                              Family: {candidate.family}
                            </Card.Text>
                          )}
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                ))}
              </Row>
            </>
          )}

          {!isLoading && !error && !response && (
            <div className="text-muted text-center py-5">
              <i className="bi bi-arrow-left display-6 d-none d-lg-block mb-2" />
              Upload a photo to identify the plant.
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Identify
