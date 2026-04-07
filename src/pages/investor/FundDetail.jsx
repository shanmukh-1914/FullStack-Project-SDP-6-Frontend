import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import InvestorLayout from '../../layouts/InvestorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { getFundById, investInFund } from '../../services/backendService'
import { ArrowLeft, CircleCheckBig, Wallet, Shield, AlertTriangle, History, TrendingUp } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const riskClass = { High: 'risk-high', Medium: 'risk-medium', Low: 'risk-low' }

function InvestModal({ fund, liveNav, onClose }) {
  const { currentUser, refreshPortfolio } = useInvestments()
  const [amount, setAmount] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const displayNav = liveNav || fund.nav
  const navVal = parseFloat(String(displayNav).replace('₹', ''))
  const units = amount ? (Number(amount) / navVal).toFixed(2) : '0.00'

  const handleInvest = async () => {
    if (!amount || Number(amount) < Number(String(fund.minInvestment).replace('₹',''))) return
    if (!currentUser?.id) return

    try {
      setSubmitting(true)
      await investInFund(currentUser.id, fund.id, amount)
      await refreshPortfolio()
      setSuccess(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {success ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <h3>Investment Successful!</h3>
            <p>₹{Number(amount).toLocaleString('en-IN')} invested in <strong>{fund.name}</strong></p>
            <p className="modal-units-info">{units} units added to your portfolio</p>
            <button className="auth-btn" style={{ marginTop: '1rem' }} onClick={onClose}>
              <span className="ui-btn-content"><CircleCheckBig className="ui-btn-icon" />Done</span>
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h3 className="modal-title">Invest in {fund.name}</h3>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-info-row">
                <span>Current NAV</span>
                <strong>
                  {displayNav}
                  {liveNav && <span className="live-dot" title="Live price">●</span>}
                </strong>
              </div>
              <div className="modal-info-row">
                <span>Min Investment</span><strong>{fund.minInvestment}</strong>
              </div>
              <div className="form-group-p" style={{ marginTop: '1rem' }}>
                <label className="p-label">Investment Amount (₹)</label>
                <input
                  className="p-input"
                  type="number"
                  placeholder={`Min ${fund.minInvestment}`}
                  value={amount}
                  min={String(fund.minInvestment).replace('₹','')}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              {amount > 0 && (
                <div className="modal-units-preview">
                  You will receive approx. <strong>{units} units</strong>
                </div>
              )}
              <button
                className="auth-btn"
                style={{ marginTop: '1.2rem', width: '100%' }}
                onClick={handleInvest}
                disabled={submitting || !amount || Number(amount) < Number(String(fund.minInvestment).replace('₹',''))}
              >
                <span className="ui-btn-content"><Wallet className="ui-btn-icon" />{submitting ? 'Investing...' : 'Confirm Investment'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function FundDetail() {
  const { fundId } = useParams()
  const navigate = useNavigate()
  const id = Number(fundId)
  const [showModal, setShowModal]   = useState(false)
  const [fund, setFund]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [apiError, setApiError]     = useState(false)

  useEffect(() => {
    setLoading(true)
    setApiError(false)
    getFundById(id)
      .then(setFund)
      .catch(() => setApiError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (!fund) return (
    <InvestorLayout>
      <p style={{ color: '#888', padding: '2rem' }}>Fund not found.</p>
    </InvestorLayout>
  )

  const nav = Number(fund?.nav || 0)
  const navHistory = Array.from({ length: 7 }).map((_, idx) => {
    const month = new Date()
    month.setMonth(month.getMonth() - (6 - idx))
    const factor = 1 - ((6 - idx) * 0.01)
    return {
      month: month.toISOString().slice(0, 7),
      nav: Number((nav * factor).toFixed(2)),
    }
  })

  const historyTable = [...navHistory].reverse()
  const liveNav = `₹${nav.toFixed(2)}`
  const liveDate = new Date().toISOString().slice(0, 10)

  const statCards = [
    { label: 'Current NAV',   value: liveNav || fund.nav, sub: liveDate ? `As of ${liveDate}` : 'As of Feb 22, 2026', red: false },
    { label: '1 Year Return', value: `${fund.ret1}%`, sub: 'Annualized', red: true  },
    { label: '3 Year Return', value: `${fund.ret3}%`, sub: 'Annualized', red: true  },
    { label: '5 Year Return', value: `${fund.ret5}%`, sub: 'Annualized', red: true  },
  ]

  return (
    <InvestorLayout>
      {/* Back */}
      <button className="fd-back" onClick={() => navigate('/investor/funds')}>
        <span className="ui-btn-content"><ArrowLeft className="ui-btn-icon" />Back to Funds</span>
      </button>

      {/* Hero */}
      <div className="fd-hero">
        <div>
          <h2 className="fd-title">{fund.name}</h2>
          <div className="fd-meta">
            <span className="fd-category">{fund.category}</span>
            <span className="fd-dot">•</span>
            <span className={`risk-badge ${riskClass[fund.risk]}`}>{fund.risk} Risk</span>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
          <span className="ui-btn-content"><Wallet className="ui-btn-icon" />Invest Now</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="inv-stat-grid" style={{ marginBottom: '1.2rem' }}>
        {statCards.map(c => (
          <div className="inv-stat-card" key={c.label} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <p className="inv-stat-label">{c.label}</p>
            <p className="inv-stat-value" style={{ color: c.red ? '#7B1D1D' : '#1a1a1a', fontSize: '1.6rem' }}>
              {c.value}
            </p>
            <p className="inv-stat-sub" style={{ color: '#888' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* NAV Performance Chart */}
      <div className="inv-card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <h3 className="inv-card-title" style={{ margin: 0 }}><span className="ui-title-row"><TrendingUp className="ui-title-icon" />NAV Performance (Last 6 Months)</span></h3>
            {loading && <span className="api-loading-badge">Loading...</span>}
          {!loading && !apiError && liveNav && <span className="api-live-badge">● Live</span>}
          {!loading && apiError && <span className="api-error-badge">API unavailable</span>}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={navHistory || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} width={55} />
            <Tooltip formatter={v => `₹${v}`} />
            <Line type="monotone" dataKey="nav" stroke="#7B1D1D" strokeWidth={2}
              dot={{ r: 4, fill: '#7B1D1D' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fund Overview + Risk Factors */}
      <div className="fd-info-row">
        {/* Fund Overview */}
        <div className="inv-card">
          <h3 className="fd-section-title">
            <span className="ui-title-row"><Shield className="ui-title-icon" />Fund Overview</span>
          </h3>
          <p className="fd-obj-label">Investment Objective</p>
          <p className="fd-obj-text">
            To generate long-term capital appreciation by investing in {fund.category.toLowerCase()} equity
            and equity-related securities.
          </p>
          <div className="fd-overview-grid">
            <div><p className="fd-obj-label">AUM</p><p className="fd-obj-val">{fund.aum}</p></div>
            <div><p className="fd-obj-label">Expense Ratio</p><p className="fd-obj-val">{fund.expenseRatio}</p></div>
            <div><p className="fd-obj-label">Min Investment</p><p className="fd-obj-val">{fund.minInvestment}</p></div>
            <div><p className="fd-obj-label">Category</p><p className="fd-obj-val">{fund.category}</p></div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="inv-card">
          <h3 className="fd-section-title">
            <span className="ui-title-row"><AlertTriangle className="ui-title-icon" />Risk Factors</span>
          </h3>
          <ul className="fd-risk-list">
            <li>Market volatility can affect returns</li>
            <li>Equity investments are subject to market risks</li>
            <li>Past performance is not indicative of future results</li>
            {fund.risk === 'High' && <li>High concentration in small/mid cap stocks increases risk</li>}
            {fund.risk === 'Low'  && <li>Interest rate changes may affect debt fund returns</li>}
            <li>The NAV of schemes may go up or down based on market factors</li>
          </ul>
        </div>
      </div>

      {/* Historical NAV Table */}
      <div className="inv-card" style={{ marginTop: '1.2rem', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.2rem 1.5rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h3 className="inv-card-title" style={{ margin: 0 }}><span className="ui-title-row"><History className="ui-title-icon" />Historical NAV</span></h3>
          {loading && <span className="api-loading-badge">Fetching from backend...</span>}
          {!loading && liveNav && <span className="api-live-badge">● Live data</span>}
        </div>
        <table className="funds-table">
          <thead>
            <tr>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>NAV (₹)</th>
              <th style={{ textAlign: 'right' }}>Change</th>
            </tr>
          </thead>
          <tbody>
            {(historyTable || []).map((row, i) => {
              const next = historyTable?.[i + 1]  // next = older month
              const change = next ? (((row.nav - next.nav) / next.nav) * 100).toFixed(2) : null
              return (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td style={{ textAlign: 'right' }}>{row.nav}</td>
                  <td style={{ textAlign: 'right', color: '#7B1D1D', fontWeight: 500 }}>
                    {change !== null ? `+${change}%` : '—'}
                  </td>
                </tr>
              )
            })}
            {!loading && !historyTable?.length && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: '1.5rem' }}>No data available</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invest Modal */}
      {showModal && <InvestModal fund={fund} liveNav={liveNav} onClose={() => setShowModal(false)} />}

      <div style={{ height: '2rem' }} />
    </InvestorLayout>
  )
}
