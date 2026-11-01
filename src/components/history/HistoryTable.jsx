import { useMemo, useState } from 'react'
import {
  calculateConversion,
  formatDate,
  formatNumber,
  formatRate,
  isValidAmount,
  parseAmount,
} from '../../utils/currency.js'
import styles from './HistoryTable.module.css'

function escapeCsvField(value) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function HistoryTable({ points, base, quote, amount, periodId }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' })

  const visiblePoints = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')
    const filteredPoints = points.filter((point) => {
      if (!query) return true

      const localizedDate = formatDate(point.date).toLocaleLowerCase('pt-BR')
      return point.date.includes(query) || localizedDate.includes(query)
    })

    return [...filteredPoints].sort((first, second) => {
      const comparison =
        sort.key === 'date'
          ? first.date.localeCompare(second.date)
          : first.rate - second.rate

      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [points, search, sort])

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
      ['Data', 'Moeda de origem', 'Moeda de destino', 'Valor convertido', 'Taxa de câmbio'],
      ...visiblePoints.map((point) => {
        const convertedAmount = isValidAmount(numericAmount)
          ? calculateConversion(numericAmount, point.rate)
          : ''

        return [
          point.date,
          base,
          quote,
          convertedAmount === '' ? '' : formatNumber(convertedAmount),
          formatNumber(point.rate),
        ]
      }),
    ]

    const csv = `\uFEFF${rows.map((row) => row.map(escapeCsvField).join(';')).join('\r\n')}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `historico-cambio-${base.toLowerCase()}-${quote.toLowerCase()}-${periodId}.csv`
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
            Cotações no período
          </h3>
          <p className={styles.description}>
            {base} → {quote} · {visiblePoints.length} de {points.length} registros
          </p>
        </div>

        <div className={styles.actions}>
          <label className={styles.searchLabel}>
            Buscar data
            <input
              className={styles.searchInput}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="DD/MM/AAAA"
            />
          </label>
          <button
            type="button"
            className={styles.exportButton}
            onClick={exportCsv}
            disabled={visiblePoints.length === 0}
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {visiblePoints.length === 0 ? (
        <p className={styles.emptyState} role="status">
          Nenhuma cotação corresponde à busca.
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
                    aria-label={`Ordenar por data ${
                      sort.key === 'date' && sort.direction === 'asc'
                        ? 'decrescente'
                        : 'crescente'
                    }`}
                  >
                    Data{sortIndicator('date')}
                  </button>
                </th>
                <th scope="col">Par</th>
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
                    aria-label={`Ordenar por taxa ${
                      sort.key === 'rate' && sort.direction === 'asc'
                        ? 'decrescente'
                        : 'crescente'
                    }`}
                  >
                    Taxa{sortIndicator('rate')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {visiblePoints.map((point) => (
                <tr key={point.date}>
                  <td>{formatDate(point.date)}</td>
                  <td>
                    {base} → {quote}
                  </td>
                  <td className={styles.rateCell}>{formatRate(point.rate)}</td>
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
