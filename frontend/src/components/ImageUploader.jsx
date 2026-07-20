import { useRef, useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

function ImageUploader({ onSubmit, isLoading }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [organ, setOrgan] = useState('auto')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  function selectFile(candidate) {
    if (!candidate || !ACCEPTED_TYPES.includes(candidate.type)) return
    setFile(candidate)
    setPreviewUrl(URL.createObjectURL(candidate))
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (file) onSubmit(file, organ)
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div
            className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Selected plant preview" className="preview-image" />
            ) : (
              <div className="text-center text-muted">
                <i className="bi bi-cloud-arrow-up display-4 d-block mb-2" />
                <p className="mb-0">Drag & drop a photo here, or click to browse</p>
                <p className="small">JPEG or PNG</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="d-none"
              onChange={(event) => selectFile(event.target.files?.[0])}
            />
          </div>

          <Form.Group className="mt-3" controlId="organ">
            <Form.Label>What part of the plant is in the photo?</Form.Label>
            <Form.Select value={organ} onChange={(event) => setOrgan(event.target.value)}>
              <option value="auto">Not sure — auto-detect</option>
              <option value="leaf">Leaf</option>
              <option value="flower">Flower</option>
              <option value="fruit">Fruit</option>
              <option value="bark">Bark</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="success" className="mt-3 w-100" disabled={!file || isLoading}>
            {isLoading ? 'Identifying...' : 'Identify this plant'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ImageUploader
