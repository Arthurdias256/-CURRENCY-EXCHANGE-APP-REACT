import { useEffect, useState } from 'react'
import { getRate } from '../services/frankfurterApi.js'

export function useExchangeRate(base, quote) {
  const [rateData, setRateData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  const isSameCurrency = Boolean(base) && base === quote

  useEffect(() => {
    if (!base || !quote || base === quote) return

    const controller = new AbortController()
    let isActive = true

    async function loadRate() {
      try {
        const data = await getRate(base, quote, { signal: controller.signal })

        if (isActive) {
          setRateData(data)
          setError(null)
        }
      } catch (requestError) {
        if (requestError.name === 'AbortError') return

        if (isActive) {
          setError(requestError)
          setRateData(null)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadRate()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [base, quote, reloadToken])

  const retry = () => {
    setIsLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }

  const effectiveRateData = isSameCurrency
    ? { base, quote, rate: 1, date: null }
    : rateData

  const isCurrentRate =
    effectiveRateData?.base === base && effectiveRateData?.quote === quote

  const isPending = !isSameCurrency && !isCurrentRate && !error

  return {
    rateData: effectiveRateData,
    isLoading: isLoading || isPending,
    error,
    retry,
    isSameCurrency,
  }
}
