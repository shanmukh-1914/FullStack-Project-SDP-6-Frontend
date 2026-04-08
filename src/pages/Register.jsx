import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import { registerUser } from '../services/backendService'
import { User, Mail, Lock, ShieldCheck, UserCog, UserPlus, ArrowLeft, CircleHelp } from 'lucide-react'

const TrendingUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Investor',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  if (form.password !== form.confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  try {
    setLoading(true)
    setError('')

    await registerUser({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role,
    })

    // ✅ Success
    setError('Registration successful! Redirecting...')

    setTimeout(() => {
      navigate('/login')
    }, 1000)

  } catch (err) {
    setError(err.message || 'Registration failed. Please try again.')
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

      <p className="auth-tagline">Create your account</p>

      {/* Card */}
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">

          {/* Message Box */}
          {error && (
            <div style={{
              background: error.includes('successful') ? '#dcfce7' : '#fee2e2',
              color: error.includes('successful') ? '#166534' : '#7B1D1D',
              border: error.includes('successful') ? '1px solid #4ade80' : '1px solid #f87171',
              borderRadius: '6px',
              padding: '0.6rem 1rem',
              marginBottom: '0.8rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              <span className="ui-meta-row">
                <User className="ui-meta-icon" /> Full Name
              </span>
            </label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <span className="ui-meta-row">
                <Mail className="ui-meta-icon" /> Email Address
              </span>
            </label>
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

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <span className="ui-meta-row">
                <Lock className="ui-meta-icon" /> Password
              </span>
            </label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">
              <span className="ui-meta-row">
                <ShieldCheck className="ui-meta-icon" /> Confirm Password
              </span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label">
              <span className="ui-meta-row">
                <UserCog className="ui-meta-icon" /> Register As
              </span>
            </label>
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

          {/* Button */}
          <button type="submit" className="auth-btn" disabled={loading}>
            <span className="ui-btn-content">
              <UserPlus className="ui-btn-icon" />
              {loading ? 'Registering...' : 'Register'}
            </span>
          </button>

          {/* Switch */}
          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Login here</Link>
          </p>

        </form>
      </div>

      {/* Back */}
      <Link to="/" className="back-home">
        <span className="ui-btn-content">
          <ArrowLeft className="ui-btn-icon" /> Back to Home
        </span>
      </Link>

      {/* Help */}
      <button className="help-btn" title="Help">
        <CircleHelp className="ui-btn-icon" />
      </button>
    </div>
  )
}
