import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import { LogIn, UserPlus, Rocket, CircleHelp, ArrowRight } from 'lucide-react'
import { InvestmentProvider } from './context/InvestmentContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard       from './pages/investor/Dashboard.jsx'
import MutualFunds     from './pages/investor/MutualFunds.jsx'
import CompareFunds    from './pages/investor/CompareFunds.jsx'
import Calculator      from './pages/investor/Calculator.jsx'
import MyInvestments   from './pages/investor/MyInvestments.jsx'
import Profile         from './pages/investor/Profile.jsx'
import FundDetail      from './pages/investor/FundDetail.jsx'
import AdvisorDashboard   from './pages/advisor/AdvisorDashboard.jsx'
import ProvideAdvice      from './pages/advisor/ProvideAdvice.jsx'
import EducationalContent from './pages/advisor/EducationalContent.jsx'
import AdvisorQueries     from './pages/advisor/InvestorQueries.jsx'
import AnalystDashboard   from './pages/analyst/AnalystDashboard.jsx'
import FundPerformance    from './pages/analyst/FundPerformance.jsx'
import InvestmentTrends   from './pages/analyst/InvestmentTrends.jsx'
import AnalystReports     from './pages/analyst/Reports.jsx'
import AdminDashboard     from './pages/admin/AdminDashboard.jsx'
import UserManagement     from './pages/admin/UserManagement.jsx'
import FundManagement     from './pages/admin/FundManagement.jsx'
import ContentManagement  from './pages/admin/ContentManagement.jsx'
import AdminReports       from './pages/admin/AdminReports.jsx'

// SVG Icons
const TrendingUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const BarChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)

const TrendingUpIconLg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// Feature Card
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{description}</p>
  </div>
)

// Home Page
function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-icon"><TrendingUpIcon /></span>
          <span className="logo-text">MutualFund Pro</span>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-outline" onClick={() => navigate('/login')}><span className="ui-btn-content"><LogIn className="ui-btn-icon" />Login</span></button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}><span className="ui-btn-content"><UserPlus className="ui-btn-icon" />Register</span></button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Investment Perception and Selection Behavior<br />
            Towards Mutual Funds
          </h1>
          <p className="hero-subtitle">
            A comprehensive platform for understanding investor behavior, analyzing mutual fund<br />
            performance, and making informed investment decisions. Project ID: FSAD-PS06
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}><span className="ui-btn-content"><Rocket className="ui-btn-icon" />Get Started</span></button>
            <button className="btn btn-outline btn-lg"><span className="ui-btn-content"><ArrowRight className="ui-btn-icon" />Learn More</span></button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          <FeatureCard
            icon={<UsersIcon />}
            title="For Investors"
            description="Explore mutual funds, compare performance, and manage your investment portfolio"
          />
          <FeatureCard
            icon={<ShieldIcon />}
            title="For Advisors"
            description="Provide expert guidance and educational content to help investors make informed decisions"
          />
          <FeatureCard
            icon={<BarChartIcon />}
            title="For Analysts"
            description="Analyze market trends, fund performance metrics, and generate comprehensive reports"
          />
          <FeatureCard
            icon={<TrendingUpIconLg />}
            title="Data-Driven Insights"
            description="Make investment decisions backed by comprehensive analysis and real-time data"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2 className="cta-title">Ready to Start Your Investment Journey?</h2>
        <p className="cta-subtitle">Join thousands of investors making informed decisions</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}><span className="ui-btn-content"><UserPlus className="ui-btn-icon" />Create Account</span></button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 MutualFund Pro - FSAD-PS06 Research Project</p>
        <p className="footer-sub">Investment Perception and Selection Behavior Towards Mutual Funds</p>
      </footer>

      {/* Floating Help */}
      <button className="help-btn" title="Help"><CircleHelp className="ui-btn-icon" /></button>

    </div>
  )
}

// App Router
function App() {
  return (
    <InvestmentProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/investor/dashboard"  element={<Dashboard />} />
        <Route path="/investor/funds"      element={<MutualFunds />} />
        <Route path="/investor/funds/:fundId" element={<FundDetail />} />
        <Route path="/investor/compare"    element={<CompareFunds />} />
        <Route path="/investor/calculator" element={<Calculator />} />
        <Route path="/investor/portfolio"  element={<MyInvestments />} />
        <Route path="/investor/profile"    element={<Profile />} />
        {/* Advisor */}
        <Route path="/advisor/dashboard"      element={<AdvisorDashboard />} />
        <Route path="/advisor/provide-advice" element={<ProvideAdvice />} />
        <Route path="/advisor/educational"    element={<EducationalContent />} />
        <Route path="/advisor/queries"        element={<AdvisorQueries />} />
        {/* Analyst */}
        <Route path="/analyst/dashboard"   element={<AnalystDashboard />} />
        <Route path="/analyst/performance" element={<FundPerformance />} />
        <Route path="/analyst/trends"      element={<InvestmentTrends />} />
        <Route path="/analyst/reports"     element={<AnalystReports />} />
        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users"     element={<UserManagement />} />
        <Route path="/admin/funds"     element={<FundManagement />} />
        <Route path="/admin/content"   element={<ContentManagement />} />
        <Route path="/admin/reports"   element={<AdminReports />} />
      </Routes>
    </InvestmentProvider>
  )
}

export default App
