import { cleanup, render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrencies } from '../../hooks/useCurrencies.js'
import { useExchangeRate } from '../../hooks/useExchangeRate.js'
import ConverterCard from './ConverterCard'

vi.mock('../../hooks/useCurrencies.js', () => ({
  useCurrencies: vi.fn(),
}))

vi.mock('../../hooks/useExchangeRate.js', () => ({
  useExchangeRate: vi.fn(),
}))

const currencies = [
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
]

const defaultProps = {
  amount: '2',
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  onAmountChange: vi.fn(),
  onFromChange: vi.fn(),
  onToChange: vi.fn(),
  onSwap: vi.fn(),
}

describe('ConverterCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCurrencies.mockReturnValue({
      currencies,
      isLoading: false,
      error: null,
      retry: vi.fn(),
    })
    useExchangeRate.mockReturnValue({
      rateData: { base: 'USD', quote: 'BRL', rate: 5.2, date: '2026-10-30' },
      isLoading: false,
      error: null,
      retry: vi.fn(),
      isSameCurrency: false,
    })
  })

  afterEach(cleanup)

  it('converts the entered amount using the selected currency rate', () => {
    render(<ConverterCard {...defaultProps} />)

    expect(screen.getByText(/10,40/)).toBeInTheDocument()
    expect(screen.getByText('1 USD = 5,20 BRL')).toBeInTheDocument()
  })

  it('shows validation feedback and omits the conversion for an invalid amount', () => {
    render(<ConverterCard {...defaultProps} amount="0" />)

    expect(screen.getByRole('textbox', { name: 'Valor' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Informe um valor maior que zero.',
    )
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('forwards amount changes and currency swapping to the parent', async () => {
    const user = userEvent.setup()
    render(<ConverterCard {...defaultProps} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Valor' }), {
      target: { value: '3,5' },
    })
    await user.selectOptions(screen.getByRole('combobox', { name: 'De' }), 'EUR')
    await user.click(screen.getByRole('button', { name: 'Inverter moedas' }))

    expect(defaultProps.onAmountChange).toHaveBeenLastCalledWith('3,5')
    expect(defaultProps.onFromChange).toHaveBeenCalledWith('EUR')
    expect(defaultProps.onSwap).toHaveBeenCalledOnce()
  })

  it('shows the same-currency result without a conversion rate date', () => {
    useExchangeRate.mockReturnValue({
      rateData: { base: 'USD', quote: 'USD', rate: 1, date: null },
      isLoading: false,
      error: null,
      retry: vi.fn(),
      isSameCurrency: true,
    })

    render(
      <ConverterCard
        {...defaultProps}
        fromCurrency="USD"
        toCurrency="USD"
      />,
    )

    expect(screen.getByText('Mesma moeda')).toBeInTheDocument()
    expect(screen.getByText('Sem conversão cambial')).toBeInTheDocument()
    expect(screen.getByText(/US\$[\s]*2,00/)).toBeInTheDocument()
  })

  it('offers retry when the rate lookup fails', async () => {
    const retry = vi.fn()
    useExchangeRate.mockReturnValue({
      rateData: null,
      isLoading: false,
      error: new Error('Falha de rede'),
      retry,
      isSameCurrency: false,
    })
    const user = userEvent.setup()
    render(<ConverterCard {...defaultProps} />)

    expect(screen.getByText('Falha de rede')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(retry).toHaveBeenCalledOnce()
  })
})
