import { useEffect, useMemo, useState } from 'react'
import InvestorLayout from '../../layouts/InvestorLayout'
import { getFunds } from '../../services/backendService'
import { GitCompareArrows, CircleEllipsis } from 'lucide-react'

const riskClass = { High: 'risk-high', Medium: 'risk-medium', Low: 'risk-low' }

const PARAMS = [
  { key: 'category',      label: 'Category' },
  { key: 'risk',          label: 'Risk Level',     badge: true },
  { key: 'nav',           label: 'Current NAV' },
  { key: 'ret1',          label: '1 Year Return',  pct: true },
  { key: 'ret3',          label: '3 Year Return',  pct: true },
  { key: 'ret5',          label: '5 Year Return',  pct: true },
  { key: 'aum',           label: 'AUM' },
  { key: 'expenseRatio',  label: 'Expense Ratio' },
  { key: 'minInvestment', label: 'Min Investment' },
]

export default function CompareFunds() {
  const [funds, setFunds] = useState([])
  const [fund1, setFund1] = useState('')
  const [fund2, setFund2] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFunds()
      .then((data) => {
        setFunds(data)
        if (data.length > 0) setFund1(data[0].name)
        if (data.length > 1) setFund2(data[1].name)
        else if (data.length === 1) setFund2(data[0].name)
      })
      .finally(() => setLoading(false))
  }, [])

  const f1 = useMemo(() => funds.find(f => f.name === fund1), [funds, fund1])
  const f2 = useMemo(() => funds.find(f => f.name === fund2), [funds, fund2])

  return (
    <InvestorLayout>
      <h2 className="inv-page-title"><span className="ui-title-row"><GitCompareArrows className="ui-title-icon" />Compare Funds</span></h2>

      {/* Selectors */}
      <div className="inv-card" style={{ padding: '1.2rem 1.5rem' }}>
        <div className="compare-selectors">
          <div className="compare-sel-group">
            <label className="compare-sel-label"><span className="ui-meta-row"><CircleEllipsis className="ui-meta-icon" />Select First Fund</span></label>
            <select className="inv-select inv-select-full" value={fund1} onChange={e => setFund1(e.target.value)}>
              {funds.map(f => <option key={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="compare-sel-group">
            <label className="compare-sel-label"><span className="ui-meta-row"><CircleEllipsis className="ui-meta-icon" />Select Second Fund</span></label>
            <select className="inv-select inv-select-full" value={fund2} onChange={e => setFund2(e.target.value)}>
              {funds.map(f => <option key={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!loading && funds.length === 0 && (
        <div className="inv-card" style={{ marginTop: '1.2rem', padding: '1.5rem', color: '#888' }}>
          No funds available to compare.
        </div>
      )}

      {/* Comparison Table */}
      <div className="inv-card" style={{ marginTop: '1.2rem', padding: '1.5rem', display: funds.length === 0 ? 'none' : 'block' }}>
        <h3 className="inv-card-title">Fund Comparison</h3>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>{f1?.name}</th>
              <th>{f2?.name}</th>
            </tr>
          </thead>
          <tbody>
            {PARAMS.map(p => (
              <tr key={p.key}>
                <td className="compare-param">{p.label}</td>
                <td className="compare-val">
                  {p.badge
                    ? <span className={`risk-badge ${riskClass[f1?.[p.key]]}`}>{f1?.[p.key]}</span>
                    : p.pct
                    ? <span className="compare-pct">{f1?.[p.key]}%</span>
                    : f1?.[p.key]}
                </td>
                <td className="compare-val">
                  {p.badge
                    ? <span className={`risk-badge ${riskClass[f2?.[p.key]]}`}>{f2?.[p.key]}</span>
                    : p.pct
                    ? <span className="compare-pct">{f2?.[p.key]}%</span>
                    : f2?.[p.key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InvestorLayout>
  )
}
