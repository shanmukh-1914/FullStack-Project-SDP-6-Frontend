import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/analyst.css'
import { useInvestments } from '../context/InvestmentContext'
import { CircleHelp } from 'lucide-react'

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const BarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const TrendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const ReportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const NAV = [
  { to: '/analyst/dashboard',    label: 'Dashboard',          icon: <DashboardIcon /> },
  { to: '/analyst/performance',  label: 'Fund Performance',   icon: <BarIcon /> },
  { to: '/analyst/trends',       label: 'Investment Trends',  icon: <TrendIcon /> },
  { to: '/analyst/reports',      label: 'Reports',            icon: <ReportIcon /> },
]

export default function AnalystLayout({ children }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useInvestments()
  return (
    <div className="an-shell">
      <aside className="an-sidebar">
        <div className="an-sidebar-brand">
          <span className="an-brand-name">MutualFund Pro</span>
          <span className="an-brand-sub">Analyst Portal</span>
        </div>
        {currentUser && (
          <div style={{ padding: '0.6rem 1.2rem 0.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.4rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginBottom: '2px' }}>Logged in as</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
          </div>
        )}
        <nav className="an-nav">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) => 'an-nav-item' + (isActive ? ' active' : '')}>
              <span className="an-nav-icon">{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <button className="an-logout" onClick={() => { logout(); navigate('/') }}>
          <span className="an-nav-icon"><LogoutIcon /></span>Logout
        </button>
      </aside>
      <main className="an-main">{children}</main>
      <button className="an-help-btn" title="Help"><CircleHelp style={{ width: '16px', height: '16px' }} /></button>
    </div>
  )
}
