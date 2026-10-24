import { describedBy } from '../../lib/a11y.js'
import { FieldError } from './TextField.jsx'

// A radio group drawn as cards. The native radio stays visible inside each
// card, so keyboard and screen reader behaviour is the browser's own.
export default function ChoiceGroup({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  error,
  groupRef,
  layout = 'grid',
}) {
  const hintId = hint ? `${name}-hint` : null
  const errorId = error ? `${name}-error` : null
  return (
    <fieldset
      ref={groupRef}
      className={`choice-group choice-group--${layout}${error ? ' choice-group--invalid' : ''}`}
      aria-describedby={describedBy(hintId, errorId)}
    >
      <legend className="field__label">{legend}</legend>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      <div className="choice-group__options">
        {options.map((option) => (
          <label key={option.value} className="choice">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="choice__text">
              <span className="choice__label">{option.label}</span>
              {option.hint && <span className="choice__hint">{option.hint}</span>}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </fieldset>
  )
}
