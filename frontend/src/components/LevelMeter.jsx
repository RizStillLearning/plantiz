// A three-step scale drawn as segments. The word next to it says the same
// thing, so the drawing itself is hidden from screen readers.
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
