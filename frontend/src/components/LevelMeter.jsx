// Hidden from screen readers: the word next to it says the same thing.
export default function LevelMeter({ levels, value }) {
  const filled = levels.indexOf(value) + 1
  return (
    <span className="level-meter" aria-hidden="true">
      {levels.map((level, index) => (
        <span
          key={level}
          className={`level-meter__step${index < filled ? ' level-meter__step--on' : ''}`}
        />
      ))}
    </span>
  )
}
