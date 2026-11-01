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

export function formatAxisDate(isoDate, isLongRange = false) {
  if (!isoDate) return ''

  const [year, month, day] = isoDate.split('-')

  return isLongRange ? `${month}/${year}` : `${day}/${month}`
}

export function formatShortRange(from, to) {
  if (!from || !to) return ''

  const [fromYear, fromMonth, fromDay] = from.split('-')
  const [toYear, toMonth, toDay] = to.split('-')

  const start =
    fromYear === toYear
      ? `${fromDay}/${fromMonth}`
      : `${fromDay}/${fromMonth}/${fromYear}`

  return `${start} a ${toDay}/${toMonth}/${toYear}`
}
