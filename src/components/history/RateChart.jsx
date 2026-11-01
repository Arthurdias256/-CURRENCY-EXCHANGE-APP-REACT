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
import styles from './RateChart.module.css'

function ChartTooltip({ active, payload, base, quote }) {
  if (!active || !payload?.length) return null

  const point = payload[0].payload

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{formatDate(point.date)}</p>
      <p className={styles.tooltipValue}>
        1 {base} ={' '}
        <strong>
          {formatRate(point.rate)} {quote}
        </strong>
      </p>
    </div>
  )
}

function RateChart({ points, base, quote, isLongRange }) {
  return (
    <div
      className={styles.chart}
      role="img"
      aria-label={`Gráfico de evolução da taxa de câmbio de ${base} para ${quote}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 12, right: 16, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="historyRateFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#56e0c0" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#56e0c0" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />

          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatAxisDate(date, isLongRange)}
            minTickGap={28}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#9aabc2', fontSize: 11 }}
          />

          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={formatAxisRate}
            width={64}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#9aabc2', fontSize: 11 }}
          />

          <Tooltip
            content={<ChartTooltip base={base} quote={quote} />}
            cursor={{ stroke: 'rgba(148, 163, 184, 0.28)', strokeDasharray: '4 4' }}
          />

          <Area
            type="monotone"
            dataKey="rate"
            stroke="#56e0c0"
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
