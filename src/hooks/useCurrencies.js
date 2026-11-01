import { useEffect, useState } from 'react'
import { getCurrencies } from '../services/frankfurterApi.js'

export function useCurrencies() {
  const [currencies, setCurrencies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    async function loadCurrencies() {
      try {
        const data = await getCurrencies({ signal: controller.signal })

        if (isActive) {
          setCurrencies(data)
          setError(null)
        }
      } catch (requestError) {
        if (requestError.name === 'AbortError') return

        if (isActive) {
          setError(requestError)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadCurrencies()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [reloadToken])

  const retry = () => {
    setIsLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }

  return { currencies, isLoading, error, retry }
}
