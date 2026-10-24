import { useState } from 'react'
import { describedBy } from '../../lib/a11y.js'
import Icon from '../Icon.jsx'

export function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="field__error">
      <Icon name="alert" size={16} />
      {children}
    </p>
  )
}

export default function TextField({ id, label, hint, error, inputRef, children, ...inputProps }) {
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
        <input
          id={id}
          ref={inputRef}
          className="input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(hintId, errorId)}
          {...inputProps}
        />
        {children}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  )
}

export function PasswordField(props) {
  const [visible, setVisible] = useState(false)
  return (
    <TextField {...props} type={visible ? 'text' : 'password'} className="input input--with-action">
      <button
        type="button"
        className="field__action"
        aria-pressed={visible}
        aria-controls={props.id}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? 'Hide' : 'Show'}
        <span className="visually-hidden"> password</span>
      </button>
    </TextField>
  )
}
