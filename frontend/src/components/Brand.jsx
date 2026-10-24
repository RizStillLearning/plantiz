import Icon from './Icon.jsx'

export default function Brand({ size = 'md' }) {
  return (
    <a className={`brand brand--${size}`} href="/">
      <span className="brand__mark">
        <Icon name="leaf" size={size === 'sm' ? 16 : 20} />
      </span>
      <span className="brand__name">Plantiz</span>
    </a>
  )
}
