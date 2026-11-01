import { useMemo, useState } from 'react'
import {
  calculateConversion,
  formatDate,
  formatNumber,
  formatRate,
  isValidAmount,
  parseAmount,
} from '../../utils/currency.js'
import { useI18n } from '../../i18n/useI18n.js'
import styles from './HistoryTable.module.css'

function escapeCsvField(value) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function HistoryTable({ points, base, quote, amount, periodId }) {
  const { locale, t } = useI18n()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' })

  const visiblePoints = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(locale)
    const filteredPoints = points.filter((point) => {
      if (!query) return true

      const localizedDate = formatDate(point.date, locale).toLocaleLowerCase(locale)
      return point.date.includes(query) || localizedDate.includes(query)
    })

    return [...filteredPoints].sort((first, second) => {
      const comparison =
        sort.key === 'date'
          ? first.date.localeCompare(second.date)
          : first.rate - second.rate

      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [locale, points, search, sort])

  const toggleSort = (key) => {
    setSort((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return { key, direction: key === 'date' ? 'desc' : 'asc' }
    })
  }

  const sortIndicator = (key) => {
    if (sort.key !== key) return ''
    return sort.direction === 'asc' ? ' ↑' : ' ↓'
  }

  const exportCsv = () => {
    const numericAmount = parseAmount(amount)
    const rows = [
      [
        t('csv.date'),
        t('csv.from'),
        t('csv.to'),
        t('csv.converted'),
        t('csv.rate'),
      ],
      ...visiblePoints.map((point) => {
        const convertedAmount = isValidAmount(numericAmount)
          ? calculateConversion(numericAmount, point.rate)
          : ''

        return [
          point.date,
          base,
          quote,
          convertedAmount === '' ? '' : formatNumber(convertedAmount, locale),
          formatNumber(point.rate, locale),
        ]
      }),
    ]

    const csv = `\uFEFF${rows.map((row) => row.map(escapeCsvField).join(';')).join('\r\n')}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${t('csv.filename')}-${base.toLowerCase()}-${quote.toLowerCase()}-${periodId}.csv`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
  }

  return (
    <section className={styles.section} aria-labelledby="history-table-title">
      <div className={styles.header}>
        <div>
          <h3 id="history-table-title" className={styles.title}>
            {t('table.title')}
          </h3>
          <p className={styles.description}>
            {base} → {quote} ·{' '}
            {t('table.records', {
              visible: visiblePoints.length,
              total: points.length,
            })}
          </p>
        </div>

        <div className={styles.actions}>
          <label className={styles.searchLabel}>
            {t('table.search')}
            <input
              className={styles.searchInput}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('table.searchPlaceholder')}
            />
          </label>
          <button
            type="button"
            className={styles.exportButton}
            onClick={exportCsv}
            disabled={visiblePoints.length === 0}
          >
            {t('table.export')}
          </button>
        </div>
      </div>

      {visiblePoints.length === 0 ? (
        <p className={styles.emptyState} role="status">
          {t('table.empty')}
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  scope="col"
                  aria-sort={
                    sort.key === 'date'
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => toggleSort('date')}
                    aria-label={t('table.sortDate', {
                      direction:
                        sort.key === 'date' && sort.direction === 'asc'
                          ? t('table.descending')
                          : t('table.ascending'),
                    })}
                  >
                    {t('table.date')}{sortIndicator('date')}
                  </button>
                </th>
                <th scope="col">{t('table.pair')}</th>
                <th
                  scope="col"
                  aria-sort={
                    sort.key === 'rate'
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => toggleSort('rate')}
                    aria-label={t('table.sortRate', {
                      direction:
                        sort.key === 'rate' && sort.direction === 'asc'
                          ? t('table.descending')
                          : t('table.ascending'),
                    })}
                  >
                    {t('table.rate')}{sortIndicator('rate')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {visiblePoints.map((point) => (
                <tr key={point.date}>
                  <td>{formatDate(point.date, locale)}</td>
                  <td>
                    {base} → {quote}
                  </td>
                  <td className={styles.rateCell}>
                    {formatRate(point.rate, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default HistoryTable
