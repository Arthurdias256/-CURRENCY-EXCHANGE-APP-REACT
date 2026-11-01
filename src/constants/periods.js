export const HISTORY_PERIODS = [
  { id: '7d', label: '7d', description: 'Últimos 7 dias', days: 7 },
  { id: '15d', label: '15d', description: 'Últimos 15 dias', days: 15 },
  { id: '30d', label: '30d', description: 'Últimos 30 dias', days: 30 },
  { id: '3m', label: '3m', description: 'Últimos 3 meses', months: 3 },
  { id: '6m', label: '6m', description: 'Últimos 6 meses', months: 6 },
  { id: '1y', label: '1y', description: 'Último 1 ano', years: 1 },
  { id: '5y', label: '5y', description: 'Últimos 5 anos', years: 5, group: 'month' },
  { id: '10y', label: '10y', description: 'Últimos 10 anos', years: 10, group: 'month' },
]

export const DEFAULT_HISTORY_PERIOD = '30d'
