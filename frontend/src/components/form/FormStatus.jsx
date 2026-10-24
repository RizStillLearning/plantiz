import Icon from '../Icon.jsx'

// Form-level error, announced as soon as it appears.
export function FormAlert({ children }) {
  return (
    <div className="form-alert" role="alert">
      {children && (
        <>
          <Icon name="alert" size={20} />
          <p>{children}</p>
        </>
      )}
    </div>
  )
}

export function SubmitButton({ pending, pendingLabel, children }) {
  return (
    <button type="submit" className="btn btn--primary btn--block" disabled={pending}>
      {pending ? pendingLabel : children}
      {!pending && <Icon name="arrowRight" size={18} className="nudge" />}
    </button>
  )
}
