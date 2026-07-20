import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import EnvironmentForm from '../components/EnvironmentForm'
import PlantCard from '../components/PlantCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { getRecommendations } from '../api/client'

function Recommend() {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(environment) {
    setIsLoading(true)
    setError(null)
    setResults(null)
    try {
      const plants = await getRecommendations(environment)
      setResults(plants)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="my-5">
      <h1 className="mb-2">Get Plant Recommendations</h1>
      <p className="text-muted mb-4">
        Describe your space and we'll rank the houseplants most likely to thrive in it.
      </p>

      <Row className="g-4">
        <Col lg={5}>
          <EnvironmentForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Col>

        <Col lg={7}>
          {isLoading && <LoadingSpinner label="Matching plants to your environment..." />}
          <ErrorAlert message={error} />

          {results && (
            <Row className="g-3">
              {results.map((plant) => (
                <Col md={6} key={plant.id}>
                  <PlantCard plant={plant} matchScore={plant.match_score} />
                </Col>
              ))}
            </Row>
          )}

          {!isLoading && !error && !results && (
            <div className="text-muted text-center py-5">
              <i className="bi bi-arrow-left display-6 d-none d-lg-block mb-2" />
              Fill in the form to see your personalized recommendations.
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Recommend
