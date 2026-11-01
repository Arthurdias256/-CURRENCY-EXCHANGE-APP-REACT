import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatAxisRate, formatDate, formatRate } from '../../utils/currency.js'
import { formatAxisDate } from '../../utils/date.js'
import { useI18n } from '../../i18n/useI18n.js'
import styles from './RateChart.module.css'

function ChartTooltip({ active, payload, base, quote, locale, t }) {
  if (!active || !payload?.length) return null

  const point = payload[0].payload

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{formatDate(point.date, locale)}</p>
      <p className={styles.tooltipValue}>
        <strong>
          {t('chart.rate', {
            base,
            rate: formatRate(point.rate, locale),
            quote,
          })}
        </strong>
      </p>
    </div>
  )
}

function RateChart({ points, base, quote, isLongRange }) {
  const { locale, t } = useI18n()
  return (
    <div
      className={styles.chart}
      role="img"
      aria-label={t('chart.label', { base, quote })}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 12, right: 16, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="historyRateFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-accent)"
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor="var(--color-accent)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />

          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              formatAxisDate(date, isLongRange, locale)
            }
            minTickGap={28}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
          />

          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(rate) => formatAxisRate(rate, locale)}
            width={64}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
          />

          <Tooltip
            content={
              <ChartTooltip base={base} quote={quote} locale={locale} t={t} />
            }
            cursor={{
              stroke: 'var(--color-chart-cursor)',
              strokeDasharray: '4 4',
            }}
          />

          <Area
            type="monotone"
            dataKey="rate"
            stroke="var(--color-accent)"
            strokeWidth={2}
            fill="url(#historyRateFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RateChart
