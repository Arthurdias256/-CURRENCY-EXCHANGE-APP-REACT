import { useLayoutEffect, useMemo, useState } from 'react'
import { DEFAULT_LANGUAGE, DEFAULT_THEME, I18nContext } from './I18nContext.js'
import { LANGUAGES, translate } from './translations.js'

const LANGUAGE_STORAGE_KEY = 'currency-exchange-language'
const THEME_STORAGE_KEY = 'currency-exchange-theme'
function getStoredLanguage() {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return LANGUAGES.some(({ code }) => code === storedLanguage)
    ? storedLanguage
    : DEFAULT_LANGUAGE
}

function getStoredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : DEFAULT_THEME
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getStoredLanguage)
  const [theme, setTheme] = useState(getStoredTheme)
  const locale =
    LANGUAGES.find((item) => item.code === language)?.locale ?? 'pt-BR'

  useLayoutEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [language, locale, theme])

  const value = useMemo(
    () => ({
      language,
      locale,
      theme,
      setLanguage,
      toggleTheme: () =>
        setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
      t: (key, values) => translate(language, key, values),
    }),
    [language, locale, theme],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
