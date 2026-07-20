import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <section className="hero-section text-center text-white">
        <Container>
          <i className="bi bi-flower1 display-1 mb-3 d-block" />
          <h1 className="display-4 fw-bold">Plantiz</h1>
          <p className="lead col-lg-8 mx-auto">
            Find the perfect plant for your home, or point your camera at one and let AI tell you
            what it is.
          </p>
        </Container>
      </section>

      <Container className="my-5">
        <Row className="g-4 justify-content-center">
          <Col md={6} lg={5}>
            <Card className="h-100 shadow-sm feature-card">
              <Card.Body className="text-center d-flex flex-column">
                <i className="bi bi-sun display-4 text-success mb-3" />
                <Card.Title as="h3">Get Plant Recommendations</Card.Title>
                <Card.Text className="text-muted">
                  Tell us about your light, humidity, space, and experience level — we'll match
                  you with plants that will actually thrive.
                </Card.Text>
                <Button as={Link} to="/recommend" variant="success" className="mt-auto">
                  Find my plants
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={5}>
            <Card className="h-100 shadow-sm feature-card">
              <Card.Body className="text-center d-flex flex-column">
                <i className="bi bi-camera display-4 text-success mb-3" />
                <Card.Title as="h3">Identify a Plant</Card.Title>
                <Card.Text className="text-muted">
                  Not sure what that plant is? Upload a photo and our AI will identify the
                  species and give you care tips.
                </Card.Text>
                <Button as={Link} to="/identify" variant="success" className="mt-auto">
                  Identify a plant
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
