import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { getAllUsers } from '../../services/backendService'
import { FileChartColumn, Download } from 'lucide-react'
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const TotalReportsIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)
const ActiveUsersIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const InvestorsIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
  </svg>
)
const TrendUpIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const downloadCSV = (title, data, keys) => {
  const csv = [keys.join(','), ...data.map(r => keys.map(k => r[k]).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `${title.replace(/\s+/g,'_')}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function AdminReports() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setUsers([]))
  }, [])

  const investors = users.filter(u => u.role === 'Investor')
  const advisors  = users.filter(u => u.role === 'Financial Advisor')
  const analysts  = users.filter(u => u.role === 'Data Analyst')

  // Build chart data: one entry per registered user grouped by role
  const roleData = [
    { category: 'Investor',          count: investors.length },
    { category: 'Financial Advisor', count: advisors.length  },
    { category: 'Data Analyst',      count: analysts.length  },
    { category: 'Admin',             count: users.filter(u => u.role === 'Admin').length },
  ].filter(d => d.count > 0)

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h2 className="adm-page-title" style={{ margin: 0 }}><span className="ui-title-row"><FileChartColumn className="ui-title-icon" />Reports</span></h2>
        <button className="adm-btn-primary"
          onClick={() => downloadCSV('Users_Report', users.map((u,i) => ({ id: i+1, name: u.fullName, email: u.email, role: u.role })), ['id','name','email','role'])}>
          <span className="ui-btn-content"><Download className="ui-btn-icon" />Download All Reports</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="adm-stat-grid">
        {[
          { label: 'Total Users',     value: users.length.toString(),     sub: '', icon: <TotalReportsIcon /> },
          { label: 'Active Users',    value: users.filter(u => u.status !== 'Inactive').length.toString(), sub: '', icon: <ActiveUsersIcon /> },
          { label: 'Total Investors', value: investors.length.toString(), sub: '', icon: <InvestorsIcon /> },
          { label: 'Advisors',        value: advisors.length.toString(),  sub: '', icon: <TrendUpIcon /> },
        ].map(s => (
          <div className="adm-stat-card" key={s.label}>
            <div>
              <p className="adm-stat-label">{s.label}</p>
              <p className="adm-stat-value">{s.value}</p>
            </div>
            <span className="adm-stat-icon">{s.icon}</span>
          </div>
        ))}
      </div>

      {/* User Breakdown Bar */}
      <div className="adm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <h3 className="adm-card-title" style={{ margin: 0 }}>Registered Users by Role</h3>
          <button className="adm-btn-outline adm-btn-sm"
            onClick={() => downloadCSV('Users_By_Role', roleData, ['category','count'])}>
            <span className="ui-btn-content"><Download className="ui-btn-icon" />Download Report</span>
          </button>
        </div>
        {users.length === 0 ? (
          <p style={{ color: '#888', padding: '2rem', textAlign: 'center' }}>No registered users yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roleData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Users" fill="#7B1D1D" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Registered Users Table */}
      <div className="adm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <h3 className="adm-card-title" style={{ margin: 0 }}>All Registered Users</h3>
          <button className="adm-btn-outline adm-btn-sm"
            onClick={() => downloadCSV('Registered_Users', users.map((u,i) => ({ id: i+1, name: u.fullName, email: u.email, role: u.role })), ['id','name','email','role'])}>
            <span className="ui-btn-content"><Download className="ui-btn-icon" />Download Report</span>
          </button>
        </div>
        {users.length === 0 ? (
          <p style={{ color: '#888', padding: '2rem', textAlign: 'center' }}>No registered users yet.</p>
        ) : (
          <table className="adm-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.email}>
                  <td className="adm-td-muted">{i + 1}</td>
                  <td>{u.fullName}</td>
                  <td className="adm-td-muted">{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </AdminLayout>
  )
}
