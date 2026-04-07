import InvestorLayout from '../../layouts/InvestorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { LayoutDashboard, Briefcase, Target, TrendingUp, ChartColumn, PieChart as PieChartIcon, BarChart3, ShieldAlert, Inbox, BookOpenText } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
// Displays user dashboard with summary of investments and key metrics
// Fetches data from backend APIs and renders charts or statistics
const PIE_COLORS = ['#7B1D1D', '#C9A84C', '#333333', '#e06b6b', '#6b8ce0', '#6be0b5']

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  if (percent < 0.05) return null
  const r = innerRadius + (outerRadius - innerRadius) * 1.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#555" textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central" fontSize={12} fontWeight={500}>
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const TrendUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)

// Map category -> bucket for pie chart
const CAT_BUCKET = {
  'Large Cap': 'Equity', 'Mid Cap': 'Equity', 'Small Cap': 'Equity',
  'ELSS': 'Equity', 'Balanced': 'Balanced', 'Debt': 'Debt',
}

export default function Dashboard() {
  const { currentUser, investments, educationalContent } = useInvestments()

  // Derived stats
  const portfolio = investments.map((p) => ({ ...p, currentVal: p.current }))

  const totalInvested   = portfolio.reduce((s, p) => s + p.invested, 0)
  const totalCurrent    = portfolio.reduce((s, p) => s + p.currentVal, 0)
  const totalReturns    = totalCurrent - totalInvested
  const returnPct       = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : '0.0'

  // Pie: group by bucket
  const bucketMap = {}
  portfolio.forEach(p => {
    const bucket = CAT_BUCKET[p.category] || p.category
    bucketMap[bucket] = (bucketMap[bucket] || 0) + p.currentVal
  })
  const pieData = Object.entries(bucketMap).map(([name, value]) => ({ name, value }))

  // Risk assessment
  const highCount   = investments.filter(p => p.risk === 'High').length
  const lowCount    = investments.filter(p => p.risk === 'Low').length
  const totalFunds  = investments.length
  const riskScore   = totalFunds === 0 ? 0 : Math.round(((highCount * 3 + (totalFunds - highCount - lowCount) * 2 + lowCount) / (totalFunds * 3)) * 100)
  const riskLabel   = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : totalFunds === 0 ? 'N/A' : 'Low'
  const divScore    = Math.min(100, Math.round((totalFunds / 8) * 100))
  const divLabel    = divScore >= 70 ? 'Good' : divScore >= 40 ? 'Moderate' : totalFunds === 0 ? 'N/A' : 'Low'

  const hasInvestments = investments.length > 0
  const publishedContent = educationalContent
    .filter(article => article.status === 'Published')
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3)

  return (
    <InvestorLayout>
      <div style={{ marginBottom: '0.4rem' }}>
        <h2 className="inv-page-title" style={{ marginBottom: '0.1rem' }}>
          <span className="ui-title-row"><LayoutDashboard className="ui-title-icon" />Welcome{currentUser ? `, ${currentUser.fullName}` : ''}!</span>
        </h2>
        {currentUser && (
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: 0 }}>
            {currentUser.email} &nbsp;·&nbsp; {currentUser.role}
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="inv-stat-grid">
        {[
          { label: 'Total Portfolio Value', value: hasInvestments ? `₹${totalCurrent.toLocaleString('en-IN')}` : '₹0', sub: hasInvestments ? `+${returnPct}% overall` : 'No investments yet', subColor: hasInvestments ? '#7B1D1D' : '#888', icon: <Briefcase className="ui-title-icon" />, showTrend: hasInvestments },
          { label: 'Total Investment',      value: hasInvestments ? `₹${totalInvested.toLocaleString('en-IN')}` : '₹0', sub: hasInvestments ? `Across ${totalFunds} fund${totalFunds > 1 ? 's' : ''}` : 'Start investing today', subColor: '#888', icon: <Target className="ui-title-icon" />, showTrend: false },
          { label: 'Total Returns',         value: hasInvestments ? `₹${totalReturns.toLocaleString('en-IN')}` : '₹0', sub: hasInvestments ? `+${returnPct}%` : '—', subColor: hasInvestments ? '#7B1D1D' : '#888', icon: <TrendingUp className="ui-title-icon" />, showTrend: hasInvestments },
          { label: 'Active Funds',          value: String(totalFunds), sub: hasInvestments ? 'In your portfolio' : 'No active funds', subColor: '#888', icon: <ChartColumn className="ui-title-icon" />, showTrend: false },
        ].map(c => (
          <div className="inv-stat-card" key={c.label}>
            <div>
              <p className="inv-stat-label">{c.label}</p>
              <p className="inv-stat-value">{c.value}</p>
              <p className="inv-stat-sub" style={{ color: c.subColor }}>
                {c.showTrend && <TrendUp />} {c.sub}
              </p>
            </div>
            <span className="inv-stat-icon">{c.icon}</span>
          </div>
        ))}
      </div>

      {!hasInvestments ? (
        <div className="inv-card" style={{ marginTop: '1.2rem', padding: '3rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}><Inbox className="ui-title-icon" style={{ width: '42px', height: '42px' }} /></div>
          <h3 style={{ color: '#555', marginBottom: '0.5rem' }}>No investments yet</h3>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>
            Go to <strong>Mutual Funds</strong> and click <strong>View Details → Invest Now</strong> to start building your portfolio.
          </p>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="inv-charts-row">
            {/* Pie */}
            <div className="inv-card">
              <h3 className="inv-card-title"><span className="ui-title-row"><PieChartIcon className="ui-title-icon" />Asset Allocation</span></h3>
              <div className="pie-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80}
                      dataKey="value" labelLine={true} label={renderLabel}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <PieTooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pie-legend">
                {pieData.map((d, i) => (
                  <div className="pie-legend-item" key={d.name}>
                    <span className="pie-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span>{d.name}</span>
                    <span className="pie-legend-val">₹{d.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fund Breakdown Bar */}
            <div className="inv-card">
              <h3 className="inv-card-title"><span className="ui-title-row"><BarChart3 className="ui-title-icon" />Investment Breakdown by Fund</span></h3>
              <div style={{ overflowY: 'auto', maxHeight: '280px' }}>
                {portfolio.map(p => {
                  const pct = totalInvested > 0 ? ((p.invested / totalInvested) * 100).toFixed(1) : 0
                  const gain = p.currentVal - p.invested
                  return (
                    <div key={p.name} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, color: '#222' }}>{p.name}</span>
                        <span style={{ color: gain >= 0 ? '#7B1D1D' : '#e00', fontWeight: 600 }}>
                          {gain >= 0 ? '+' : ''}₹{gain.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888', marginBottom: '5px' }}>
                        <span>Invested: ₹{p.invested.toLocaleString('en-IN')}</span>
                        <span>{pct}% of portfolio</span>
                      </div>
                      <div className="risk-bar-bg">
                        <div className="risk-bar" style={{ width: `${pct}%`, background: '#7B1D1D' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="inv-card" style={{ marginTop: '1.2rem' }}>
            <h3 className="inv-card-title"><span className="ui-title-row"><ShieldAlert className="ui-title-icon" />Portfolio Risk Assessment</span></h3>
            <div className="risk-grid">
              <div className="risk-item">
                <div className="risk-row">
                  <span className="risk-label">Overall Risk Level</span>
                  <span className="risk-val">{riskLabel}</span>
                </div>
                <div className="risk-bar-bg"><div className="risk-bar" style={{ width: `${riskScore}%`, background: '#7B1D1D' }} /></div>
              </div>
              <div className="risk-item">
                <div className="risk-row">
                  <span className="risk-label">Portfolio Value</span>
                  <span className="risk-val">₹{totalCurrent.toLocaleString('en-IN')}</span>
                </div>
                <div className="risk-bar-bg"><div className="risk-bar" style={{ width: `${Math.min(100, Math.round((totalCurrent / 1000000) * 100))}%`, background: '#C9A84C' }} /></div>
              </div>
              <div className="risk-item">
                <div className="risk-row">
                  <span className="risk-label">Diversification</span>
                  <span className="risk-val">{divLabel}</span>
                </div>
                <div className="risk-bar-bg"><div className="risk-bar" style={{ width: `${divScore}%`, background: '#333' }} /></div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="inv-card" style={{ marginTop: '1.2rem' }}>
        <h3 className="inv-card-title"><span className="ui-title-row"><BookOpenText className="ui-title-icon" />Educational Content</span></h3>
        {publishedContent.length === 0 ? (
          <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
            No published educational content yet. It will appear here when advisors post updates.
          </p>
        ) : (
          <div className="inv-edu-grid">
            {publishedContent.map(article => (
              <div className="inv-edu-card" key={article.id}>
                <p className="inv-edu-category">{article.category}</p>
                <p className="inv-edu-title">{article.title}</p>
                <p className="inv-edu-content">{article.content}</p>
                {article.keyTakeaways && <p className="inv-edu-takeaways">Key takeaway: {article.keyTakeaways}</p>}
                <div className="inv-edu-meta">
                  <span>{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InvestorLayout>
  )
}
