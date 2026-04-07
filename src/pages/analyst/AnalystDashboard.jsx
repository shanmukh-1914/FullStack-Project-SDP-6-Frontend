import { useEffect, useState } from 'react'
import AnalystLayout from '../../layouts/AnalystLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { getAllUsers, getFunds } from '../../services/backendService'
import { LayoutDashboard, LineChart as LineChartIcon, BarChart3, Trophy, FileCog, FilePlus2 } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const TREND_DATA = [
  { month: 'Sep 24', sip: 12500, lumpsum: 45000 },
  { month: 'Oct 24', sip: 14200, lumpsum: 40000 },
  { month: 'Nov 24', sip: 19800, lumpsum: 55000 },
  { month: 'Dec 24', sip: 21000, lumpsum: 60500 },
  { month: 'Jan 25', sip: 23500, lumpsum: 46000 },
  { month: 'Feb 25', sip: 25800, lumpsum: 56000 },
]

const CAT_PERF = [
  { category: 'Large Cap', returns: 12.5, volatility: 7.2 },
  { category: 'Mid Cap',   returns: 18.3, volatility: 12.1 },
  { category: 'Small Cap', returns: 22.4, volatility: 15.6 },
  { category: 'Debt',      returns: 6.2,  volatility: 1.8 },
  { category: 'Balanced',  returns: 11.5, volatility: 6.4 },
]

const TOP_FUNDS = [
  { name: 'Small Cap Growth Fund',      category: 'Small Cap', ret: 22.4 },
  { name: 'Mid Cap Opportunities Fund', category: 'Mid Cap',   ret: 18.3 },
  { name: 'Tax Saver Equity Fund',      category: 'ELSS',      ret: 13.7 },
  { name: 'Alpha Growth Equity Fund',   category: 'Large Cap', ret: 12.5 },
]

const REPORT_TYPES  = ['Monthly Performance Report', 'Quarterly Trend Report', 'Risk Assessment Report', 'Investor Behavior Study']
const TIME_PERIODS  = ['Last Month', 'Last Quarter', 'Last 6 Months', 'Last Year']

export default function AnalystDashboard() {
  const { currentUser } = useInvestments()
  const [users, setUsers] = useState([])
  const [funds, setFunds] = useState([])
  const [reportType, setReportType] = useState(REPORT_TYPES[0])
  const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[0])
  const [genToast,   setGenToast]   = useState(false)

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setUsers([]))
    getFunds().then(setFunds).catch(() => setFunds([]))
  }, [])

  const investors = users.filter(u => u.role === 'Investor')

  const generate = () => {
    setGenToast(true)
    setTimeout(() => setGenToast(false), 2500)
  }

  return (
    <AnalystLayout>
      <div style={{ marginBottom: '0.4rem' }}>
        <h2 className="an-page-title" style={{ marginBottom: '0.1rem' }}><span className="ui-title-row"><LayoutDashboard className="ui-title-icon" />Data Analyst Dashboard</span></h2>
        {currentUser && (
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: 0 }}>
            Welcome, <strong>{currentUser.fullName}</strong> &nbsp;·&nbsp; {currentUser.email}
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="an-stat-grid">
        {[
          { label: 'Total AUM',        value: `₹${funds.length > 0 ? funds.length : 0} Funds`, sub: 'Tracked mutual funds', subColor: '#7B1D1D' },
          { label: 'Avg Return (1Y)',   value: '14.2%',                   sub: 'Across all funds',      subColor: '#888' },
          { label: 'Total Investors',   value: investors.length.toString(), sub: 'Registered investors', subColor: '#888' },
          { label: 'Total Users',       value: users.length.toString(),   sub: 'Registered accounts',   subColor: '#888' },
        ].map(s => (
          <div className="an-stat-card" key={s.label}>
            <p className="an-stat-label">{s.label}</p>
            <p className="an-stat-value">{s.value}</p>
            <p className="an-stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Investment Trends Line */}
      <div className="an-card">
        <h3 className="an-card-title"><span className="ui-title-row"><LineChartIcon className="ui-title-icon" />Investment Trends (Last 6 Months)</span></h3>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={TREND_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={55} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sip"     name="SIP Investments"     stroke="#7B1D1D" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="lumpsum" name="Lumpsum Investments"  stroke="#C9A84C" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance Bar */}
      <div className="an-card">
        <h3 className="an-card-title"><span className="ui-title-row"><BarChart3 className="ui-title-icon" />Fund Category Performance Analysis</span></h3>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={CAT_PERF} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={35} />
            <Tooltip />
            <Legend />
            <Bar dataKey="returns"    name="Returns (%)"    fill="#7B1D1D" radius={[3,3,0,0]} />
            <Bar dataKey="volatility" name="Volatility (%)" fill="#C9A84C" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="an-bottom-row">
        {/* Top Performing Funds */}
        <div className="an-card an-bottom-card">
          <h3 className="an-card-title"><span className="ui-title-row"><Trophy className="ui-title-icon" />Top Performing Funds</span></h3>
          <div className="an-top-funds">
            {TOP_FUNDS.map(f => (
              <div className="an-top-fund-item" key={f.name}>
                <div>
                  <p className="an-tf-name">{f.name}</p>
                  <p className="an-tf-cat">{f.category}</p>
                </div>
                <span className="an-tf-ret">+{f.ret}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Reports */}
        <div className="an-card an-bottom-card">
          <h3 className="an-card-title"><span className="ui-title-row"><FileCog className="ui-title-icon" />Generate Reports</span></h3>
          <div className="an-form-group">
            <label className="an-label">Report Type</label>
            <select className="an-input" value={reportType} onChange={e => setReportType(e.target.value)}>
              {REPORT_TYPES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="an-form-group">
            <label className="an-label">Time Period</label>
            <select className="an-input" value={timePeriod} onChange={e => setTimePeriod(e.target.value)}>
              {TIME_PERIODS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="an-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={generate}>
            {genToast ? '✓ Report Generated!' : <span className="ui-btn-content"><FilePlus2 className="ui-btn-icon" />Generate Report</span>}
          </button>
        </div>
      </div>
    </AnalystLayout>
  )
}
