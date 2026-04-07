import { useState } from 'react'
import InvestorLayout from '../../layouts/InvestorLayout'
import { Calculator as CalculatorIcon, BadgeIndianRupee, CalendarClock, Percent, BarChart3, AlertTriangle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

function fmt(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)},${String(Math.round(n % 100000)).padStart(5, '0')}`
  return `₹${n.toLocaleString('en-IN')}`
}

function calcSIP(monthly, years, rate) {
  const r = rate / 100 / 12
  const n = years * 12
  const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  return { invested: monthly * n, total: Math.round(fv) }
}

function calcLump(amount, years, rate) {
  const fv = amount * Math.pow(1 + rate / 100, years)
  return { invested: amount, total: Math.round(fv) }
}

export default function Calculator() {
  const [type, setType]     = useState('SIP')
  const [amount, setAmount] = useState(5000)
  const [years, setYears]   = useState(10)
  const [rate, setRate]     = useState(12)

  const result = type === 'SIP' ? calcSIP(amount, years, rate) : calcLump(amount, years, rate)
  const returns = result.total - result.invested

  const barData = [
    { name: 'Invested Amount',   value: result.invested },
    { name: 'Estimated Returns', value: returns > 0 ? returns : 0 },
  ]

  return (
    <InvestorLayout>
      <h2 className="inv-page-title"><span className="ui-title-row"><CalculatorIcon className="ui-title-icon" />Investment Calculator</span></h2>

      <div className="calc-layout">
        {/* Left */}
        <div className="inv-card calc-left">
          <h3 className="inv-card-title">Calculate Returns</h3>

          {/* Type Toggle */}
          <div className="form-group-calc">
            <label className="calc-label"><span className="ui-meta-row"><CalculatorIcon className="ui-meta-icon" />Investment Type</span></label>
            <div className="calc-toggle">
              <button className={`calc-toggle-btn${type === 'SIP' ? ' active' : ''}`} onClick={() => setType('SIP')}>SIP</button>
              <button className={`calc-toggle-btn${type === 'Lumpsum' ? ' active' : ''}`} onClick={() => setType('Lumpsum')}>Lumpsum</button>
            </div>
          </div>

          {/* Amount */}
          <div className="form-group-calc">
            <label className="calc-label"><span className="ui-meta-row"><BadgeIndianRupee className="ui-meta-icon" />{type === 'SIP' ? 'Monthly Investment (₹)' : 'Lumpsum Amount (₹)'}</span></label>
            <input type="number" className="calc-input" value={amount} min={100} max={1000000}
              onChange={e => setAmount(Number(e.target.value))} />
            <input type="range" className="calc-slider" value={amount} min={500} max={100000} step={500}
              onChange={e => setAmount(Number(e.target.value))} />
          </div>

          {/* Years */}
          <div className="form-group-calc">
            <label className="calc-label"><span className="ui-meta-row"><CalendarClock className="ui-meta-icon" />Time Period (Years)</span></label>
            <input type="number" className="calc-input" value={years} min={1} max={30}
              onChange={e => setYears(Number(e.target.value))} />
            <input type="range" className="calc-slider" value={years} min={1} max={30} step={1}
              onChange={e => setYears(Number(e.target.value))} />
          </div>

          {/* Rate */}
          <div className="form-group-calc">
            <label className="calc-label"><span className="ui-meta-row"><Percent className="ui-meta-icon" />Expected Return Rate (%)</span></label>
            <input type="number" className="calc-input" value={rate} min={1} max={30}
              onChange={e => setRate(Number(e.target.value))} />
            <input type="range" className="calc-slider" value={rate} min={1} max={30} step={0.5}
              onChange={e => setRate(Number(e.target.value))} />
          </div>
        </div>

        {/* Right */}
        <div className="calc-right">
          <div className="inv-card">
            <h3 className="inv-card-title"><span className="ui-title-row"><BarChart3 className="ui-title-icon" />Projected Returns</span></h3>
            <div className="proj-row proj-row-bg1">
              <span className="proj-label">Total Invested</span>
              <span className="proj-val">{fmt(result.invested)}</span>
            </div>
            <div className="proj-row proj-row-bg2">
              <span className="proj-label">Estimated Returns</span>
              <span className="proj-val proj-returns">{fmt(returns > 0 ? returns : 0)}</span>
            </div>
            <div className="proj-row proj-row-dark">
              <span className="proj-label proj-label-white">Total Value</span>
              <span className="proj-val proj-val-white">{fmt(result.total)}</span>
            </div>
          </div>

          <div className="inv-card" style={{ marginTop: '1.2rem' }}>
            <h3 className="inv-card-title"><span className="ui-title-row"><BarChart3 className="ui-title-icon" />Wealth Growth</span></h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => v >= 100000 ? `${(v/100000).toFixed(0)}L` : v} />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="value" fill="#7B1D1D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="inv-card" style={{ marginTop: '1.2rem', padding: '1rem 1.4rem' }}>
        <p className="calc-disclaimer">
          <span className="ui-meta-row"><AlertTriangle className="ui-meta-icon" /><strong>Disclaimer:</strong></span> The calculator provides estimated returns based on the inputs provided.
          Actual returns may vary depending on market conditions, fund performance, and other factors.
          Past performance is not indicative of future results. Please consult with a financial advisor
          before making investment decisions.
        </p>
      </div>
    </InvestorLayout>
  )
}
