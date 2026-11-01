import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Header from '../components/layout/Header.jsx'
import { I18nProvider } from './I18nProvider.jsx'

describe('language and theme preferences', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.lang = 'pt-BR'
    document.documentElement.dataset.theme = 'dark'
  })

  afterEach(cleanup)

  it('switches the interface between Portuguese, English, and Spanish', () => {
    render(
      <I18nProvider>
        <Header />
      </I18nProvider>,
    )

    const languageSelect = screen.getByRole('combobox', { name: 'Idioma' })

    fireEvent.change(languageSelect, { target: { value: 'en' } })
    expect(screen.getByText('Currency conversion and analysis')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en-US')
    expect(window.localStorage.getItem('currency-exchange-language')).toBe('en')

    fireEvent.change(languageSelect, { target: { value: 'es' } })
    expect(screen.getByText('Conversión y análisis de divisas')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('es-ES')
    expect(window.localStorage.getItem('currency-exchange-language')).toBe('es')
  })

  it('toggles and persists light and dark themes', () => {
    render(
      <I18nProvider>
        <Header />
      </I18nProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ativar tema claro' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('currency-exchange-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('currency-exchange-theme')).toBe('dark')
  })
})
