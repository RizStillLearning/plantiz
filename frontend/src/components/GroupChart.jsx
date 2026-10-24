import { groups } from '../data/stats.js'
import { formatNumber, formatPercent } from '../lib/format.js'

// Horizontal bars built on a real table, so the numbers stay readable without
// the drawing. Nominal categories, one series: every bar shares one color.
export default function GroupChart({ titleId }) {
  const largest = groups[0].count
  return (
    <table className="bar-table" aria-labelledby={titleId}>
      <thead className="visually-hidden">
        <tr>
          <th scope="col">Plant group</th>
          <th scope="col">Species</th>
        </tr>
      </thead>
      <tbody>
        {groups.map(({ name, count, share }) => (
          <tr key={name}>
            <th scope="row">{name}</th>
            <td>
              <span className="bar-table__cell">
                <span
                  className="bar-table__bar"
                  style={{ '--bar-scale': count / largest }}
                  aria-hidden="true"
                />
                <span className="bar-table__value">{formatNumber(count)}</span>
                <span className="bar-table__share">{formatPercent(share)}</span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
