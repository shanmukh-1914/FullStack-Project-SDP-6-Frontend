import { useState } from 'react'
import AdvisorLayout from '../../layouts/AdvisorLayout'
import { MessageSquarePlus, Eye, User, Mail, NotebookPen, Save, Send, X } from 'lucide-react'

function loadNotes() {
  try { return JSON.parse(localStorage.getItem('mfp_advice_notes') || '[]') } catch { return [] }
}
function saveNotes(notes) {
  localStorage.setItem('mfp_advice_notes', JSON.stringify(notes))
}

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

export default function ProvideAdvice() {
  const investors = JSON.parse(localStorage.getItem('mfp_users') || '[]').filter(u => u.role === 'Investor')
  const [notes, setNotes] = useState(loadNotes)
  const [form, setForm] = useState({ client: '', email: '', topic: '', portfolioAnalysis: '', recommendations: '', riskConsiderations: '' })
  const [toast, setToast] = useState('')
  const [viewNote, setViewNote] = useState(null)

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value })

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const saveNote = (status) => {
    if (!form.client || !form.topic) { showToast('Please enter client name and topic.'); return }
    const note = {
      id: Date.now(),
      client: form.client,
      email: form.email,
      topic: form.topic,
      date: new Date().toISOString().slice(0, 10),
      status,
      portfolioAnalysis: form.portfolioAnalysis,
      recommendations: form.recommendations,
      riskConsiderations: form.riskConsiderations,
    }
    setNotes(prev => {
      const updated = [note, ...prev]
      saveNotes(updated)
      return updated
    })
    setForm({ client: '', email: '', topic: '', portfolioAnalysis: '', recommendations: '', riskConsiderations: '' })
    showToast(status === 'Sent' ? '✓ Note sent to client!' : '✓ Draft saved!')
  }

  return (
    <AdvisorLayout>
      <h2 className="adv-page-title"><span className="ui-title-row"><MessageSquarePlus className="ui-title-icon" />Provide Investment Advice</span></h2>

      {/* Toast */}
      {toast && <div className="adv-toast">{toast}</div>}

      {/* Note View Modal */}
      {viewNote && (
        <div className="modal-overlay" onClick={() => setViewNote(null)}>
          <div className="modal-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{viewNote.topic}</h3>
              <button className="modal-close" onClick={() => setViewNote(null)}><X className="ui-btn-icon" /></button>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#555' }}>
              <p><strong>Client:</strong> {viewNote.client} ({viewNote.email})</p>
              <p><strong>Date:</strong> {viewNote.date}</p>
              <p><strong>Status:</strong> {viewNote.status}</p>
              {viewNote.portfolioAnalysis && <><p style={{ marginTop: '0.8rem' }}><strong>Portfolio Analysis:</strong></p><p>{viewNote.portfolioAnalysis}</p></>}
              {viewNote.recommendations && <><p style={{ marginTop: '0.8rem' }}><strong>Recommendations:</strong></p><p>{viewNote.recommendations}</p></>}
              {viewNote.riskConsiderations && <><p style={{ marginTop: '0.8rem' }}><strong>Risk Considerations:</strong></p><p>{viewNote.riskConsiderations}</p></>}
            </div>
          </div>
        </div>
      )}

      {/* Recent Advisory Notes */}
      <div className="adv-card" style={{ marginBottom: '1.2rem' }}>
        <h3 className="adv-card-title">Recent Advisory Notes</h3>
        <div className="adv-notes-list">
          {notes.map(n => (
            <div className="adv-note-item" key={n.id}>
              <span className="adv-note-docicon"><DocIcon /></span>
              <div className="adv-note-details">
                <p className="adv-note-client">{n.client}</p>
                <p className="adv-note-meta">{n.topic} • {n.date}</p>
              </div>
              <div className="adv-note-actions">
                <span className={`adv-note-status ${n.status === 'Sent' ? 'note-sent' : 'note-draft'}`}>{n.status}</span>
                <button className="adv-view-btn" onClick={() => setViewNote(n)}><span className="ui-btn-content"><Eye className="ui-btn-icon" />View</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Advisory Note */}
      <div className="adv-card">
        <h3 className="adv-card-title">Create New Advisory Note</h3>
        <div className="adv-grid-2">
          <div className="adv-form-group">
            <label className="adv-label"><span className="ui-meta-row"><User className="ui-meta-icon" />Client Name</span></label>
            {investors.length > 0 ? (
              <select className="adv-input" name="client" value={form.client}
                onChange={e => {
                  const selected = investors.find(u => u.fullName === e.target.value)
                  setForm({ ...form, client: e.target.value, email: selected?.email || '' })
                }}>
                <option value="">-- Select Investor --</option>
                {investors.map(u => <option key={u.email}>{u.fullName}</option>)}
              </select>
            ) : (
              <input className="adv-input" name="client" placeholder="Enter client name"
                value={form.client} onChange={handleForm} />
            )}
          </div>
          <div className="adv-form-group">
            <label className="adv-label"><span className="ui-meta-row"><Mail className="ui-meta-icon" />Client Email</span></label>
            <input className="adv-input" name="email" placeholder="Auto-filled from selection"
              value={form.email} onChange={handleForm} readOnly={!!form.client && investors.some(u => u.fullName === form.client)} />
          </div>
        </div>
        <div className="adv-form-group">
          <label className="adv-label"><span className="ui-meta-row"><NotebookPen className="ui-meta-icon" />Advisory Topic</span></label>
          <input className="adv-input" name="topic" placeholder="E.g., Portfolio Diversification"
            value={form.topic} onChange={handleForm} />
        </div>
        <div className="adv-form-group">
          <label className="adv-label">Current Portfolio Analysis</label>
          <textarea className="adv-textarea" name="portfolioAnalysis" rows={4}
            placeholder="Analyze the client's current portfolio..."
            value={form.portfolioAnalysis} onChange={handleForm} />
        </div>
        <div className="adv-form-group">
          <label className="adv-label">Recommendations</label>
          <textarea className="adv-textarea" name="recommendations" rows={4}
            placeholder="Provide your investment recommendations..."
            value={form.recommendations} onChange={handleForm} />
        </div>
        <div className="adv-form-group">
          <label className="adv-label">Risk Considerations</label>
          <textarea className="adv-textarea" name="riskConsiderations" rows={4}
            placeholder="Highlight risk factors and considerations..."
            value={form.riskConsiderations} onChange={handleForm} />
        </div>
        <div className="adv-btn-row">
          <button className="adv-btn-outline" onClick={() => saveNote('Draft')}><span className="ui-btn-content"><Save className="ui-btn-icon" />Save as Draft</span></button>
          <button className="adv-btn-primary" onClick={() => saveNote('Sent')}><span className="ui-btn-content"><Send className="ui-btn-icon" />Send to Client</span></button>
        </div>
      </div>
    </AdvisorLayout>
  )
}
