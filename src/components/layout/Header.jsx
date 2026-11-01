import { LANGUAGES } from '../../i18n/translations.js'
import { useI18n } from '../../i18n/useI18n.js'
import styles from './Header.module.css'

function Header() {
  const { language, setLanguage, theme, toggleTheme, t } = useI18n()
  const nextThemeLabel =
    theme === 'dark' ? t('header.themeLight') : t('header.themeDark')

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="/" aria-label={t('header.home')}>
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
            <span className={styles.subtitle}>{t('header.subtitle')}</span>
          </span>
        </a>

        <div className={styles.actions}>
          <div className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {t('header.status')}
          </div>

          <label className={styles.languageControl}>
            <span className={styles.controlLabel}>{t('header.language')}</span>
            <select
              className={styles.languageSelect}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t('header.language')}
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={styles.themeButton}
            onClick={toggleTheme}
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {theme === 'dark' ? (
                <path
                  d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span>{theme === 'dark' ? t('header.light') : t('header.dark')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
