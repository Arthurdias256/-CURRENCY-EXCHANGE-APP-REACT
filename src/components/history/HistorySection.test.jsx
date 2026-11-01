import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHistoricalRates } from '../../hooks/useHistoricalRates.js'
import HistorySection from './HistorySection'

vi.mock('../../hooks/useHistoricalRates.js', () => ({
  useHistoricalRates: vi.fn(),
}))

vi.mock('./RateChart', () => ({
  default: () => <div aria-label="Gráfico de teste" />,
}))

describe('HistorySection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useHistoricalRates.mockReturnValue({
      points: [
        { date: '2026-10-29', rate: 5.2 },
        { date: '2026-10-30', rate: 5.3 },
      ],
      range: { from: '2026-10-01', to: '2026-10-30' },
      isLoading: false,
      error: null,
      retry: vi.fn(),
      isSameCurrency: false,
    })
  })

  afterEach(cleanup)

  it('loads the selected period and updates the active filter button', () => {
    render(<HistorySection amount="2" fromCurrency="USD" toCurrency="BRL" />)

    expect(screen.getByRole('button', { name: 'Últimos 30 dias' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Últimos 5 anos' }))

    expect(screen.getByRole('button', { name: 'Últimos 5 anos' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(useHistoricalRates).toHaveBeenLastCalledWith(
      'USD',
      'BRL',
      expect.objectContaining({ id: '5y', group: 'month' }),
    )
    expect(screen.getByText(/dados mensais/)).toBeInTheDocument()
  })
})
