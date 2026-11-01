import Dashboard from './pages/Dashboard'
import Header from './components/layout/Header'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Dashboard />

      <footer className={styles.footer}>
        <span>Currency Exchange App</span>
        <span>React · Vite · Frankfurter API v2</span>
      </footer>
    </div>
  )
}

export default App
