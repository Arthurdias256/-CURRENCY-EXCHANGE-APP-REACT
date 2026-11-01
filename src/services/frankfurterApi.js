import { API_BASE_URL } from '../constants/api.js'

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getErrorMessage(status) {
  switch (status) {
    case 400:
      return 'A consulta enviada à API é inválida.'
    case 404:
      return 'Não há cotação disponível para este par de moedas.'
    case 422:
      return 'Uma das moedas selecionadas não está disponível para cotação.'
    default:
      return 'Não foi possível concluir a consulta à API Frankfurter.'
  }
}

async function request(path, { signal } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error

    throw new ApiError(
      'Não foi possível conectar à API Frankfurter. Verifique sua conexão e tente novamente.',
    )
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response.status), response.status)
  }

  return data
}

function normalizeCurrencies(data) {
  if (!Array.isArray(data)) {
    throw new ApiError('A API retornou a lista de moedas em um formato inesperado.')
  }

  const seen = new Set()

  return data
    .filter((currency) => currency?.iso_code && currency?.name)
    .map((currency) => ({
      code: currency.iso_code,
      name: currency.name,
      symbol: currency.symbol || currency.iso_code,
    }))
    .filter((currency) => {
      if (seen.has(currency.code)) return false
      seen.add(currency.code)
      return true
    })
    .sort((first, second) => first.code.localeCompare(second.code))
}

let currenciesCache = null

export async function getCurrencies({ signal } = {}) {
  if (currenciesCache) return currenciesCache

  const data = await request('/currencies', { signal })
  currenciesCache = normalizeCurrencies(data)

  return currenciesCache
}

export async function getRate(base, quote, { signal } = {}) {
  const data = await request(
    `/rate/${encodeURIComponent(base)}/${encodeURIComponent(quote)}`,
    { signal },
  )

  if (!data || typeof data.rate !== 'number') {
    throw new ApiError('A API retornou a cotação em um formato inesperado.')
  }

  return {
    base: data.base,
    quote: data.quote,
    rate: data.rate,
    date: data.date,
  }
}

export async function getTimeSeries(base, quote, { from, to, group, signal } = {}) {
  const searchParams = new URLSearchParams({
    from,
    to,
    base,
    quotes: quote,
  })

  if (group) searchParams.set('group', group)

  const data = await request(`/rates?${searchParams.toString()}`, { signal })

  if (!Array.isArray(data)) {
    throw new ApiError('A API retornou o histórico em um formato inesperado.')
  }

  return data
    .filter((point) => point?.date && Number.isFinite(point.rate))
    .map((point) => ({ date: point.date, rate: point.rate }))
    .sort((first, second) => first.date.localeCompare(second.date))
}
