import Header from './components/layout/Header'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <Header />

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
              Uma aplicação para converter moedas, acompanhar cotações históricas e
              analisar a variação cambial com dados reais da Frankfurter.
            </p>

            <p className={styles.note}>
              A interface de conversão e a integração com a API serão implementadas
              na próxima etapa. Nenhuma cotação simulada é exibida aqui.
            </p>
          </div>

          <aside className={styles.panel} aria-labelledby="setup-title">
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>Base do projeto</span>
              <span className={styles.panelBadge}>Setup</span>
            </div>

            <h2 id="setup-title" className={styles.panelTitle}>
              Ambiente pronto
            </h2>

            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.check} aria-hidden="true" />
                <span className={styles.itemText}>
                  <strong className={styles.itemTitle}>React 19 + Vite 8</strong>
                  <span className={styles.itemDetail}>
                    Ambiente de desenvolvimento configurado
                  </span>
                </span>
              </li>

              <li className={styles.listItem}>
                <span className={styles.check} aria-hidden="true" />
                <span className={styles.itemText}>
                  <strong className={styles.itemTitle}>CSS Modules</strong>
                  <span className={styles.itemDetail}>
                    Estilos isolados por componente
                  </span>
                </span>
              </li>

              <li className={styles.listItem}>
                <span className={styles.check} aria-hidden="true" />
                <span className={styles.itemText}>
                  <strong className={styles.itemTitle}>Frankfurter API v2</strong>
                  <span className={styles.itemDetail}>
                    Integração prevista para a próxima etapa
                  </span>
                </span>
              </li>
            </ul>

            <p className={styles.panelFooter}>
              <span className={styles.pulse} aria-hidden="true" />
              Próxima etapa: conversor com dados reais
            </p>
          </aside>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Currency Exchange App</span>
        <span>React · Vite · Frankfurter API v2</span>
      </footer>
    </div>
  )
}

export default App
