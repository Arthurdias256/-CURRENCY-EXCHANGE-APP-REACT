import { formatDate, formatPercent, formatRate } from '../../utils/currency.js'
import styles from './HistoryStats.module.css'

function findExtreme(points, mode) {
  return points.reduce((extreme, point) => {
    if (!extreme) return point

    const isBetter =
      mode === 'min' ? point.rate < extreme.rate : point.rate > extreme.rate

    return isBetter ? point : extreme
  }, null)
}

function HistoryStats({ points, quote, isGrouped }) {
  const first = points[0]
  const last = points[points.length - 1]
  const minPoint = findExtreme(points, 'min')
  const maxPoint = findExtreme(points, 'max')

  const variation =
    first && first.rate !== 0
      ? ((last.rate - first.rate) / first.rate) * 100
      : null

  const variationClass =
    variation === null || variation === 0
      ? ''
      : variation > 0
        ? styles.up
        : styles.down

  return (
    <ul className={styles.stats} aria-label="Resumo do período">
      <li className={styles.card}>
        <span className={styles.label}>
          {isGrouped ? 'Último dado' : 'Última cotação'}
        </span>
        <span className={styles.value}>
          {formatRate(last.rate)} <small>{quote}</small>
        </span>
        <span className={styles.meta}>{formatDate(last.date)}</span>
      </li>

      <li className={styles.card}>
        <span className={styles.label}>Mínima</span>
        <span className={styles.value}>
          {formatRate(minPoint.rate)} <small>{quote}</small>
        </span>
        <span className={styles.meta}>{formatDate(minPoint.date)}</span>
      </li>

      <li className={styles.card}>
        <span className={styles.label}>Máxima</span>
        <span className={styles.value}>
          {formatRate(maxPoint.rate)} <small>{quote}</small>
        </span>
        <span className={styles.meta}>{formatDate(maxPoint.date)}</span>
      </li>

      <li className={styles.card}>
        <span className={styles.label}>Variação no período</span>
        <span className={`${styles.value} ${variationClass}`}>
          {variation !== null && variation !== 0 && (
            <span className={styles.arrow} aria-hidden="true">
              {variation > 0 ? '▲' : '▼'}
            </span>
          )}
          {formatPercent(variation)}
        </span>
        <span className={styles.meta}>Primeiro ao último dia</span>
      </li>
    </ul>
  )
}

export default HistoryStats
