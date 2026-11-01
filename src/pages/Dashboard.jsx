import { lazy, Suspense, useState } from 'react'
import ConverterCard from '../components/converter/ConverterCard'
import { useI18n } from '../i18n/useI18n.js'
import styles from './Dashboard.module.css'

const HistorySection = lazy(
  () => import('../components/history/HistorySection'),
)

function Dashboard() {
  const { t } = useI18n()
  const [amount, setAmount] = useState('1')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>

          <h1 id="hero-title" className={styles.heading}>
            {t('hero.titleFirst')}
            <br />
            <span className={styles.highlight}>{t('hero.titleSecond')}</span>
          </h1>

          <p className={styles.lead}>{t('hero.lead')}</p>

          <ul className={styles.facts} aria-label={t('hero.apiInfo')}>
            <li className={styles.fact}>
              <strong>170</strong>
              <span>{t('hero.currencyCount')}</span>
            </li>
            <li className={styles.fact}>
              <strong>{t('hero.daily')}</strong>
              <span>{t('hero.rateUpdate')}</span>
            </li>
            <li className={styles.fact}>
              <strong>{t('hero.noKey')}</strong>
              <span>{t('hero.apiAccess')}</span>
            </li>
          </ul>
        </div>

        <ConverterCard
          amount={amount}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          onAmountChange={setAmount}
          onFromChange={setFromCurrency}
          onToChange={setToCurrency}
          onSwap={handleSwap}
        />
      </section>

      <Suspense
        fallback={
          <div
            className={styles.historySkeleton}
            role="status"
            aria-label={t('app.loadingHistory')}
          />
        }
      >
        <HistorySection
          amount={amount}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
        />
      </Suspense>
    </main>
  )
}

export default Dashboard
