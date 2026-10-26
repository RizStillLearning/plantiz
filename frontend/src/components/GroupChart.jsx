import { groups } from '../data/stats.js'
import { formatNumber, formatPercent } from '../lib/format.js'

// A real table under the bars, so the numbers don't depend on the drawing.
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
