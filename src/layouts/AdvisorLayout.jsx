import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/advisor.css'
import { useInvestments } from '../context/InvestmentContext'
import { CircleHelp } from 'lucide-react'

const DashboardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const AdviceIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const ContentIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)
const QueriesIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const navItems = [
  { to: '/advisor/dashboard',        label: 'Dashboard',          icon: <DashboardIcon /> },
  { to: '/advisor/provide-advice',   label: 'Provide Advice',     icon: <AdviceIcon /> },
  { to: '/advisor/educational',      label: 'Educational Content',icon: <ContentIcon /> },
  { to: '/advisor/queries',          label: 'Investor Queries',   icon: <QueriesIcon /> },
]

export default function AdvisorLayout({ children }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useInvestments()
  return (
    <div className="adv-shell">
      <aside className="adv-sidebar">
        <div className="adv-sidebar-brand">
          <span className="adv-brand-name">MutualFund Pro</span>
          <span className="adv-brand-sub">Advisor Portal</span>
        </div>
        {currentUser && (
          <div style={{ padding: '0.6rem 1.2rem 0.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.4rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginBottom: '2px' }}>Logged in as</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
          </div>
        )}
        <nav className="adv-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 'adv-nav-item' + (isActive ? ' active' : '')}
            >
              <span className="adv-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="adv-logout" onClick={() => { logout(); navigate('/') }}>
          <span className="adv-nav-icon"><LogoutIcon /></span>
          Logout
        </button>
      </aside>

      <main className="adv-main">
        {children}
      </main>

      <button className="help-btn" title="Help"><CircleHelp style={{ width: '16px', height: '16px' }} /></button>
    </div>
  )
}
