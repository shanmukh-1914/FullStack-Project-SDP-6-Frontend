import { useEffect, useState } from 'react'
import AdvisorLayout from '../../layouts/AdvisorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { getAdvisorQueries, replyToInvestorQuery } from '../../services/backendService'
import { MessageCircleQuestion, Send } from 'lucide-react'

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

export default function InvestorQueries() {
  const { currentUser } = useInvestments()
  const [queries, setQueries]   = useState([])
  const [responses, setResponses] = useState({})
  const [filterStatus, setFilterStatus] = useState('All Queries')
  const [filterTime,   setFilterTime]   = useState('All Time')
  const [toast, setToast] = useState('')

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const refreshQueries = async () => {
    const data = await getAdvisorQueries()
    setQueries(data)
  }

  useEffect(() => {
    refreshQueries().catch(() => setQueries([]))
  }, [])

  const handleResponseChange = (id, val) =>
    setResponses(prev => ({ ...prev, [id]: val }))

  const sendResponse = async (id) => {
    const text = responses[id]?.trim()
    if (!text) { showToast('Please type a response first.'); return }
    if (!currentUser?.id) return

    await replyToInvestorQuery(id, currentUser.id, text)
    await refreshQueries()
    setResponses(prev => ({ ...prev, [id]: '' }))
    showToast('✓ Response sent!')
  }

  const filtered = queries.filter(q => {
    const matchStatus = filterStatus === 'All Queries' || q.status === filterStatus.replace('All Queries', 'All')
    return matchStatus
  }).filter(q => {
    if (filterStatus === 'Pending')   return q.status === 'Pending'
    if (filterStatus === 'Responded') return q.status === 'Responded'
    return true
  })

  const pendingCount   = queries.filter(q => q.status === 'Pending').length
  const respondedCount = queries.filter(q => q.status === 'Responded').length

  return (
    <AdvisorLayout>
      <h2 className="adv-page-title"><span className="ui-title-row"><MessageCircleQuestion className="ui-title-icon" />Investor Queries</span></h2>

      {toast && <div className="adv-toast">{toast}</div>}

      {queries.length === 0 && (
        <div className="adv-card" style={{ padding: '2rem', textAlign: 'center', color: '#888', marginBottom: '1.2rem' }}>
          No investor queries yet. Investors can submit queries from their portal.
        </div>
      )}

      {/* Summary Row */}
      <div className="adv-query-summary">
        <div className="adv-qs-chip adv-qs-all"   onClick={() => setFilterStatus('All Queries')}>All ({queries.length})</div>
        <div className="adv-qs-chip adv-qs-pend"  onClick={() => setFilterStatus('Pending')}>Pending ({pendingCount})</div>
        <div className="adv-qs-chip adv-qs-resp"  onClick={() => setFilterStatus('Responded')}>Responded ({respondedCount})</div>
      </div>

      {/* Filters */}
      <div className="adv-card" style={{ padding: '0.8rem 1.2rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <select className="adv-input" style={{ width: 'auto' }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>All Queries</option>
            <option>Pending</option>
            <option>Responded</option>
          </select>
          <select className="adv-input" style={{ width: 'auto' }}
            value={filterTime} onChange={e => setFilterTime(e.target.value)}>
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      {/* Query Cards */}
      <div className="adv-qcards">
        {filtered.map(q => (
          <div className="adv-qcard" key={q.id}>
            <div className="adv-qcard-header">
              <div className="adv-qcard-left">
                <span className="adv-qcard-icon"><ChatIcon /></span>
                <div>
                  <p className="adv-qcard-name">{q.name}</p>
                  <p className="adv-qcard-email">{q.email}</p>
                  <p className="adv-qcard-query">{q.query}</p>
                  <p className="adv-qcard-time">{q.time}</p>
                </div>
              </div>
              <span className={`adv-status-badge ${q.status === 'Pending' ? 'status-pending' : 'status-responded'}`}>
                {q.status}
              </span>
            </div>

            {/* Responded: show existing answer */}
            {q.status === 'Responded' && q.response && (
              <div className="adv-qcard-existing-resp">
                <p className="adv-qcard-resp-label">Your Response:</p>
                <p className="adv-qcard-resp-text">{q.response}</p>
              </div>
            )}

            {/* Always show response textarea */}
            <div className="adv-qcard-respond">
              <label className="adv-label">Your Response</label>
              <textarea
                className="adv-textarea"
                rows={3}
                placeholder="Type your response here.."
                value={responses[q.id] || ''}
                onChange={e => handleResponseChange(q.id, e.target.value)}
              />
              <button className="adv-btn-primary" style={{ marginTop: '0.7rem' }}
                onClick={() => sendResponse(q.id)}>
                <span className="ui-btn-content"><Send className="ui-btn-icon" />Send Response</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="adv-empty">No queries found for the selected filter.</div>
        )}
      </div>
    </AdvisorLayout>
  )
}
