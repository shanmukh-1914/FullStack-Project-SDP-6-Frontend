import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import { useInvestments } from '../context/InvestmentContext'
import { loginUser } from '../services/backendService'
import { Mail, Lock, UserCog, LogIn, ArrowLeft, CircleHelp } from 'lucide-react'
// Handles user authentication
// Accepts user credentials and sends login request to backend
const TrendingUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const { setCurrentUser } = useInvestments()
  const [form, setForm] = useState({ email: '', password: '', role: 'Investor' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const user = await loginUser({ email: form.email, password: form.password })

      if (user.role !== form.role) {
        setError(`This account is registered as "${user.role}". Please select the correct role.`)
        return
      }

      setCurrentUser(user)

      const routes = {
        Investor: '/investor/dashboard',
        Admin: '/admin/dashboard',
        'Financial Advisor': '/advisor/dashboard',
        'Data Analyst': '/analyst/dashboard',
      }
      navigate(routes[user.role] || '/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Logo */}
      <div className="auth-logo">
        <span className="auth-logo-icon"><TrendingUpIcon /></span>
        <span className="auth-logo-text">MutualFund Pro</span>
      </div>
      <p className="auth-tagline">Sign in to your account</p>

      {/* Card */}
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div style={{ background: '#fee2e2', color: '#7B1D1D', border: '1px solid #f87171', borderRadius: '6px', padding: '0.6rem 1rem', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label"><span className="ui-meta-row"><Mail className="ui-meta-icon" />Email Address</span></label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><span className="ui-meta-row"><Lock className="ui-meta-icon" />Password</span></label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><span className="ui-meta-row"><UserCog className="ui-meta-icon" />Select Role</span></label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option>Investor</option>
              <option>Admin</option>
              <option>Financial Advisor</option>
              <option>Data Analyst</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            <span className="ui-btn-content"><LogIn className="ui-btn-icon" />{loading ? 'Logging in...' : 'Login'}</span>
          </button>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-link">Register here</Link>
          </p>
        </form>
      </div>

      <Link to="/" className="back-home"><span className="ui-btn-content"><ArrowLeft className="ui-btn-icon" />Back to Home</span></Link>

      <button className="help-btn" title="Help"><CircleHelp className="ui-btn-icon" /></button>
    </div>
  )
}
