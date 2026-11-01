import Dashboard from './pages/Dashboard'
import Header from './components/layout/Header'
import { I18nProvider } from './i18n/I18nProvider.jsx'
import styles from './App.module.css'

function AppContent() {
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

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}

export default App
