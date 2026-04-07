import { useEffect, useState } from 'react'
import AnalystLayout from '../../layouts/AnalystLayout'
import { useInvestments } from '../../context/InvestmentContext'
import { createAnalystReport, getAnalystReports } from '../../services/backendService'
import { FileSpreadsheet, X, Download, Eye, FilePlus2 } from 'lucide-react'

const REPORT_TYPES   = ['Performance Analysis', 'Trend Analysis', 'Risk Analysis', 'Behavioral Analysis', 'Market Analysis', 'Portfolio Analysis']
const TIME_PERIODS   = ['This Month', 'Last Month', 'Last Quarter', 'Q1 2025', 'Q4 2024', 'Last Year']
const CAT_FILTERS    = ['All Categories', 'Large Cap', 'Mid Cap', 'Small Cap', 'Debt', 'Balanced', 'ELSS']

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

export default function Reports() {
  const { currentUser } = useInvestments()
  const [reports, setReports] = useState([])
  const [reportType, setReportType] = useState(REPORT_TYPES[0])
  const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[0])
  const [catFilter,  setCatFilter]  = useState(CAT_FILTERS[0])
  const [toast, setToast] = useState('')
  const [viewReport, setViewReport] = useState(null)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const refreshReports = async () => {
    const data = await getAnalystReports()
    setReports(data)
  }

  useEffect(() => {
    refreshReports().catch(() => setReports([]))
  }, [])

  const generate = async () => {
    if (!currentUser?.id) {
      showToast('Login required')
      return
    }
    const title = `${reportType} — ${timePeriod}${catFilter !== 'All Categories' ? ` (${catFilter})` : ''}`
    await createAnalystReport(currentUser.id, {
      title,
      reportType,
      description: `Generated for ${timePeriod}${catFilter !== 'All Categories' ? `, ${catFilter}` : ''}`,
    })
    await refreshReports()
    showToast('✓ Report generated successfully!')
  }

  const downloadCSV = (r) => {
    const csv = `Report Title,Type,Period,Size,Generated\n"${r.title}","${r.type}","${r.period}","${r.size}","${r.generated}"`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `${r.title.replace(/\s+/g, '_')}.csv`; a.click()
    URL.revokeObjectURL(url)
    showToast('✓ Report downloaded!')
  }

  return (
    <AnalystLayout>
      <h2 className="an-page-title"><span className="ui-title-row"><FileSpreadsheet className="ui-title-icon" />Reports</span></h2>

      {toast && <div className="an-toast">{toast}</div>}

      {/* View Modal */}
      {viewReport && (
        <div className="an-modal-overlay" onClick={() => setViewReport(null)}>
          <div className="an-modal-box" onClick={e => e.stopPropagation()}>
            <div className="an-modal-header">
              <h3 className="an-modal-title">{viewReport.title}</h3>
              <button className="an-modal-close" onClick={() => setViewReport(null)}><X className="ui-btn-icon" /></button>
            </div>
            <div className="an-modal-body">
              <div className="an-modal-row"><span>Type</span><strong>{viewReport.type}</strong></div>
              <div className="an-modal-row"><span>Period</span><strong>{viewReport.period}</strong></div>
              <div className="an-modal-row"><span>Size</span><strong>{viewReport.size}</strong></div>
              <div className="an-modal-row"><span>Generated</span><strong>{viewReport.generated}</strong></div>
              <div className="an-modal-preview">
                <p className="an-modal-preview-title">Report Summary</p>
                <p>This {viewReport.type.toLowerCase()} covers {viewReport.period} data across all tracked mutual fund schemes. Key metrics include NAV performance, investor inflows, category-wise returns and risk-adjusted returns.</p>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.6rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.7 }}>
                  <li>Total schemes analyzed: 186</li>
                  <li>Average 1Y return: 14.2%</li>
                  <li>Highest performing category: Small Cap (+22.4%)</li>
                  <li>Risk-adjusted top pick: Large Cap Funds</li>
                </ul>
              </div>
              <button className="an-btn-primary" style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => { downloadCSV(viewReport); setViewReport(null) }}>
                <span className="ui-btn-content"><Download className="ui-btn-icon" />Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Form */}
      <div className="an-card" style={{ marginBottom: '1.2rem' }}>
        <h3 className="an-card-title">Generate New Report</h3>
        <div className="an-gen-grid">
          <div className="an-form-group">
            <label className="an-label">Report Type</label>
            <select className="an-input" value={reportType} onChange={e => setReportType(e.target.value)}>
              {REPORT_TYPES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="an-form-group">
            <label className="an-label">Time Period</label>
            <select className="an-input" value={timePeriod} onChange={e => setTimePeriod(e.target.value)}>
              {TIME_PERIODS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="an-form-group">
            <label className="an-label">Category Filter</label>
            <select className="an-input" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {CAT_FILTERS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button className="an-btn-primary" onClick={generate}><span className="ui-btn-content"><FilePlus2 className="ui-btn-icon" />Generate Report</span></button>
      </div>

      {/* Reports List */}
      <div className="an-card">
        <h3 className="an-card-title">Generated Reports</h3>
        <div className="an-report-list">
          {reports.map(r => (
            <div className="an-report-item" key={r.id}>
              <span className="an-report-docicon"><DocIcon /></span>
              <div className="an-report-details">
                <p className="an-report-title">{r.title}</p>
                <p className="an-report-meta">
                  <span className="an-report-type">{r.type}</span>
                  <span className="an-report-dot">•</span>
                  <span>{r.period}</span>
                  <span className="an-report-dot">•</span>
                  <span>{r.size}</span>
                </p>
                <p className="an-report-date">Generated on {r.generated}</p>
              </div>
              <div className="an-report-actions">
                <button className="an-view-btn" onClick={() => setViewReport(r)}><span className="ui-btn-content"><Eye className="ui-btn-icon" />View</span></button>
                <button className="an-download-btn" onClick={() => downloadCSV(r)}><span className="ui-btn-content"><Download className="ui-btn-icon" />Download</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnalystLayout>
  )
}
