import { useState } from 'react'
import {
  DEFAULT_HISTORY_PERIOD,
  HISTORY_PERIODS,
} from '../../constants/periods.js'
import { useHistoricalRates } from '../../hooks/useHistoricalRates.js'
import { formatShortRange } from '../../utils/date.js'
import HistoryStats from './HistoryStats'
import RateChart from './RateChart'
import styles from './HistorySection.module.css'

function HistorySection({ fromCurrency, toCurrency }) {
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
          <p className={styles.kicker}>Histórico</p>
          <h2 id="history-title" className={styles.title}>
            Evolução da taxa
          </h2>
          <p className={styles.subtitle}>
            {fromCurrency} → {toCurrency}
            {range ? ` · ${formatShortRange(range.from, range.to)}` : ''}
            {period.group ? ' · dados mensais' : ''}
          </p>
        </div>

        <div
          className={styles.periods}
          role="group"
          aria-label="Período do histórico"
        >
          {HISTORY_PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.periodButton}
              aria-pressed={item.id === period.id}
              aria-label={item.description}
              title={item.description}
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
            <p className={styles.stateTitle}>Escolha duas moedas diferentes</p>
            <p className={styles.stateText}>
              Não há variação cambial quando a moeda de origem e a de destino são
              iguais.
            </p>
          </div>
        )}

        {!isSameCurrency && error && (
          <div className={styles.errorBox} role="alert">
            <p>{error.message}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={retry}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isSameCurrency && !error && isLoading && (
          <div className={styles.loading} aria-live="polite" aria-busy="true">
            <span className={styles.spinner} aria-hidden="true" />
            Carregando histórico...
          </div>
        )}

        {!isSameCurrency && !error && !isLoading && points.length === 0 && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>Sem dados no período</p>
            <p className={styles.stateText}>
              Não há cotações registradas para este par de moedas no intervalo
              selecionado.
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
          </>
        )}
      </div>

      <p className={styles.note}>
        Nos períodos de 5 e 10 anos a própria API agrupa os dados por mês para
        manter o gráfico legível. Nesses casos, o último ponto pode diferir da
        cotação atual. Fonte: Frankfurter API v2.
      </p>
    </section>
  )
}

export default HistorySection
