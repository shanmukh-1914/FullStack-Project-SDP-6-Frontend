import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/investor.css'
import { useInvestments } from '../context/InvestmentContext'
import { CircleHelp } from 'lucide-react'

const DashboardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const FundsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const CompareIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const CalcIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
  </svg>
)
const BriefcaseIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
)
const ProfileIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const navItems = [
  { to: '/investor/dashboard',  label: 'Dashboard',      icon: <DashboardIcon /> },
  { to: '/investor/funds',      label: 'Mutual Funds',   icon: <FundsIcon /> },
  { to: '/investor/compare',    label: 'Compare Funds',  icon: <CompareIcon /> },
  { to: '/investor/calculator', label: 'Calculator',     icon: <CalcIcon /> },
  { to: '/investor/portfolio',  label: 'My Investments', icon: <BriefcaseIcon /> },
  { to: '/investor/profile',    label: 'Profile',        icon: <ProfileIcon /> },
]

export default function InvestorLayout({ children }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useInvestments()
  return (
    <div className="inv-shell">
      {/* Sidebar */}
      <aside className="inv-sidebar">
        <div className="inv-sidebar-brand">
          <span className="inv-brand-name">MutualFund Pro</span>
          <span className="inv-brand-sub">Investor Portal</span>
        </div>

        {currentUser && (
          <div style={{ padding: '0.6rem 1.2rem 0.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.4rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginBottom: '2px' }}>Logged in as</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
          </div>
        )}

        <nav className="inv-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 'inv-nav-item' + (isActive ? ' active' : '')}
            >
              <span className="inv-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="inv-logout" onClick={() => { logout(); navigate('/') }}>
          <span className="inv-nav-icon"><LogoutIcon /></span>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="inv-main">
        {children}
      </main>

      <button className="help-btn" title="Help"><CircleHelp style={{ width: '16px', height: '16px' }} /></button>
    </div>
  )
}
