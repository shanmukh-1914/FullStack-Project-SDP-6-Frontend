import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InvestorLayout from '../../layouts/InvestorLayout'
import { getFunds } from '../../services/backendService'
import { BadgeIndianRupee, Search, Eye } from 'lucide-react'

const TrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)

export const FUNDS = []

const riskClass = { High: 'risk-high', Medium: 'risk-medium', Low: 'risk-low' }

export default function MutualFunds() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All Categories')
  const [risk, setRisk]         = useState('All Risk Levels')
  const [funds, setFunds]       = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getFunds().then(setFunds).finally(() => setLoading(false))
  }, [])

  const filtered = funds.filter(f => {
    const matchSearch   = f.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All Categories' || f.category === category
    const matchRisk     = risk === 'All Risk Levels'    || f.risk === risk
    return matchSearch && matchCategory && matchRisk
  })

  return (
    <InvestorLayout>
      <h2 className="inv-page-title"><span className="ui-title-row"><BadgeIndianRupee className="ui-title-icon" />Mutual Funds</span></h2>

      {/* Filters */}
      <div className="inv-card" style={{ padding: '1rem 1.2rem' }}>
        <div className="funds-filters">
          <div className="funds-search-wrap">
            <span className="funds-search-icon"><Search className="ui-btn-icon" /></span>
            <input className="funds-search" placeholder="Search funds..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="inv-select" value={category} onChange={e => setCategory(e.target.value)}>
            {['All Categories','Large Cap','Mid Cap','Small Cap','Balanced','Debt','ELSS'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className="inv-select" value={risk} onChange={e => setRisk(e.target.value)}>
            {['All Risk Levels','Low','Medium','High'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="inv-card" style={{ padding: 0, overflow: 'hidden', marginTop: '1.2rem' }}>
        <table className="funds-table">
          <thead>
            <tr>
              <th>Fund Name</th><th>Category</th><th>Risk Level</th>
              <th>NAV</th><th>1Y Return</th><th>3Y Return</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.name}>
                <td>
                  <div className="fund-name-main">{f.name}</div>
                  <div className="fund-name-aum">AUM: {f.aum}</div>
                </td>
                <td>{f.category}</td>
                <td><span className={`risk-badge ${riskClass[f.risk]}`}>{f.risk}</span></td>
                <td>
                  {loading ? <span className="nav-loading">...</span> : `₹${Number(f.nav || 0).toFixed(2)}`}
                </td>
                <td className="ret-cell"><TrendUp /> {f.ret1}%</td>
                <td className="ret-cell"><TrendUp /> {f.ret3}%</td>
                <td><button className="view-btn" onClick={() => navigate(`/investor/funds/${f.id}`)}><span className="ui-btn-content"><Eye className="ui-btn-icon" />View Details</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InvestorLayout>
  )
}
