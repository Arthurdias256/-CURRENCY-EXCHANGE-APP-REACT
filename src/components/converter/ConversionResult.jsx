import { formatCurrency, formatDate, formatRate } from '../../utils/currency.js'
import styles from './ConversionResult.module.css'

function ConversionResult({
  convertedAmount,
  fromCurrency,
  toCurrency,
  rateData,
  isLoading,
  error,
  onRetry,
  isAmountValid,
  isSameCurrency,
}) {
  if (isLoading) {
    return (
      <div className={styles.result} aria-live="polite">
        <div className={styles.loading}>
          <span className={styles.spinner} aria-hidden="true" />
          Buscando cotação...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${styles.result} ${styles.resultError}`} aria-live="polite">
        <p className={styles.errorTitle}>Não foi possível obter a cotação</p>
        <p className={styles.errorMessage}>{error.message}</p>
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!rateData) {
    return (
      <div className={styles.result} aria-live="polite">
        <p className={styles.placeholder}>
          Selecione um par de moedas para consultar a cotação.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.result} aria-live="polite">
      <p className={styles.resultLabel}>Resultado</p>

      <p className={styles.resultValue}>
        {isAmountValid ? formatCurrency(convertedAmount, toCurrency) : '—'}
      </p>

      {!isAmountValid && (
        <p className={styles.resultMeta}>
          Informe um valor válido para converter.
        </p>
      )}

      <div className={styles.rateRow}>
        <span>
          {isSameCurrency
            ? 'Mesma moeda'
            : `1 ${fromCurrency} = ${formatRate(rateData.rate)} ${toCurrency}`}
        </span>

        {rateData.date ? (
          <span>Cotação de {formatDate(rateData.date)}</span>
        ) : (
          <span>Sem conversão cambial</span>
        )}
      </div>
    </div>
  )
}

export default ConversionResult
