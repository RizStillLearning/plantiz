import { useState } from 'react'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'

const DEFAULT_VALUES = {
  light: 'medium',
  humidity: 'medium',
  temperature_c: 21,
  space: 'medium',
  experience: 'beginner',
  pets: false,
}

function EnvironmentForm({ onSubmit, isLoading }) {
  const [values, setValues] = useState(DEFAULT_VALUES)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="light">
                <Form.Label>Light in the space</Form.Label>
                <Form.Select name="light" value={values.light} onChange={handleChange}>
                  <option value="low">Low light (no direct windows)</option>
                  <option value="medium">Medium (indirect light)</option>
                  <option value="bright">Bright (near a sunny window)</option>
                  <option value="direct">Direct sun for hours</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="humidity">
                <Form.Label>Humidity</Form.Label>
                <Form.Select name="humidity" value={values.humidity} onChange={handleChange}>
                  <option value="low">Low (heated/AC rooms)</option>
                  <option value="medium">Medium (average room)</option>
                  <option value="high">High (bathroom, kitchen)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="temperature_c">
                <Form.Label>Typical temperature (°C)</Form.Label>
                <Form.Control
                  type="number"
                  name="temperature_c"
                  min={-10}
                  max={50}
                  value={values.temperature_c}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="space">
                <Form.Label>Available space</Form.Label>
                <Form.Select name="space" value={values.space} onChange={handleChange}>
                  <option value="small">Small (desk, shelf, windowsill)</option>
                  <option value="medium">Medium (tabletop, corner)</option>
                  <option value="large">Large (floor space)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="experience">
                <Form.Label>Your plant experience</Form.Label>
                <Form.Select name="experience" value={values.experience} onChange={handleChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} className="d-flex align-items-end">
              <Form.Check
                type="checkbox"
                id="pets"
                name="pets"
                label="I have pets at home"
                checked={values.pets}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Button type="submit" variant="success" className="mt-4 w-100" disabled={isLoading}>
            {isLoading ? 'Finding your plants...' : 'Get my plant recommendations'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default EnvironmentForm
