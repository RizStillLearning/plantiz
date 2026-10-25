import { useEffect, useRef, useState } from 'react'
import Confidence from '../components/Confidence.jsx'
import ChoiceGroup from '../components/form/ChoiceGroup.jsx'
import { FormAlert, SubmitButton } from '../components/form/FormStatus.jsx'
import SelectField from '../components/form/SelectField.jsx'
import Icon from '../components/Icon.jsx'
import PlantFacts from '../components/PlantFacts.jsx'
import { recommendPlants } from '../lib/api.js'
import { SPACE_LEVELS, spaceForHeight } from '../lib/levels.js'
import { groupFact } from '../lib/plantFacts.jsx'
import { firstInvalid } from '../lib/validation.js'

const SETTINGS = [
  { value: 'indoor', label: 'Indoors', hint: 'A room, office or conservatory' },
  { value: 'outdoor', label: 'Outdoors', hint: 'A garden, yard, balcony or patio' },
]

const LIGHT = [
  { value: 'full sun', label: 'Full sun', hint: '6 or more hours of direct sun' },
  { value: 'partial shade', label: 'Partial shade', hint: '3 to 6 hours of direct sun' },
  { value: 'full shade', label: 'Full shade', hint: 'Under 3 hours of direct sun' },
  { value: 'bright indirect', label: 'Bright indirect', hint: 'Near a bright window, out of direct rays' },
  { value: 'medium indirect', label: 'Medium indirect', hint: 'A few steps back from a window' },
  { value: 'low light', label: 'Low light', hint: 'Far from windows or in a dim room' },
]

const WATER = [
  { value: 'low', label: 'Rarely', hint: 'Every week or two at most' },
  { value: 'moderate', label: 'About weekly', hint: 'When the topsoil dries out' },
  { value: 'high', label: 'Often', hint: 'Every few days' },
]

const CARE = [
  { value: 'easy', label: 'Keep it easy', hint: 'Forgiving plants' },
  { value: 'moderate', label: 'Some care is fine', hint: 'A little regular attention' },
  { value: 'challenging', label: 'I like a challenge', hint: 'Fussy but rewarding' },
]

const SPACE = SPACE_LEVELS.map(({ value, label, hint }) => ({ value, label, hint }))

const ZONES = [
  { value: '', label: 'Choose a zone' },
  ...Array.from({ length: 12 }, (_, index) => {
    const zone = index + 1
    const note = zone === 1 ? ' (coldest winters)' : zone === 12 ? ' (no frost)' : ''
    return { value: String(zone), label: `Zone ${zone}${note}` }
  }),
]

const FIELDS = ['setting', 'light', 'water', 'care_level', 'space', 'zone']

const EMPTY = { setting: '', light: '', water: '', care_level: '', space: '', zone: '', category: '' }

function validate(answers) {
  return {
    setting: answers.setting ? null : 'Choose where the plant will live.',
    light: answers.light ? null : 'Choose how much light the spot gets.',
    water: answers.water ? null : 'Choose how often you can water.',
    care_level: answers.care_level ? null : 'Choose how hands-on you want to be.',
    space: answers.space ? null : 'Choose how much room there is.',
    zone: answers.setting === 'outdoor' && !answers.zone ? 'Choose your hardiness zone.' : null,
  }
}

// Which facts agree with the answers, so each result can show why it fits.
function matchingFacts(plant, answers) {
  const zone = Number(answers.zone)
  return [
    plant.light.includes(answers.light) && 'light',
    plant.water === answers.water && 'water',
    plant.careLevel === answers.care_level && 'care',
    spaceForHeight(plant.heightFtMax) === answers.space && 'height',
    answers.setting === 'outdoor' &&
      (plant.zoneMin === null || (plant.zoneMin <= zone && zone <= plant.zoneMax)) &&
      'hardiness',
    answers.category && plant.category === answers.category && 'group',
  ].filter(Boolean)
}

function HowItWorks() {
  const steps = [
    {
      title: 'Your answers become a profile',
      text: 'Light and plant group are encoded as categories; water, care and size as ordered levels.',
    },
    {
      title: 'Every plant is compared',
      text: 'Plants that cannot survive indoors, outdoors or in your zone, or that are not the kind you asked for, are set aside. The rest are compared with your profile by cosine similarity.',
    },
    {
      title: 'The closest five are shown',
      text: 'A k-nearest-neighbours search picks the five plants closest to your profile. The confidence score is how closely each one matches your answers, from 0 to 100%.',
    },
  ]
  return (
    <div className="panel-dark how-it-works">
      <div>
        <h2 className="panel-dark__title">How matching works</h2>
        <p className="panel-dark__lede">Your matches will appear here.</p>
      </div>
      <ol className="steps" role="list">
        {steps.map(({ title, text }, index) => (
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

function Results({ results, answers, headingRef }) {
  if (results.length === 0) {
    return (
      <div className="results">
        <h2 className="results__title" tabIndex={-1} ref={headingRef}>
          No matches yet
        </h2>
        <p className="results__lede">
          No plant in the library can live in that combination. Try another hardiness zone, a different
          light level, or any kind of plant.
        </p>
      </div>
    )
  }

  return (
    <div className="results">
      <h2 className="results__title" tabIndex={-1} ref={headingRef}>
        Your top {results.length === 1 ? 'match' : `${results.length} matches`}
      </h2>
      <p className="results__lede">
        Ranked by confidence: how closely each plant&rsquo;s needs match your answers.
      </p>
      <ol className="matches" role="list">
        {results.map(({ plant, confidence }, index) => (
          <li key={plant.id} className="match card">
            <div className="match__head">
              <span className="match__rank" aria-hidden="true">
                {index + 1}
              </span>
              <div className="match__names">
                <h3 className="match__name">{plant.commonName}</h3>
                <p className="match__botanical">{plant.botanicalName}</p>
              </div>
              <Confidence value={confidence} />
            </div>
            <PlantFacts
              plant={plant}
              extra={answers.category ? [groupFact(plant)] : []}
              matches={matchingFacts(plant, answers)}
            />
            <a className="text-link" href={`/plants#${plant.id}`}>
              Open in the plant library
              <Icon name="arrowRight" size={18} className="nudge" />
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function RecommendForm({ groups = [] }) {
  const [answers, setAnswers] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  const [outcome, setOutcome] = useState(null) // { results, answers } once submitted
  const settingRef = useRef(null)
  const lightRef = useRef(null)
  const waterRef = useRef(null)
  const careRef = useRef(null)
  const spaceRef = useRef(null)
  const zoneRef = useRef(null)
  const resultsHeading = useRef(null)

  // Move focus to the new results so keyboard and screen reader users land on them.
  useEffect(() => {
    if (outcome) resultsHeading.current?.focus()
  }, [outcome])

  const set = (field) => (value) => {
    setAnswers((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: null }))
  }

  function focusField(field) {
    const fieldRefs = {
      setting: settingRef,
      light: lightRef,
      water: waterRef,
      care_level: careRef,
      space: spaceRef,
      zone: zoneRef,
    }
    const target = fieldRefs[field].current
    if (target?.tagName === 'FIELDSET') target.querySelector('input').focus()
    else target?.focus()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    const found = validate(answers)
    setErrors(found)
    const invalid = firstInvalid(found, FIELDS)
    if (invalid) {
      focusField(invalid)
      return
    }

    const request = {
      setting: answers.setting,
      light: answers.light,
      water: answers.water,
      care_level: answers.care_level,
      space: answers.space,
      zone: answers.setting === 'outdoor' ? Number(answers.zone) : null,
      category: answers.category || null,
    }

    setPending(true)
    try {
      const results = await recommendPlants(request)
      setOutcome({ results, answers: { ...answers } })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setPending(false)
    }
  }

  const categoryOptions = [
    { value: '', label: 'Any kind of plant' },
    ...groups.map((group) => ({ value: group, label: group })),
  ]

  return (
    <div className="workspace">
      <form className="form card workspace__form" noValidate onSubmit={handleSubmit}>
        <div>
          <h2 className="card__title">Tell us about your space</h2>
          <p className="card__lede">All questions are required unless marked optional.</p>
        </div>

        <ChoiceGroup
          name="setting"
          legend="Where will the plant live?"
          options={SETTINGS}
          value={answers.setting}
          onChange={set('setting')}
          error={errors.setting}
          groupRef={settingRef}
        />

        {answers.setting === 'outdoor' && (
          <SelectField
            id="recommend-zone"
            label="Hardiness zone"
            hint="Your USDA zone. Lower numbers have colder winters."
            options={ZONES}
            value={answers.zone}
            onChange={(event) => set('zone')(event.target.value)}
            error={errors.zone}
            selectRef={zoneRef}
          />
        )}

        <ChoiceGroup
          name="light"
          legend="How much light does the spot get?"
          options={LIGHT}
          value={answers.light}
          onChange={set('light')}
          error={errors.light}
          groupRef={lightRef}
        />

        <ChoiceGroup
          name="water"
          legend="How often can you water?"
          options={WATER}
          value={answers.water}
          onChange={set('water')}
          error={errors.water}
          groupRef={waterRef}
          layout="row"
        />

        <ChoiceGroup
          name="care_level"
          legend="How hands-on do you want to be?"
          options={CARE}
          value={answers.care_level}
          onChange={set('care_level')}
          error={errors.care_level}
          groupRef={careRef}
          layout="row"
        />

        <ChoiceGroup
          name="space"
          legend="How much room is there?"
          hint="How tall the plant can grow."
          options={SPACE}
          value={answers.space}
          onChange={set('space')}
          error={errors.space}
          groupRef={spaceRef}
          layout="row"
        />

        <SelectField
          id="recommend-category"
          label="What kind of plant? (optional)"
          options={categoryOptions}
          value={answers.category}
          onChange={(event) => set('category')(event.target.value)}
        />

        <FormAlert>{formError}</FormAlert>
        <SubmitButton pending={pending} pendingLabel="Finding your matches…">
          Recommend Plants
        </SubmitButton>
      </form>

      <section className="workspace__output" aria-label="Recommendations" aria-busy={pending}>
        {outcome ? (
          <Results results={outcome.results} answers={outcome.answers} headingRef={resultsHeading} />
        ) : (
          <HowItWorks />
        )}
      </section>
    </div>
  )
}
