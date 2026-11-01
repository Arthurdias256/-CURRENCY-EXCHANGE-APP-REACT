import { lazy, Suspense, useState } from 'react'
import ConverterCard from '../components/converter/ConverterCard'
import styles from './Dashboard.module.css'

const HistorySection = lazy(
  () => import('../components/history/HistorySection'),
)

function Dashboard() {
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
          <p className={styles.eyebrow}>Projeto acadêmico · SPA em React</p>

          <h1 id="hero-title" className={styles.heading}>
            Câmbio claro,
            <br />
            <span className={styles.highlight}>decisões melhores.</span>
          </h1>

          <p className={styles.lead}>
            Converta valores com a cotação mais recente da Frankfurter e consulte
            a taxa efetiva de cada par de moedas.
          </p>

          <ul className={styles.facts} aria-label="Informações da API">
            <li className={styles.fact}>
              <strong>170</strong>
              <span>moedas disponíveis</span>
            </li>
            <li className={styles.fact}>
              <strong>Diária</strong>
              <span>atualização das taxas</span>
            </li>
            <li className={styles.fact}>
              <strong>Sem chave</strong>
              <span>acesso à API</span>
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
            aria-label="Carregando histórico"
          />
        }
      >
        <HistorySection fromCurrency={fromCurrency} toCurrency={toCurrency} />
      </Suspense>
    </main>
  )
}

export default Dashboard
