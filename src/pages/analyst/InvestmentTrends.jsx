import { useEffect, useMemo, useState } from 'react'
import AnalystLayout from '../../layouts/AnalystLayout'
import { getAnalystAnalytics } from '../../services/backendService'
import { TrendingUp, Download } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function InvestmentTrends() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    getAnalystAnalytics().then(setAnalytics).catch(() => setAnalytics(null))
  }, [])

  const sipVsLumpsum = analytics?.sipVsLumpsum || []
  const categoryFlow = analytics?.categoryFlow || []
  const ageBehavior = analytics?.ageBehavior || []
  const fundGrowth = analytics?.fundGrowth || []
  const summary = analytics?.summary || {}

  const totalInvestments = Number(summary.totalInvestments || 0)
  const monthGrowth = Number(summary.monthGrowthPercent || 0)
  const sipGrowth = useMemo(() => {
    if (sipVsLumpsum.length < 2) return 0
    const first = Number(sipVsLumpsum[0].sip || 0)
    const last = Number(sipVsLumpsum[sipVsLumpsum.length - 1].sip || 0)
    if (!first) return 0
    return ((last - first) / first) * 100
  }, [sipVsLumpsum])

  const mostPopular = useMemo(() => {
    if (categoryFlow.length === 0) return { name: 'N/A', value: 0 }
    const totals = { 'Large Cap': 0, 'Mid Cap': 0, 'Small Cap': 0, Debt: 0 }
    categoryFlow.forEach((row) => {
      totals['Large Cap'] += Number(row.largeCap || 0)
      totals['Mid Cap'] += Number(row.midCap || 0)
      totals['Small Cap'] += Number(row.smallCap || 0)
      totals.Debt += Number(row.debt || 0)
    })
    const entries = Object.entries(totals)
    const best = entries.reduce((acc, cur) => (cur[1] > acc[1] ? cur : acc), ['N/A', 0])
    return { name: best[0], value: best[1] }
  }, [categoryFlow])

  const exportReport = () => {
    const rows = [
      ['Month', 'SIP (₹000s)', 'Lumpsum (₹000s)'],
      ...sipVsLumpsum.map(r => [r.month, r.sip, r.lumpsum])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'investment_trends.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnalystLayout>
      <div className="an-page-header">
        <h2 className="an-page-title" style={{ margin: 0 }}><span className="ui-title-row"><TrendingUp className="ui-title-icon" />Investment Trends Analysis</span></h2>
        <button className="an-btn-outline" onClick={exportReport}><span className="ui-btn-content"><Download className="ui-btn-icon" />Export Report</span></button>
      </div>

      {/* Stat Cards */}
      <div className="an-stat-grid">
        {[
          { label: 'Total Investments', value: `₹${totalInvestments.toLocaleString('en-IN')}`, sub: `${monthGrowth.toFixed(1)}% MoM`, subColor: '#7B1D1D' },
          { label: 'SIP Growth',         value: `${sipGrowth.toFixed(1)}%`, sub: 'Last 6 months', subColor: '#7B1D1D' },
          { label: 'Most Popular',       value: mostPopular.name, sub: `₹${Math.round(mostPopular.value).toLocaleString('en-IN')}`, subColor: '#888' },
          { label: 'Active Investors',   value: String(summary.activeInvestors || 0), sub: 'Registered investors', subColor: '#888' },
        ].map(s => (
          <div className="an-stat-card" key={s.label}>
            <p className="an-stat-label">{s.label}</p>
            <p className="an-stat-value" style={{ fontSize: '1.3rem' }}>{s.value}</p>
            <p className="an-stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* SIP vs Lumpsum Line */}
      <div className="an-card">
        <h3 className="an-card-title">SIP vs Lumpsum Investment Trend</h3>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={sipVsLumpsum} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={60} />
            <Tooltip formatter={(v, n) => [`₹${v.toLocaleString()}`, n]} />
            <Legend />
            <Line type="monotone" dataKey="sip"     name="SIP Investments (₹000s)"     stroke="#7B1D1D" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="lumpsum" name="Lumpsum Investments (₹000s)"  stroke="#C9A84C" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category-wise Investment Flow */}
      <div className="an-card">
        <h3 className="an-card-title">Category-wise Investment Flow (in ₹000s)</h3>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={categoryFlow} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={45} />
            <Tooltip />
            <Legend />
            <Bar dataKey="largeCap" name="Large Cap" fill="#7B1D1D" radius={[2,2,0,0]} />
            <Bar dataKey="midCap"   name="Mid Cap"   fill="#C9A84C" radius={[2,2,0,0]} />
            <Bar dataKey="smallCap" name="Small Cap" fill="#e05252" radius={[2,2,0,0]} />
            <Bar dataKey="debt"     name="Debt"      fill="#555"    radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Age Group Behavior */}
      <div className="an-card">
        <h3 className="an-card-title">Investor Behavior by Age Group (SIP vs Lumpsum %)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={ageBehavior} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="age" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={35} />
            <Tooltip formatter={v => `${v}%`} />
            <Legend />
            <Bar dataKey="sip"     name="SIP %"     fill="#7B1D1D" radius={[3,3,0,0]} />
            <Bar dataKey="lumpsum" name="Lumpsum %"  fill="#C9A84C" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AUM + Investor Growth Line */}
      <div className="an-card">
        <h3 className="an-card-title">AUM & Investor Growth (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={fundGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left"  tick={{ fontSize: 11 }} width={55} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={55} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left"  type="monotone" dataKey="aum"       name="AUM (₹ Cr)"   stroke="#7B1D1D" strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="investors" name="Total Investors" stroke="#C9A84C" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalystLayout>
  )
}
