import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdvisorLayout from '../../layouts/AdvisorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { getAdvisorQueries, getAllUsers, getAdvisorContent } from '../../services/backendService'
import { LayoutDashboard, MessageSquareReply, Save } from 'lucide-react'

const ClientsIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const ChatIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const DocIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)
const TrendIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const ICONS = { clients: <ClientsIcon />, chat: <ChatIcon />, doc: <DocIcon />, trend: <TrendIcon /> }

export default function AdvisorDashboard() {
  const { currentUser } = useInvestments()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [queries, setQueries] = useState([])
  const [articles, setArticles] = useState([])
  const [noteForm, setNoteForm] = useState({ client: '', topic: '', recommendations: '' })
  const [noteSaved, setNoteSaved] = useState(false)

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setUsers([]))
    getAdvisorQueries().then(setQueries).catch(() => setQueries([]))
    getAdvisorContent().then(setArticles).catch(() => setArticles([]))
  }, [])

  const investors = users.filter(u => u.role === 'Investor')

  const handleNote = e => setNoteForm({ ...noteForm, [e.target.name]: e.target.value })
  const saveNote = e => {
    e.preventDefault()
    if (!noteForm.client || !noteForm.topic) return
    setNoteSaved(true)
    setTimeout(() => { setNoteForm({ client: '', topic: '', recommendations: '' }); setNoteSaved(false) }, 2000)
  }

  const statsData = [
    { label: 'Registered Investors', value: investors.length.toString(), icon: 'clients' },
    { label: 'Pending Queries',      value: String(queries.filter(q => q.status === 'Pending').length), icon: 'chat' },
    { label: 'Articles Published',   value: String(articles.filter(a => a.status === 'Published').length), icon: 'doc' },
    { label: 'Total Users',          value: users.length.toString(),     icon: 'trend'   },
  ]

  return (
    <AdvisorLayout>
      <div style={{ marginBottom: '0.4rem' }}>
        <h2 className="adv-page-title" style={{ marginBottom: '0.1rem' }}><span className="ui-title-row"><LayoutDashboard className="ui-title-icon" />Financial Advisor Dashboard</span></h2>
        {currentUser && (
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: 0 }}>
            Welcome, <strong>{currentUser.fullName}</strong> &nbsp;·&nbsp; {currentUser.email}
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="adv-stat-grid">
        {statsData.map(s => (
          <div className="adv-stat-card" key={s.label}>
            <div>
              <p className="adv-stat-label">{s.label}</p>
              <p className="adv-stat-value">{s.value}</p>
            </div>
            <span className="adv-stat-icon">{ICONS[s.icon]}</span>
          </div>
        ))}
      </div>

      {/* Recent Investor Queries */}
      <div className="adv-card" style={{ marginBottom: '1.2rem' }}>
        <h3 className="adv-card-title">Recent Investor Queries</h3>
        <div className="adv-query-list">
          {queries.slice(0, 4).map(q => (
            <div className="adv-query-item" key={q.id}>
              <div>
                <p className="adv-query-name">{q.name}</p>
                <p className="adv-query-text">{q.query}</p>
                <p className="adv-query-time">{q.time || 'Recently'}</p>
              </div>
              <div className="adv-query-actions">
                <span className={`adv-status-badge ${q.status === 'Pending' ? 'status-pending' : 'status-responded'}`}>
                  {q.status}
                </span>
                <button className="adv-respond-btn" onClick={() => navigate('/advisor/queries')}>
                  <span className="ui-btn-content"><MessageSquareReply className="ui-btn-icon" />Respond</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Advisory Note */}
      <div className="adv-card">
        <h3 className="adv-card-title">Create Advisory Note</h3>
        <form onSubmit={saveNote} className="adv-note-form">
          <div className="adv-form-group">
            <label className="adv-label">Client Name</label>
            <input className="adv-input" name="client" placeholder="Enter client name"
              value={noteForm.client} onChange={handleNote} />
          </div>
          <div className="adv-form-group">
            <label className="adv-label">Advisory Topic</label>
            <input className="adv-input" name="topic" placeholder="E.g., Portfolio Rebalancing"
              value={noteForm.topic} onChange={handleNote} />
          </div>
          <div className="adv-form-group">
            <label className="adv-label">Recommendations</label>
            <textarea className="adv-textarea" name="recommendations" rows={5}
              placeholder="Enter your recommendations..."
              value={noteForm.recommendations} onChange={handleNote} />
          </div>
          <button type="submit" className="adv-btn-primary">
            {noteSaved ? '✓ Saved!' : <span className="ui-btn-content"><Save className="ui-btn-icon" />Save Advisory Note</span>}
          </button>
        </form>
      </div>
    </AdvisorLayout>
  )
}
