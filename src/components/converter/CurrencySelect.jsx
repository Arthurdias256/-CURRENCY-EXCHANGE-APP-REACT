import { useEffect, useMemo, useRef, useState } from 'react'
import { MAIN_CURRENCY_CODES } from '../../constants/currencies.js'
import { useI18n } from '../../i18n/useI18n.js'
import {
  getCountryName,
  getCurrencyFlag,
  getCurrencyFlagImageUrl,
} from '../../utils/currencyFlags.js'
import styles from './CurrencySelect.module.css'

function CurrencyFlag({ code, countryName }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = getCurrencyFlagImageUrl(code)

  if (!imageUrl || imageFailed) {
    return (
      <span className={styles.flagFallback} aria-hidden="true">
        {getCurrencyFlag(code)}
      </span>
    )
  }

  return (
    <img
      className={styles.flag}
      src={imageUrl}
      alt=""
      aria-hidden="true"
      loading="lazy"
      onError={() => setImageFailed(true)}
      title={countryName ?? code}
    />
  )
}

function CurrencySelect({
  id,
  label,
  value,
  onChange,
  currencies,
  isLoading = false,
  disabled = false,
}) {
  const { locale, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCode, setActiveCode] = useState(value)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const searchRef = useRef(null)
  const optionRefs = useRef(new Map())

  const currencyNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: 'currency' }),
    [locale],
  )
  const mainCurrencies = currencies.filter((currency) =>
    MAIN_CURRENCY_CODES.includes(currency.code),
  )
  const otherCurrencies = currencies.filter(
    (currency) => !MAIN_CURRENCY_CODES.includes(currency.code),
  )
  const currencyLabels = useMemo(
    () =>
      new Map(
        currencies.map((currency) => [
          currency.code,
          currencyNames.of(currency.code) ?? currency.name,
        ]),
      ),
    [currencies, currencyNames],
  )
  const normalizedSearch = search.trim().toLocaleLowerCase(locale)
  const matchesSearch = (currency) =>
    !normalizedSearch ||
    `${currency.code} ${currencyLabels.get(currency.code)}`
      .toLocaleLowerCase(locale)
      .includes(normalizedSearch)
  const filteredMainCurrencies = mainCurrencies.filter(matchesSearch)
  const filteredOtherCurrencies = otherCurrencies.filter(matchesSearch)
  const selectedCurrency = currencies.find(
    (currency) => currency.code === value,
  )
  const selectedName = selectedCurrency
    ? currencyLabels.get(selectedCurrency.code)
    : null
  const activeOptions = [...filteredMainCurrencies, ...filteredOtherCurrencies]

  useEffect(() => {
    if (!isOpen) return undefined

    searchRef.current?.focus()

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const openMenu = () => {
    setSearch('')
    setActiveCode(value)
    setIsOpen(true)
  }

  const selectCurrency = (currencyCode) => {
    onChange(currencyCode)
    setIsOpen(false)
    setSearch('')
    triggerRef.current?.focus()
  }

  const focusOption = (index) => {
    const boundedIndex = Math.max(0, Math.min(index, activeOptions.length - 1))
    const option = activeOptions[boundedIndex]

    if (!option) return

    setActiveCode(option.code)
    optionRefs.current.get(option.code)?.focus()
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openMenu()
    }
  }

  const handleOptionKeyDown = (event, currencyCode) => {
    const currentIndex = activeOptions.findIndex(
      (currency) => currency.code === currencyCode,
    )

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(currentIndex + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (currentIndex === 0) searchRef.current?.focus()
      else focusOption(currentIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusOption(activeOptions.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectCurrency(currencyCode)
    }
  }

  const renderCurrencyOption = (currency) => {
    const countryName = getCountryName(currency.code, locale)

    return (
      <button
        key={currency.code}
        ref={(element) => {
          if (element) optionRefs.current.set(currency.code, element)
          else optionRefs.current.delete(currency.code)
        }}
        id={`${id}-option-${currency.code}`}
        type="button"
        role="option"
        className={styles.option}
        aria-selected={currency.code === value}
        onFocus={() => setActiveCode(currency.code)}
        onKeyDown={(event) => handleOptionKeyDown(event, currency.code)}
        onClick={() => selectCurrency(currency.code)}
      >
        <CurrencyFlag
          key={currency.code}
          code={currency.code}
          countryName={countryName}
        />
        <span className={styles.optionText}>
          <strong>{currency.code}</strong>
          <span>{currencyLabels.get(currency.code)}</span>
        </span>
        {currency.code === value && (
          <svg
            className={styles.selectedMark}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m4 10 4 4 8-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={styles.selectWrapper} ref={containerRef}>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          className={styles.select}
          aria-label={label}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-options`}
          aria-activedescendant={isOpen ? `${id}-option-${activeCode}` : undefined}
          disabled={disabled}
          onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
          onKeyDown={handleTriggerKeyDown}
        >
          {selectedCurrency ? (
            <>
              <CurrencyFlag
                key={selectedCurrency.code}
                code={selectedCurrency.code}
                countryName={getCountryName(selectedCurrency.code, locale)}
              />
              <span className={styles.selectedText}>
                <strong>{selectedCurrency.code}</strong>
                <span>{selectedName}</span>
              </span>
            </>
          ) : (
            <span className={styles.placeholder}>
              {isLoading ? t('currency.loading') : t('currency.unavailable')}
            </span>
          )}

          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
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
        </button>

        {isOpen && (
          <div className={styles.menu}>
            <label className={styles.searchLabel}>
              <span className={styles.srOnly}>{t('currency.search')}</span>
              <input
                ref={searchRef}
                className={styles.searchInput}
                type="search"
                value={search}
                placeholder={t('currency.search')}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setActiveCode('')
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    focusOption(0)
                  }
                }}
              />
            </label>

            {currencies.length === 0 ? (
              <p className={styles.emptyState} role="status">
                {isLoading
                  ? t('currency.loading')
                  : t('currency.unavailable')}
              </p>
            ) : activeOptions.length === 0 ? (
              <p className={styles.emptyState} role="status">
                {t('currency.noMatches')}
              </p>
            ) : (
              <div
                id={`${id}-options`}
                className={styles.options}
                role="listbox"
                aria-label={label}
              >
                {filteredMainCurrencies.length > 0 && (
                  <div
                    className={styles.optionGroup}
                    role="group"
                    aria-label={t('currency.main')}
                  >
                    <span className={styles.groupLabel}>
                      {t('currency.main')}
                    </span>
                    {filteredMainCurrencies.map(renderCurrencyOption)}
                  </div>
                )}
                {filteredOtherCurrencies.length > 0 && (
                  <div
                    className={styles.optionGroup}
                    role="group"
                    aria-label={t('currency.all')}
                  >
                    <span className={styles.groupLabel}>
                      {t('currency.all')}
                    </span>
                    {filteredOtherCurrencies.map(renderCurrencyOption)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrencySelect
