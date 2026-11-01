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
  locale,
  t,
}) {
  if (isLoading) {
    return (
      <div className={styles.result} aria-live="polite">
        <div className={styles.loading}>
          <span className={styles.spinner} aria-hidden="true" />
          {t('result.loading')}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${styles.result} ${styles.resultError}`} aria-live="polite">
        <p className={styles.errorTitle}>{t('result.errorTitle')}</p>
        <p className={styles.errorMessage}>
          {error.code ? t(error.code) : error.message}
        </p>
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          {t('result.retry')}
        </button>
      </div>
    )
  }

  if (!rateData) {
    return (
      <div className={styles.result} aria-live="polite">
        <p className={styles.placeholder}>
          {t('result.placeholder')}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.result} aria-live="polite">
      <p className={styles.resultLabel}>{t('result.label')}</p>

      <p className={styles.resultValue}>
        {isAmountValid ? formatCurrency(convertedAmount, toCurrency, locale) : '—'}
      </p>

      {!isAmountValid && (
        <p className={styles.resultMeta}>
          {t('result.amountError')}
        </p>
      )}

      <div className={styles.rateRow}>
        <span>
          {isSameCurrency
            ? t('result.sameCurrency')
            : t('chart.rate', {
                base: fromCurrency,
                rate: formatRate(rateData.rate, locale),
                quote: toCurrency,
              })}
        </span>

        {rateData.date ? (
          <span>
            {t('result.quoteDate', { date: formatDate(rateData.date, locale) })}
          </span>
        ) : (
          <span>{t('result.noConversion')}</span>
        )}
      </div>
    </div>
  )
}

export default ConversionResult
