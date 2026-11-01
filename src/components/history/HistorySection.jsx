import { useState } from 'react'
import {
  DEFAULT_HISTORY_PERIOD,
  HISTORY_PERIODS,
} from '../../constants/periods.js'
import { useHistoricalRates } from '../../hooks/useHistoricalRates.js'
import { useI18n } from '../../i18n/useI18n.js'
import { formatShortRange } from '../../utils/date.js'
import HistoryStats from './HistoryStats'
import HistoryTable from './HistoryTable'
import RateChart from './RateChart'
import styles from './HistorySection.module.css'

function HistorySection({ amount, fromCurrency, toCurrency }) {
  const { locale, t } = useI18n()
  const [periodId, setPeriodId] = useState(DEFAULT_HISTORY_PERIOD)

  const period =
    HISTORY_PERIODS.find((item) => item.id === periodId) ?? HISTORY_PERIODS[0]

  const { points, range, isLoading, error, retry, isSameCurrency } =
    useHistoricalRates(fromCurrency, toCurrency, period)

  const isLongRange = Boolean(period.years) && period.years >= 5

  return (
    <section className={styles.section} aria-labelledby="history-title">
      <div className={styles.header}>
        <div className={styles.intro}>
          <p className={styles.kicker}>{t('history.kicker')}</p>
          <h2 id="history-title" className={styles.title}>
            {t('history.title')}
          </h2>
          <p className={styles.subtitle}>
            {fromCurrency} → {toCurrency}
            {range ? ` · ${formatShortRange(range.from, range.to, locale)}` : ''}
            {period.group ? ` · ${t('history.monthlyData')}` : ''}
          </p>
        </div>

        <div
          className={styles.periods}
          role="group"
          aria-label={t('history.period')}
        >
          {HISTORY_PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.periodButton}
              aria-pressed={item.id === period.id}
              aria-label={t(`period.${item.id}`)}
              title={t(`period.${item.id}`)}
              onClick={() => setPeriodId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        {isSameCurrency && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>{t('history.chooseDifferent')}</p>
            <p className={styles.stateText}>
              {t('history.sameCurrency')}
            </p>
          </div>
        )}

        {!isSameCurrency && error && (
          <div className={styles.errorBox} role="alert">
            <p>{error.code ? t(error.code) : error.message}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={retry}
            >
              {t('history.retry')}
            </button>
          </div>
        )}

        {!isSameCurrency && !error && isLoading && (
          <div className={styles.loading} aria-live="polite" aria-busy="true">
            <span className={styles.spinner} aria-hidden="true" />
            {t('history.loading')}
          </div>
        )}

        {!isSameCurrency && !error && !isLoading && points.length === 0 && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>{t('history.noData')}</p>
            <p className={styles.stateText}>
              {t('history.noDataDescription')}
            </p>
          </div>
        )}

        {!isSameCurrency && !error && !isLoading && points.length > 0 && (
          <>
            <HistoryStats
              points={points}
              quote={toCurrency}
              isGrouped={Boolean(period.group)}
            />
            <RateChart
              points={points}
              base={fromCurrency}
              quote={toCurrency}
              isLongRange={isLongRange}
            />
            <HistoryTable
              points={points}
              base={fromCurrency}
              quote={toCurrency}
              amount={amount}
              periodId={period.id}
            />
          </>
        )}
      </div>

      <p className={styles.note}>
        {t('history.note')}
      </p>
    </section>
  )
}

export default HistorySection
