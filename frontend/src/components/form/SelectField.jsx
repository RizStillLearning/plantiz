import { describedBy } from '../../lib/a11y.js'
import Icon from '../Icon.jsx'
import { FieldError } from './TextField.jsx'

// Works controlled (value + onChange, inside islands) or uncontrolled
// (defaultValue, in server-only pages enhanced by plain scripts).
export default function SelectField({ id, label, hint, error, options, selectRef, ...selectProps }) {
  const hintId = hint ? `${id}-hint` : null
  const errorId = error ? `${id}-error` : null
  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      <div className="field__control">
        <select
          id={id}
          ref={selectRef}
          className="input select"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(hintId, errorId)}
          {...selectProps}
        >
          {options.map(({ value, label: optionLabel }) => (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={18} className="select__chevron" />
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  )
}
