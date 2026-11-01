import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTimeSeries } from '../services/frankfurterApi.js'
import { useHistoricalRates } from './useHistoricalRates.js'

vi.mock('../services/frankfurterApi.js', () => ({
  getTimeSeries: vi.fn(),
}))

const monthlyPeriod = { id: '5y', years: 5, group: 'month' }
const points = [
  { date: '2024-01-01', rate: 1.1 },
  { date: '2024-02-01', rate: 1.2 },
]

describe('useHistoricalRates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(cleanup)

  it('loads grouped historical rates for the selected pair and period', async () => {
    getTimeSeries.mockResolvedValue(points)

    const { result } = renderHook(() =>
      useHistoricalRates('USD', 'EUR', monthlyPeriod),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.points).toEqual(points)
    expect(result.current.range).toMatchObject({
      from: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      to: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    })
    expect(getTimeSeries).toHaveBeenCalledWith(
      'USD',
      'EUR',
      expect.objectContaining({
        from: result.current.range.from,
        to: result.current.range.to,
        group: 'month',
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('skips the history request when the currencies are identical', () => {
    const { result } = renderHook(() =>
      useHistoricalRates('EUR', 'EUR', monthlyPeriod),
    )

    expect(result.current).toMatchObject({
      points: [],
      range: null,
      isLoading: false,
      error: null,
      isSameCurrency: true,
    })
    expect(getTimeSeries).not.toHaveBeenCalled()
  })

  it('allows retrying after the history request fails', async () => {
    getTimeSeries
      .mockRejectedValueOnce(new Error('Falha ao carregar histórico'))
      .mockResolvedValueOnce(points)

    const { result } = renderHook(() =>
      useHistoricalRates('USD', 'EUR', monthlyPeriod),
    )

    await waitFor(() =>
      expect(result.current.error?.message).toBe('Falha ao carregar histórico'),
    )

    act(() => result.current.retry())

    await waitFor(() => expect(result.current.points).toEqual(points))
    expect(result.current.error).toBeNull()
    expect(getTimeSeries).toHaveBeenCalledTimes(2)
  })
})
