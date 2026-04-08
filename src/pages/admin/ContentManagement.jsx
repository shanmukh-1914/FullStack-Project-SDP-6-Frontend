import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { createAdvisorContent, deleteAdvisorContent, getAdminContent, updateAdvisorContent } from '../../services/backendService'
import { BookText, PlusCircle, X, PenLine, Trash2, CircleX, Save } from 'lucide-react'

const CATEGORIES = ['Risk Awareness', 'Investment Strategy', 'Tax Planning', 'Portfolio Management', 'Market Analysis']
const AUTHORS    = ['Admin', 'Financial Advisor', 'Data Analyst']

const DocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

export default function ContentManagement() {
  const { currentUser } = useInvestments()
  const [articles, setArticles] = useState([])
  const [toast, setToast]       = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [editArt, setEditArt]   = useState(null)
  const [catFilter, setCat]     = useState('All')
  const [form, setForm]         = useState({ title: '', category: CATEGORIES[0], author: AUTHORS[0], content: '', status: 'Published' })

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const refreshArticles = async () => {
    const data = await getAdminContent()
    setArticles(data)
  }

  useEffect(() => {
    refreshArticles().catch(() => setArticles([]))
  }, [])

  const filteredArt = catFilter === 'All' ? articles : articles.filter(a => a.category === catFilter)
  const cards = useMemo(() => articles.filter(a => a.category === 'Risk Awareness' && a.status === 'Published'), [articles])

  const saveArticle = async (e) => {
    e.preventDefault()
    if (!form.title) { showToast('Title is required.'); return }
    if (!currentUser?.id) { showToast('Login required.'); return }

    if (editArt) {
      await updateAdvisorContent(editArt.id, {
        title: form.title,
        category: form.category,
        content: form.content,
        keyTakeaways: '',
        status: form.status,
      })
      showToast('✓ Article updated!')
    } else {
      await createAdvisorContent(currentUser.id, {
        title: form.title,
        category: form.category,
        content: form.content,
        keyTakeaways: '',
        status: form.status,
      })
      showToast('✓ Content added!')
    }
    await refreshArticles()
    setShowAdd(false); setEditArt(null)
    setForm({ title: '', category: CATEGORIES[0], author: AUTHORS[0], content: '', status: 'Published' })
  }

  const removeArticle = async (id) => {
    await deleteAdvisorContent(id)
    await refreshArticles()
    showToast('✓ Article removed.')
  }

  const openEdit = a => {
    setEditArt(a)
    setForm({ title: a.title, category: a.category, author: a.authorName || 'Admin', content: a.content || '', status: a.status })
    setShowAdd(true)
  }

  const removeCard = async (id) => {
    await removeArticle(id)
  }

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h2 className="adm-page-title" style={{ margin: 0 }}><span className="ui-title-row"><BookText className="ui-title-icon" />Content Management</span></h2>
        <button className="adm-btn-primary" onClick={() => { setEditArt(null); setShowAdd(true) }}><span className="ui-btn-content"><PlusCircle className="ui-btn-icon" />Add New Content</span></button>
      </div>

      {toast && <div className="adm-toast">{toast}</div>}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="adm-overlay" onClick={() => { setShowAdd(false); setEditArt(null) }}>
          <div className="adm-modal adm-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{editArt ? 'Edit Article' : 'Add New Content'}</h3>
              <button className="adm-modal-close" onClick={() => { setShowAdd(false); setEditArt(null) }}><X className="ui-btn-icon" /></button>
            </div>
            <form onSubmit={saveArticle}>
              <div className="adm-form-group">
                <label className="adm-label">Title</label>
                <input className="adm-input" placeholder="Enter article title" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="adm-grid-2">
                <div className="adm-form-group">
                  <label className="adm-label">Category</label>
                  <select className="adm-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Author</label>
                  <select className="adm-input" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}>
                    {AUTHORS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Status</label>
                  <select className="adm-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option>Published</option><option>Draft</option>
                  </select>
                </div>
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Content</label>
                <textarea className="adm-textarea" rows={4} placeholder="Write article content..."
                  value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-outline" onClick={() => { setShowAdd(false); setEditArt(null) }}><span className="ui-btn-content"><CircleX className="ui-btn-icon" />Cancel</span></button>
                <button type="submit" className="adm-btn-primary"><span className="ui-btn-content"><Save className="ui-btn-icon" />{editArt ? 'Save Changes' : 'Add Content'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="adm-card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <h3 className="adm-card-title" style={{ margin: 0 }}>Educational Articles</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Filter by Category</span>
            <select className="adm-input" style={{ width: 'auto' }}
              value={catFilter} onChange={e => setCat(e.target.value)}>
              <option value="All">All</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <table className="adm-table">
          <thead>
            <tr><th>Article ID</th><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredArt.map(a => (
              <tr key={a.id}>
                <td className="adm-td-link">ART{String(a.id).padStart(3, '0')}</td>
                <td className="adm-td-name">{a.title}</td>
                <td className="adm-td-cat">{a.category}</td>
                <td>{a.authorName || 'Admin'}</td>
                <td className="adm-td-muted">{a.date}</td>
                <td>
                  <span className={`adm-status ${a.status === 'Published' ? 'status-published' : 'status-draft'}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div className="adm-action-row">
                    <button className="adm-action-btn" onClick={() => openEdit(a)}><span className="ui-btn-content"><PenLine className="ui-btn-icon" />Edit</span></button>
                    <button className="adm-action-btn adm-btn-remove" onClick={() => removeArticle(a.id)}><span className="ui-btn-content"><Trash2 className="ui-btn-icon" />Remove</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Risk Awareness Cards */}
      <div className="adm-card">
        <h3 className="adm-card-title">Risk Awareness Content</h3>
        <div className="adm-content-grid">
          {cards.map(c => (
            <div className="adm-content-card" key={c.id}>
              <div className="adm-cc-toprow">
                <span><DocIcon /></span>
                <div className="adm-cc-actions">
                  <button className="adm-icon-btn" title="Edit" onClick={() => showToast('Edit card: ' + c.title)}><PenLine className="ui-btn-icon" /></button>
                  <button className="adm-icon-btn adm-icon-del" title="Delete" onClick={() => removeCard(c.id)}><Trash2 className="ui-btn-icon" /></button>
                </div>
              </div>
              <p className="adm-cc-title">{c.title}</p>
              <p className="adm-cc-cat">{c.category}</p>
              <p className="adm-cc-views">{Number(c.views || 0).toLocaleString()} views</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
