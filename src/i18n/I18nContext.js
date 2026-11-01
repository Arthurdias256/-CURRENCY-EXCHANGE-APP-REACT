import { createContext } from 'react'
import { translate } from './translations.js'

export const DEFAULT_LANGUAGE = 'pt-BR'
export const DEFAULT_THEME = 'dark'

export const I18nContext = createContext({
  language: DEFAULT_LANGUAGE,
  locale: 'pt-BR',
  theme: DEFAULT_THEME,
  setLanguage: () => {},
  toggleTheme: () => {},
  t: (key, values) => translate(DEFAULT_LANGUAGE, key, values),
})
