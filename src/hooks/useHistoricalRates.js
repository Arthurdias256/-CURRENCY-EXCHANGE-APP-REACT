import { useEffect, useState } from 'react'
import { getTimeSeries } from '../services/frankfurterApi.js'
import { getPeriodRange } from '../utils/date.js'

export function useHistoricalRates(base, quote, period) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  const isSameCurrency = Boolean(base) && base === quote
  const requestKey = `${base}:${quote}:${period.id}:${reloadToken}`

  useEffect(() => {
    if (!base || !quote || base === quote) return undefined

    const controller = new AbortController()
    const key = `${base}:${quote}:${period.id}:${reloadToken}`
    const { from, to } = getPeriodRange(period)
    let isActive = true

    async function loadSeries() {
      setError(null)

      try {
        const points = await getTimeSeries(base, quote, {
          from,
          to,
          group: period.group,
          signal: controller.signal,
        })

        if (isActive) {
          setResult({ key, points, range: { from, to } })
        }
      } catch (requestError) {
        if (requestError.name === 'AbortError') return

        if (isActive) {
          setError(requestError)
          setResult(null)
        }
      }
    }

    loadSeries()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [base, quote, period, reloadToken])

  const retry = () => {
    setError(null)
    setReloadToken((token) => token + 1)
  }

  const currentResult = result?.key === requestKey ? result : null
  const isPending = !isSameCurrency && !currentResult && !error

  return {
    points: currentResult?.points ?? [],
    range: currentResult?.range ?? null,
    isLoading: isPending,
    error,
    retry,
    isSameCurrency,
  }
}
