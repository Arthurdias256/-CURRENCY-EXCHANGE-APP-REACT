import { useCurrencies } from '../../hooks/useCurrencies.js'
import { useExchangeRate } from '../../hooks/useExchangeRate.js'
import {
  calculateConversion,
  isValidAmount,
  parseAmount,
} from '../../utils/currency.js'
import ConversionResult from './ConversionResult'
import CurrencySelect from './CurrencySelect'
import styles from './ConverterCard.module.css'

function ConverterCard({
  amount,
  fromCurrency,
  toCurrency,
  onAmountChange,
  onFromChange,
  onToChange,
  onSwap,
}) {
  const {
    currencies,
    isLoading: isLoadingCurrencies,
    error: currenciesError,
    retry: retryCurrencies,
  } = useCurrencies()

  const {
    rateData,
    isLoading: isLoadingRate,
    error: rateError,
    retry: retryRate,
    isSameCurrency,
  } = useExchangeRate(fromCurrency, toCurrency)

  const numericAmount = parseAmount(amount)
  const isAmountValid = isValidAmount(numericAmount)
  const convertedAmount =
    isAmountValid && rateData
      ? calculateConversion(numericAmount, rateData.rate)
      : null

  const selectDisabled = isLoadingCurrencies || Boolean(currenciesError)

  return (
    <section className={styles.card} aria-labelledby="converter-title">
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Conversor</p>
          <h2 id="converter-title" className={styles.title}>
            Cotação em tempo real
          </h2>
        </div>

        <span className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Dados reais
        </span>
      </div>

      {currenciesError && (
        <div className={styles.errorBox} role="alert">
          <p>{currenciesError.message}</p>
          <button
            type="button"
            className={styles.inlineRetry}
            onClick={retryCurrencies}
          >
            Recarregar moedas
          </button>
        </div>
      )}

      <div className={styles.form}>
        <div className={styles.amountField}>
          <label className={styles.label} htmlFor="conversion-amount">
            Valor
          </label>

          <div className={styles.amountControl}>
            <span className={styles.amountPrefix}>{fromCurrency}</span>
            <input
              id="conversion-amount"
              className={styles.amountInput}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0,00"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              aria-invalid={!isAmountValid}
              aria-describedby={!isAmountValid ? 'amount-error' : undefined}
            />
          </div>

          {!isAmountValid && (
            <p id="amount-error" className={styles.fieldError} role="alert">
              Informe um valor maior que zero.
            </p>
          )}
        </div>

        <div className={styles.pairRow}>
          <CurrencySelect
            id="from-currency"
            label="De"
            value={fromCurrency}
            onChange={onFromChange}
            currencies={currencies}
            isLoading={isLoadingCurrencies}
            disabled={selectDisabled}
          />

          <button
            type="button"
            className={styles.swapButton}
            onClick={onSwap}
            aria-label="Inverter moedas"
            title="Inverter moedas"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 8h13l-3-3M19 16H6l3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <CurrencySelect
            id="to-currency"
            label="Para"
            value={toCurrency}
            onChange={onToChange}
            currencies={currencies}
            isLoading={isLoadingCurrencies}
            disabled={selectDisabled}
          />
        </div>
      </div>

      <p className={styles.hint}>
        A cotação é atualizada automaticamente ao alterar o valor ou o par de
        moedas.
      </p>

      <ConversionResult
        convertedAmount={convertedAmount}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        rateData={rateData}
        isLoading={isLoadingRate}
        error={rateError}
        onRetry={retryRate}
        isAmountValid={isAmountValid}
        isSameCurrency={isSameCurrency}
      />

      <div className={styles.footer}>
        <span>Fonte: Frankfurter API v2</span>
        <span>Taxa de referência</span>
      </div>
    </section>
  )
}

export default ConverterCard
