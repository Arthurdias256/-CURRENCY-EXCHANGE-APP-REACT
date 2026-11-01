function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Calcula o intervalo de datas de um período a partir de hoje.
 * Usa datas locais para não deslocar o dia em fusos negativos.
 */
export function getPeriodRange(period, referenceDate = new Date()) {
  const end = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  )
  const start = new Date(end)

  if (period.days) start.setDate(start.getDate() - period.days)
  if (period.months) start.setMonth(start.getMonth() - period.months)
  if (period.years) start.setFullYear(start.getFullYear() - period.years)

  return { from: toIsoDate(start), to: toIsoDate(end) }
}

export function formatAxisDate(
  isoDate,
  isLongRange = false,
  locale = 'pt-BR',
) {
  if (!isoDate) return ''

  const date = new Date(`${isoDate}T00:00:00Z`)
  const options = isLongRange
    ? { month: '2-digit', year: 'numeric', timeZone: 'UTC' }
    : { day: '2-digit', month: '2-digit', timeZone: 'UTC' }
  return new Intl.DateTimeFormat(locale, options).format(date)
}

export function formatShortRange(from, to, locale = 'pt-BR') {
  if (!from || !to) return ''

  const startDate = new Date(`${from}T00:00:00Z`)
  const endDate = new Date(`${to}T00:00:00Z`)
  const sameYear = from.slice(0, 4) === to.slice(0, 4)
  const startOptions = {
    day: '2-digit',
    month: '2-digit',
    ...(!sameYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  }
  const endOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }
  const separator = locale === 'en-US' ? 'to' : 'a'

  return `${new Intl.DateTimeFormat(locale, startOptions).format(startDate)} ${separator} ${new Intl.DateTimeFormat(locale, endOptions).format(endDate)}`
}
