import { Card, Badge, ProgressBar } from 'react-bootstrap'

const DIFFICULTY_VARIANT = {
  beginner: 'success',
  intermediate: 'warning',
  expert: 'danger',
}

function PlantCard({ plant, matchScore }) {
  return (
    <Card className="plant-card h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-0">{plant.common_name}</Card.Title>
            <Card.Subtitle className="text-muted fst-italic small">
              {plant.scientific_name}
            </Card.Subtitle>
          </div>
          <Badge bg={DIFFICULTY_VARIANT[plant.difficulty] || 'secondary'} className="text-capitalize">
            {plant.difficulty}
          </Badge>
        </div>

        {typeof matchScore === 'number' && (
          <div className="mb-3">
            <div className="d-flex justify-content-between small mb-1">
              <span>Match</span>
              <span>{matchScore}%</span>
            </div>
            <ProgressBar now={matchScore} variant="success" style={{ height: '6px' }} />
          </div>
        )}

        <Card.Text className="small">{plant.description}</Card.Text>

        <ul className="list-unstyled small mb-3">
          <li>
            <i className="bi bi-brightness-high me-2 text-warning" />
            Light: {plant.light.join(', ')}
          </li>
          <li>
            <i className="bi bi-droplet me-2 text-info" />
            Water: {plant.water_frequency}
          </li>
          <li>
            <i className="bi bi-moisture me-2 text-primary" />
            Humidity: {plant.humidity}
          </li>
          <li>
            <i
              className={`bi ${plant.pet_friendly ? 'bi-check-circle text-success' : 'bi-exclamation-triangle text-danger'} me-2`}
            />
            {plant.pet_friendly ? 'Pet-friendly' : 'Toxic to pets'}
          </li>
        </ul>

        {plant.care_tips?.length > 0 && (
          <div className="mt-auto">
            <p className="fw-semibold small mb-1">Care tips</p>
            <ul className="small ps-3 mb-0">
              {plant.care_tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default PlantCard
