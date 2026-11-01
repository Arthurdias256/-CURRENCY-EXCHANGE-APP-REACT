import { MAIN_CURRENCY_CODES } from '../../constants/currencies.js'
import styles from './CurrencySelect.module.css'

function CurrencySelect({
  id,
  label,
  value,
  onChange,
  currencies,
  isLoading = false,
  disabled = false,
}) {
  const mainCurrencies = currencies.filter((currency) =>
    MAIN_CURRENCY_CODES.includes(currency.code),
  )
  const otherCurrencies = currencies.filter(
    (currency) => !MAIN_CURRENCY_CODES.includes(currency.code),
  )

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={styles.selectWrapper}>
        <select
          id={id}
          className={styles.select}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
        >
          {currencies.length === 0 && (
            <option value={value}>
              {isLoading ? 'Carregando moedas...' : 'Moedas indisponíveis'}
            </option>
          )}

          {currencies.length > 0 && (
            <>
              <optgroup label="Moedas principais">
                {mainCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Todas as moedas">
                {otherCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </option>
                ))}
              </optgroup>
            </>
          )}
        </select>

        <svg
          className={styles.chevron}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default CurrencySelect
