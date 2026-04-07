import { useState } from 'react'
import AdvisorLayout from '../../layouts/AdvisorLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { BookOpenText, PlusCircle, PenLine, Save, Send } from 'lucide-react'

const CATEGORIES = ['Investment Basics', 'Risk Awareness', 'Tax Planning', 'Financial Planning', 'Market Analysis', 'SIP & Returns']

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

export default function EducationalContent() {
  const { educationalContent, upsertEducationalArticle } = useInvestments()
  const [form, setForm] = useState({ title: '', category: 'Investment Basics', content: '', keyTakeaways: '' })
  const [toast, setToast] = useState('')
  const [editId, setEditId] = useState(null)

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value })
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const submit = async (status) => {
    if (!form.title || !form.content) { showToast('Title and content are required.'); return }
    await upsertEducationalArticle({ ...form, status }, editId)
    if (editId) {
      setEditId(null)
      showToast('✓ Article updated!')
    } else {
      showToast(status === 'Published' ? '✓ Article published!' : '✓ Draft saved!')
    }
    setForm({ title: '', category: 'Investment Basics', content: '', keyTakeaways: '' })
  }

  const startEdit = (article) => {
    setEditId(article.id)
    setForm({
      title: article.title,
      category: article.category,
      content: article.content || '',
      keyTakeaways: article.keyTakeaways || '',
    })
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const published  = educationalContent.filter(a => a.status === 'Published')
  const drafts     = educationalContent.filter(a => a.status === 'Draft')

  return (
    <AdvisorLayout>
      <div className="adv-page-header">
        <h2 className="adv-page-title" style={{ margin: 0 }}><span className="ui-title-row"><BookOpenText className="ui-title-icon" />Educational Content</span></h2>
        <button className="adv-btn-primary" onClick={() => { setEditId(null); setForm({ title: '', category: 'Investment Basics', content: '', keyTakeaways: '' }) }}>
          <span className="ui-btn-content"><PlusCircle className="ui-btn-icon" />Create New Article</span>
        </button>
      </div>

      {toast && <div className="adv-toast">{toast}</div>}

      <div className="adv-card" style={{ marginBottom: '1.2rem' }}>
        <h3 className="adv-card-title">Published Articles</h3>
        <div className="adv-articles-grid">
          {published.map(a => (
            <div className="adv-article-card" key={a.id}>
              <div className="adv-article-toprow">
                <span className="adv-article-docicon"><DocIcon /></span>
                <button className="adv-edit-btn" onClick={() => startEdit(a)}><span className="ui-btn-content"><PenLine className="ui-btn-icon" />Edit</span></button>
              </div>
              <p className="adv-article-title">{a.title}</p>
              <p className="adv-article-category">{a.category}</p>
              <div className="adv-article-meta">
                <span className="adv-article-date">{a.date}</span>
                <span className="adv-article-views">{a.views.toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {drafts.length > 0 && (
        <div className="adv-card" style={{ marginBottom: '1.2rem' }}>
          <h3 className="adv-card-title">Drafts</h3>
          <div className="adv-articles-grid">
            {drafts.map(a => (
              <div className="adv-article-card adv-article-draft" key={a.id}>
                <div className="adv-article-toprow">
                  <span className="adv-article-docicon"><DocIcon /></span>
                  <button className="adv-edit-btn" onClick={() => startEdit(a)}><span className="ui-btn-content"><PenLine className="ui-btn-icon" />Edit</span></button>
                </div>
                <p className="adv-article-title">{a.title}</p>
                <p className="adv-article-category">{a.category}</p>
                <div className="adv-article-meta">
                  <span className="adv-article-date">{a.date}</span>
                  <span className="adv-draft-chip">Draft</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="adv-card">
        <h3 className="adv-card-title">{editId ? 'Edit Article' : 'Upload New Educational Content'}</h3>
        <div className="adv-grid-2">
          <div className="adv-form-group">
            <label className="adv-label">Article Title</label>
            <input className="adv-input" name="title" placeholder="Enter article title"
              value={form.title} onChange={handleForm} />
          </div>
          <div className="adv-form-group">
            <label className="adv-label">Category</label>
            <select className="adv-input" name="category" value={form.category} onChange={handleForm}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="adv-form-group">
          <label className="adv-label">Content</label>
          <textarea className="adv-textarea" name="content" rows={6}
            placeholder="Write your educational content here..."
            value={form.content} onChange={handleForm} />
        </div>
        <div className="adv-form-group">
          <label className="adv-label">Key Takeaways</label>
          <textarea className="adv-textarea" name="keyTakeaways" rows={3}
            placeholder="List key points investors should remember..."
            value={form.keyTakeaways} onChange={handleForm} />
        </div>
        <div className="adv-btn-row">
          <button className="adv-btn-outline" onClick={() => submit('Draft')}><span className="ui-btn-content"><Save className="ui-btn-icon" />Save as Draft</span></button>
          <button className="adv-btn-primary" onClick={() => submit('Published')}><span className="ui-btn-content"><Send className="ui-btn-icon" />Publish Article</span></button>
        </div>
      </div>
    </AdvisorLayout>
  )
}
