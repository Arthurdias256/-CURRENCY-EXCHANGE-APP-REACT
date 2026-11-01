import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getRate } from '../services/frankfurterApi.js'
import { useExchangeRate } from './useExchangeRate.js'

vi.mock('../services/frankfurterApi.js', () => ({
  getRate: vi.fn(),
}))

describe('useExchangeRate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(cleanup)

  it('returns a rate of one for identical currencies without requesting the API', () => {
    const { result } = renderHook(() => useExchangeRate('EUR', 'EUR'))

    expect(result.current).toMatchObject({
      rateData: { base: 'EUR', quote: 'EUR', rate: 1, date: null },
      isLoading: false,
      error: null,
      isSameCurrency: true,
    })
    expect(getRate).not.toHaveBeenCalled()
  })

  it('clears loading when a pending lookup is switched to the same currency', async () => {
    let resolveRate
    getRate.mockReturnValue(
      new Promise((resolve) => {
        resolveRate = resolve
      }),
    )

    const { result, rerender } = renderHook(
      ({ base, quote }) => useExchangeRate(base, quote),
      { initialProps: { base: 'USD', quote: 'BRL' } },
    )

    await waitFor(() => expect(getRate).toHaveBeenCalledOnce())
    expect(result.current.isLoading).toBe(true)

    rerender({ base: 'EUR', quote: 'EUR' })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.rateData.rate).toBe(1)

    await act(async () => {
      resolveRate({ base: 'USD', quote: 'BRL', rate: 5.2, date: '2026-10-30' })
    })
    expect(result.current.rateData).toMatchObject({ base: 'EUR', quote: 'EUR', rate: 1 })
  })

  it('returns the fetched rate for a different currency pair', async () => {
    getRate.mockResolvedValue({
      base: 'USD',
      quote: 'BRL',
      rate: 5.2,
      date: '2026-10-30',
    })

    const { result } = renderHook(() => useExchangeRate('USD', 'BRL'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.rateData).toMatchObject({
      base: 'USD',
      quote: 'BRL',
      rate: 5.2,
    })
    expect(getRate).toHaveBeenCalledWith('USD', 'BRL', {
      signal: expect.any(AbortSignal),
    })
  })
})
