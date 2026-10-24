import { formatPercent } from '../lib/format.js'

// A confidence score as a number plus a meter. The meter is decoration for the
// number beside it, so it is hidden from screen readers.
export default function Confidence({ value, size = 'md' }) {
  return (
    <div className={`confidence confidence--${size}`}>
      <p className="confidence__reading">
        <span className="confidence__value">{formatPercent(value)}</span>
        <span className="confidence__label">confidence</span>
      </p>
      <span className="confidence__track" aria-hidden="true">
        <span className="confidence__fill" style={{ '--confidence': value }} />
      </span>
    </div>
  )
}
