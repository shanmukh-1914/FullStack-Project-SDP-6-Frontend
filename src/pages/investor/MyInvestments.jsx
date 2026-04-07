import InvestorLayout from '../../layouts/InvestorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { Briefcase, Wallet, Landmark, FolderOpen } from 'lucide-react'

const TrendUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)

const riskClass = { High: 'risk-high', Medium: 'risk-medium', Low: 'risk-low' }

export default function MyInvestments() {
  const { investments } = useInvestments()

  const portfolio = investments

  const totalInvested = portfolio.reduce((s, p) => s + p.invested, 0)
  const totalCurrent  = portfolio.reduce((s, p) => s + p.current, 0)
  const totalGains    = totalCurrent - totalInvested
  const totalGainPct  = totalInvested > 0 ? ((totalGains / totalInvested) * 100).toFixed(2) : '0.00'
  return (
    <InvestorLayout>
      <h2 className="inv-page-title"><span className="ui-title-row"><Briefcase className="ui-title-icon" />My Investments</span></h2>

      {/* Summary */}
      <div className="inv-stat-grid inv-3col">
        <div className="inv-stat-card">
          <div>
            <p className="inv-stat-label">Total Invested</p>
            <p className="inv-stat-value">₹{totalInvested.toLocaleString('en-IN')}</p>
            <p className="inv-stat-sub"><span className="ui-meta-row"><Wallet className="ui-meta-icon" />Capital deployed</span></p>
          </div>
        </div>
        <div className="inv-stat-card">
          <div>
            <p className="inv-stat-label">Current Value</p>
            <p className="inv-stat-value">₹{totalCurrent.toLocaleString('en-IN')}</p>
            <p className="inv-stat-sub"><span className="ui-meta-row"><Landmark className="ui-meta-icon" />Portfolio value</span></p>
          </div>
        </div>
        <div className="inv-stat-card">
          <div>
            <p className="inv-stat-label">Total Gains</p>
            <p className="inv-stat-value inv-gains-val">₹{totalGains.toLocaleString('en-IN')}</p>
            <p className="inv-stat-sub" style={{ color: '#7B1D1D' }}><TrendUp /> +{totalGainPct}%</p>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="inv-card" style={{ marginTop: '1.2rem', padding: '1.5rem' }}>
        <h3 className="inv-card-title" style={{ marginBottom: '1rem' }}><span className="ui-title-row"><FolderOpen className="ui-title-icon" />Investment Portfolio</span></h3>
        <div className="port-list">
          {portfolio.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No investments yet. Browse mutual funds to start investing.</p>
          )}
          {portfolio.map(p => (
            <div className="port-item" key={p.name}>
              <div className="port-item-header">
                <div>
                  <div className="port-fund-name">{p.name}</div>
                  <div className="port-category">{p.category}</div>
                </div>
                <span className={`risk-badge ${riskClass[p.risk]}`}>{p.risk} Risk</span>
              </div>
              <div className="port-item-row">
                <div className="port-col">
                  <span className="port-col-label">Invested Amount</span>
                  <span className="port-col-val">₹{p.invested.toLocaleString('en-IN')}</span>
                </div>
                <div className="port-col">
                  <span className="port-col-label">Current Value</span>
                  <span className="port-col-val">₹{p.current.toLocaleString('en-IN')}</span>
                </div>
                <div className="port-col">
                  <span className="port-col-label">Units</span>
                  <span className="port-col-val">{p.units}</span>
                </div>
                <div className="port-col">
                  <span className="port-col-label">Gains/Loss</span>
                  <span className="port-col-val gains-text">₹{p.gains.toLocaleString('en-IN')} ({p.gainPct.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InvestorLayout>
  )
}
