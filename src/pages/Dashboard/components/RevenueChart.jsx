import { useState } from 'react'
import { revenueChartSeries } from '../dashboard.data'

const TABS = ['أسبوعي', 'شهري', 'سنوي']

export default function RevenueChart() {
  const [activeTab, setActiveTab] = useState('أسبوعي')
  const data = revenueChartSeries[activeTab]
  const max  = Math.max(...data.map((d) => d.value))

  const W = 560; const H = 240
  const PAD_L = 52; const PAD_R = 16; const PAD_T = 28; const PAD_B = 44
  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const barW  = Math.min(38, (plotW / data.length) * 0.52)
  const step  = plotW / data.length
  const fmt   = (v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}م` : `${Math.round(v / 1000)}k`
  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="panel dashboard-panel dashboard-revenue-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">الإيرادات</div>
          <div className="panel-sub">آخر 7 أيام · الرياض فقط</div>
        </div>
        <div className="panel-tabs">
          {TABS.map((t) => (
            <div key={t} className={`panel-tab${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}>{t}</div>
          ))}
        </div>
      </div>

      <div className="panel-body dashboard-chart-body" style={{ padding: '20px 20px 8px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }} direction="ltr">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-l)" />
              <stop offset="100%" stopColor="var(--brand-d)" />
            </linearGradient>
            <linearGradient id="barGradHL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4fc3a1" />
              <stop offset="100%" stopColor="var(--brand)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((r) => {
            const y = PAD_T + plotH * (1 - r)
            return (
              <g key={r}>
                <line
                  x1={PAD_L} x2={W - PAD_R} y1={y} y2={y}
                  stroke={r === 0 ? 'var(--ink-25)' : 'var(--line)'}
                  strokeWidth={r === 0 ? 1.5 : 1}
                  strokeDasharray={r === 0 ? 'none' : '3 5'}
                />
                {r > 0 && (
                  <text x={PAD_L - 8} y={y + 4} textAnchor="end"
                    fontSize="10" fill="var(--ink-45)" fontFamily="monospace">
                    {fmt(max * r)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const barH = Math.max(4, (d.value / max) * plotH)
            const x    = PAD_L + i * step + (step - barW) / 2
            const y    = PAD_T + plotH - barH
            const isHL = !!d.highlight

            return (
              <g key={d.day}>
                {/* Track */}
                <rect
                  x={x} y={PAD_T} width={barW} height={plotH}
                  rx="8"
                  fill={isHL ? 'rgba(15,107,92,.08)' : 'rgba(10,31,27,.04)'}
                />
                {/* Fill */}
                <rect
                  x={x} y={y} width={barW} height={barH}
                  rx="8"
                  fill={isHL ? 'url(#barGradHL)' : 'url(#barGrad)'}
                  opacity={isHL ? 1 : 0.7}
                />
                {/* Top value bubble on highlighted */}
                {isHL && (
                  <g>
                    <rect x={x - 8} y={y - 22} width={barW + 16} height={18} rx="5"
                      fill="var(--brand-d)" />
                    <text x={x + barW / 2} y={y - 9} textAnchor="middle"
                      fontSize="10" fontWeight="700" fill="#fff">
                      {fmt(d.value)}
                    </text>
                  </g>
                )}
                {/* Day label */}
                <text
                  x={x + barW / 2} y={H - 10} textAnchor="middle"
                  fontSize="11"
                  fill={isHL ? 'var(--brand-d)' : 'var(--ink-45)'}
                  fontWeight={isHL ? '700' : '400'}
                >
                  {d.day}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
