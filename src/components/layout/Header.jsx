import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="/" aria-label="Currency Exchange App — início">
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h13l-3.2-3.2M20 17H7l3.2 3.2"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className={styles.brandText}>
            <span className={styles.title}>Currency Exchange</span>
            <span className={styles.subtitle}>Conversão e análise de moedas</span>
          </span>
        </a>

        <div className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          Projeto em desenvolvimento
        </div>
      </div>
    </header>
  )
}

export default Header
