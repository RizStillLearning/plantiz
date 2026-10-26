import { useEffect, useMemo, useRef, useState } from 'react'
import Confidence from '../components/Confidence.jsx'
import ChoiceGroup from '../components/form/ChoiceGroup.jsx'
import { FieldError } from '../components/form/TextField.jsx'
import { FormAlert, SubmitButton } from '../components/form/FormStatus.jsx'
import Icon from '../components/Icon.jsx'
import PlantFacts from '../components/PlantFacts.jsx'
import { identifyPlant } from '../lib/api.js'
import { prepareForUpload } from '../lib/image.js'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
// Above the server's 10 MB limit on purpose: photos are shrunk before upload
// (lib/image.js).
const MAX_MB = 20
const LOW_CONFIDENCE = 0.25

const ORGANS = [
  { value: 'leaf', label: 'Leaf' },
  { value: 'flower', label: 'Flower' },
  { value: 'fruit', label: 'Fruit' },
  { value: 'bark', label: 'Bark' },
  { value: 'auto', label: 'Not sure' },
]

function fileError(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Choose a JPEG or PNG photo.'
  if (file.size > MAX_MB * 1024 * 1024) return `Choose a photo smaller than ${MAX_MB} MB.`
  return ''
}

const displayName = (candidate) => candidate.commonNames[0] ?? candidate.scientificName

function Tips() {
  const tips = [
    { title: 'One part per photo', text: 'A single leaf, flower, fruit or patch of bark works better than the whole plant.' },
    { title: 'Fill the frame', text: 'Get close, keep it in focus and avoid busy backgrounds.' },
    { title: 'Use daylight', text: 'Natural light shows true colors. Skip the flash if you can.' },
  ]
  return (
    <div className="panel-dark how-it-works">
      <div>
        <h2 className="panel-dark__title">Tips for a clear match</h2>
        <p className="panel-dark__lede">Your results will appear here.</p>
      </div>
      <ol className="steps" role="list">
        {tips.map(({ title, text }, index) => (
          <li key={title} className="step">
            <span className="stat__tile step__number" aria-hidden="true">
              {index + 1}
            </span>
            <span>
              <span className="step__title">{title}</span>
              <span className="step__text">{text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Result({ candidates, headingRef }) {
  const [best, ...others] = candidates
  return (
    <div className="results">
      <h2 className="results__title" tabIndex={-1} ref={headingRef}>
        Best match
      </h2>
      <article className="card best-match" aria-label={`Best match: ${displayName(best)}`}>
        <div className="match__head">
          <div className="match__names">
            <p className="best-match__name">{displayName(best)}</p>
            <p className="match__botanical">
              {best.commonNames.length > 0 && best.scientificName}
              <span className="best-match__family">
                {best.commonNames.length > 0 && ' · '}
                {best.family}
              </span>
            </p>
          </div>
          <Confidence value={best.confidence} size="lg" />
        </div>

        {best.confidence < LOW_CONFIDENCE && (
          <p className="notice">
            <Icon name="alert" size={18} />
            Pl@ntNet is not very sure about this one. A sharper photo of a single leaf or flower
            usually helps.
          </p>
        )}

        {best.plant ? (
          <>
            <PlantFacts plant={best.plant} />
            <a className="text-link" href={`/plants#${best.plant.id}`}>
              Open in the plant library
              <Icon name="arrowRight" size={18} className="nudge" />
            </a>
          </>
        ) : (
          <p className="best-match__missing">This species is not in the Plantiz library yet.</p>
        )}
      </article>

      {others.length > 0 && (
        <>
          <h3 className="results__subtitle">Other possibilities</h3>
          <ol className="candidates" role="list">
            {others.map((candidate) => (
              <li key={candidate.scientificName} className="candidate">
                <div className="candidate__names">
                  {candidate.plant ? (
                    <a className="candidate__name" href={`/plants#${candidate.plant.id}`}>
                      {displayName(candidate)}
                    </a>
                  ) : (
                    <span className="candidate__name">{displayName(candidate)}</span>
                  )}
                  {candidate.commonNames.length > 0 && (
                    <span className="match__botanical">{candidate.scientificName}</span>
                  )}
                </div>
                <Confidence value={candidate.confidence} size="sm" />
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

export default function IdentifyForm() {
  const [file, setFile] = useState(null)
  const [organ, setOrgan] = useState('auto')
  const [photoError, setPhotoError] = useState('')
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [candidates, setCandidates] = useState(null)
  const inputRef = useRef(null)
  const resultsHeading = useRef(null)

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl])

  useEffect(() => {
    if (candidates) resultsHeading.current.focus()
  }, [candidates])

  function choose(chosen) {
    if (!chosen) return
    const error = fileError(chosen)
    setPhotoError(error)
    setFormError('')
    if (!error) {
      setFile(chosen)
      setCandidates(null)
    }
  }

  function clearPhoto() {
    setFile(null)
    setCandidates(null)
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    choose(event.dataTransfer.files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!file) {
      setPhotoError('Choose a photo to identify.')
      inputRef.current.focus()
      return
    }

    setPending(true)
    try {
      setCandidates(await identifyPlant(await prepareForUpload(file), organ))
    } catch (error) {
      setFormError(error.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="workspace">
      <form className="form card workspace__form" noValidate onSubmit={handleSubmit}>
        <div>
          <h2 className="card__title">Your photo</h2>
          <p className="card__lede">JPEG or PNG, up to {MAX_MB} MB.</p>
        </div>

        <div className={`field${photoError ? ' field--invalid' : ''}`}>
          <input
            ref={inputRef}
            id="identify-photo"
            className="visually-hidden"
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            aria-describedby={photoError ? 'identify-photo-error' : undefined}
            aria-invalid={photoError ? true : undefined}
            onChange={(event) => choose(event.target.files[0])}
          />
          {previewUrl ? (
            <div className="photo-preview">
              <img src={previewUrl} alt="Your chosen photo" className="photo-preview__image" />
              <div className="photo-preview__bar">
                <span className="photo-preview__name">{file.name}</span>
                <span className="photo-preview__actions">
                  <label htmlFor="identify-photo" className="btn btn--quiet">
                    Change photo
                  </label>
                  <button type="button" className="btn btn--quiet" onClick={clearPhoto}>
                    Remove
                  </button>
                </span>
              </div>
            </div>
          ) : (
            <label
              htmlFor="identify-photo"
              className={`dropzone${dragging ? ' dropzone--active' : ''}`}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <span className="dropzone__icon">
                <Icon name="upload" size={24} />
              </span>
              <span className="dropzone__title">Choose a photo</span>
              <span className="dropzone__hint">or drag one here</span>
            </label>
          )}
          <FieldError id="identify-photo-error">{photoError}</FieldError>
        </div>

        <ChoiceGroup
          name="organ"
          legend="What does the photo show?"
          options={ORGANS}
          value={organ}
          onChange={setOrgan}
          layout="chips"
        />

        <FormAlert>{formError}</FormAlert>
        <SubmitButton pending={pending} pendingLabel="Identifying…">
          Identify plant
        </SubmitButton>
        <p className="form__note">
          <Icon name="shieldCheck" size={16} />
          Your photo is sent to Pl@ntNet to identify the species.
        </p>
      </form>

      <section className="workspace__output" aria-label="Identification results" aria-busy={pending}>
        {candidates ? <Result candidates={candidates} headingRef={resultsHeading} /> : <Tips />}
      </section>
    </div>
  )
}
