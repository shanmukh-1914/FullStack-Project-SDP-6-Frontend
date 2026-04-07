import { useEffect, useMemo, useState } from 'react'
import AnalystLayout from '../../layouts/AnalystLayout'
import { getAnalystAnalytics } from '../../services/backendService'
import { Activity, Download } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function FundPerformance() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    getAnalystAnalytics().then(setAnalytics).catch(() => setAnalytics(null))
  }, [])

  const perfTrend = analytics?.fundPerformanceTrend || []
  const riskReturn = analytics?.riskReturn || []

  const bestPerformer = useMemo(
    () => riskReturn.reduce((best, row) => (!best || row.returns > best.returns ? row : best), null),
    [riskReturn],
  )
  const mostStable = useMemo(
    () => riskReturn.reduce((best, row) => (!best || row.volatility < best.volatility ? row : best), null),
    [riskReturn],
  )
  const avgVolatility = useMemo(() => {
    if (riskReturn.length === 0) return 0
    return riskReturn.reduce((sum, r) => sum + Number(r.volatility || 0), 0) / riskReturn.length
  }, [riskReturn])

  const exportData = () => {
    const rows = [
      ['Category', 'Returns (%)', 'Volatility (%)'],
      ...riskReturn.map(r => [r.category, r.returns, r.volatility])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'fund_performance.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnalystLayout>
      <div className="an-page-header">
        <h2 className="an-page-title" style={{ margin: 0 }}><span className="ui-title-row"><Activity className="ui-title-icon" />Fund Performance Analysis</span></h2>
        <button className="an-btn-outline" onClick={exportData}><span className="ui-btn-content"><Download className="ui-btn-icon" />Export Data</span></button>
      </div>

      {/* Stat Cards */}
      <div className="an-stat-grid">
        {[
          { label: 'Best Performer', value: bestPerformer?.category || 'N/A',   sub: `${bestPerformer?.returns ?? 0}%`, subColor: '#7B1D1D' },
          { label: 'Most Stable',    value: mostStable?.category || 'N/A',      sub: `${mostStable?.volatility ?? 0}%`, subColor: '#888' },
          { label: 'Avg Volatility', value: 'Market-wide',                    sub: `${avgVolatility.toFixed(1)}%`, subColor: '#888' },
          { label: 'Total Funds',    value: String(riskReturn.length),          sub: 'Analyzed', subColor: '#888' },
        ].map(s => (
          <div className="an-stat-card" key={s.label}>
            <p className="an-stat-label">{s.label}</p>
            <p className="an-stat-value" style={{ fontSize: '1.25rem' }}>{s.value}</p>
            <p className="an-stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Category-wise Performance Trend */}
      <div className="an-card">
        <h3 className="an-card-title">Category-wise Performance Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={perfTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 25]} tick={{ fontSize: 11 }} width={35} />
            <Tooltip formatter={v => `${v}%`} />
            <Legend />
            <Line type="monotone" dataKey="largeCap"  name="Large Cap"  stroke="#7B1D1D" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="midCap"    name="Mid Cap"    stroke="#C9A84C" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="smallCap"  name="Small Cap"  stroke="#e05252" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="debt"      name="Debt"       stroke="#555"    strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk vs Return Bar */}
      <div className="an-card">
        <h3 className="an-card-title">Risk vs Return Analysis</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={riskReturn} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={35} />
            <Tooltip formatter={v => `${v}%`} />
            <Legend />
            <Bar dataKey="returns"    name="Returns (%)"    fill="#7B1D1D" radius={[3,3,0,0]} />
            <Bar dataKey="volatility" name="Volatility (%)" fill="#C9A84C" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalystLayout>
  )
}
