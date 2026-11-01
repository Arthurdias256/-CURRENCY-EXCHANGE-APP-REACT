const LOCALE = 'pt-BR'

export function parseAmount(rawValue) {
  if (typeof rawValue === 'number') return rawValue
  if (typeof rawValue !== 'string') return Number.NaN

  const cleaned = rawValue.trim().replace(/\s/g, '').replace(/[^\d.,-]/g, '')

  if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === ',') {
    return Number.NaN
  }

  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')
  let normalized = cleaned

  if (hasComma && hasDot) {
    const lastComma = cleaned.lastIndexOf(',')
    const lastDot = cleaned.lastIndexOf('.')

    normalized =
      lastComma > lastDot
        ? cleaned.replace(/\./g, '').replace(',', '.')
        : cleaned.replace(/,/g, '')
  } else if (hasComma) {
    normalized = cleaned.replace(',', '.')
  }

  const value = Number(normalized)
  return Number.isFinite(value) ? value : Number.NaN
}

export function isValidAmount(value) {
  return Number.isFinite(value) && value > 0
}

export function calculateConversion(amount, rate) {
  if (!Number.isFinite(amount) || !Number.isFinite(rate)) return null
  return amount * rate
}

export function formatNumber(value) {
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 4,
  }).format(value)
}

export function formatCurrency(value, currencyCode) {
  if (!Number.isFinite(value)) return '—'

  const isSmallValue = Math.abs(value) > 0 && Math.abs(value) < 0.01
  const options = {
    style: 'currency',
    currency: currencyCode,
    ...(isSmallValue
      ? { minimumFractionDigits: 8, maximumFractionDigits: 8 }
      : {}),
  }

  try {
    return new Intl.NumberFormat(LOCALE, options).format(value)
  } catch {
    return `${formatNumber(value)} ${currencyCode}`
  }
}

export function formatRate(value) {
  const isSmallRate = Math.abs(value) > 0 && Math.abs(value) < 0.01

  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: isSmallRate ? 8 : 2,
    maximumFractionDigits: isSmallRate ? 8 : 6,
  }).format(value)
}

export function formatAxisRate(value) {
  if (!Number.isFinite(value)) return ''

  const magnitude = Math.abs(value)
  const maximumFractionDigits =
    magnitude >= 100 ? 0 : magnitude >= 10 ? 1 : magnitude >= 1 ? 2 : magnitude >= 0.01 ? 4 : 8

  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits,
  }).format(value)
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) return '—'

  return `${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value)}%`
}

export function formatDate(isoDate) {
  if (!isoDate) return ''

  const date = new Date(`${isoDate}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
