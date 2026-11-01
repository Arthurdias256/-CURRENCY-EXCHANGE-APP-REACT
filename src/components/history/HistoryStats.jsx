import { formatDate, formatPercent, formatRate } from '../../utils/currency.js'
import { useI18n } from '../../i18n/useI18n.js'
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
  const { locale, t } = useI18n()
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
    <ul className={styles.stats} aria-label={t('history.statsLabel')}>
      <li className={styles.card}>
        <span className={styles.label}>
          {isGrouped ? t('history.lastData') : t('history.latestQuote')}
        </span>
        <span className={styles.value}>
          {formatRate(last.rate, locale)} <small>{quote}</small>
        </span>
        <span className={styles.meta}>{formatDate(last.date, locale)}</span>
      </li>

      <li className={styles.card}>
        <span className={styles.label}>{t('history.minimum')}</span>
        <span className={styles.value}>
          {formatRate(minPoint.rate, locale)} <small>{quote}</small>
        </span>
        <span className={styles.meta}>{formatDate(minPoint.date, locale)}</span>
      </li>

      <li className={styles.card}>
        <span className={styles.label}>{t('history.maximum')}</span>
        <span className={styles.value}>
          {formatRate(maxPoint.rate, locale)} <small>{quote}</small>
        </span>
        <span className={styles.meta}>{formatDate(maxPoint.date, locale)}</span>
      </li>

      <li className={styles.card}>
        <span className={styles.label}>{t('history.variation')}</span>
        <span className={`${styles.value} ${variationClass}`}>
          {variation !== null && variation !== 0 && (
            <span className={styles.arrow} aria-hidden="true">
              {variation > 0 ? '▲' : '▼'}
            </span>
          )}
          {formatPercent(variation, locale)}
        </span>
        <span className={styles.meta}>{t('history.firstToLast')}</span>
      </li>
    </ul>
  )
}

export default HistoryStats
