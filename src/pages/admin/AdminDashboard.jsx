import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { getAllUsers } from '../../services/backendService'
import { ShieldCheck } from 'lucide-react'
// Displays admin dashboard with system overview
// Shows statistics like users, funds, reports, and activities
const TYPE_COLOR = {
  user:    { bg: '#fef2f2', color: '#c0392b', border: '#fcc' },
  fund:    { bg: '#fdf8e1', color: '#b45309', border: '#f0d070' },
  content: { bg: '#f5f5f5', color: '#555',    border: '#ddd' },
  report:  { bg: '#f5f5f5', color: '#555',    border: '#ddd' },
}

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const FolderIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
)
const InvestorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
  </svg>
)
const PulseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7B1D1D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

export default function AdminDashboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setUsers([]))
  }, [])

  const investors = users.filter(u => u.role === 'Investor')
  const advisors  = users.filter(u => u.role === 'Financial Advisor')

  const activity = users.map(u => ({
    time: 'Recently',
    user: u.fullName,
    action: `Registered as ${u.role}`,
    type: 'user',
  })).reverse()

  return (
    <AdminLayout>
      <h2 className="adm-page-title"><span className="ui-title-row"><ShieldCheck className="ui-title-icon" />Admin Dashboard</span></h2>

      <div className="adm-stat-grid">
        {[
          { label: 'Total Users',         value: users.length.toString(),     sub: 'Registered accounts',  subColor: '#7B1D1D', icon: <UsersIcon /> },
          { label: 'Total Mutual Funds',  value: '8',                          sub: 'Available funds',      subColor: '#888',    icon: <FolderIcon /> },
          { label: 'Active Investors',    value: investors.length.toString(),  sub: 'Investor accounts',    subColor: '#888',    icon: <InvestorIcon /> },
          { label: 'Advisors Registered', value: advisors.length.toString(),   sub: 'Financial advisors',   subColor: '#7B1D1D', icon: <PulseIcon /> },
        ].map(s => (
          <div className="adm-stat-card" key={s.label}>
            <div>
              <p className="adm-stat-label">{s.label}</p>
              <p className="adm-stat-value">{s.value}</p>
              <p className="adm-stat-sub" style={{ color: s.subColor }}>{s.sub}</p>
            </div>
            <span className="adm-stat-icon">{s.icon}</span>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <h3 className="adm-card-title">Recent Activity Log</h3>
        {activity.length === 0 ? (
          <p style={{ color: '#888', padding: '1.5rem', textAlign: 'center' }}>No registered users yet.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((a, i) => {
                const c = TYPE_COLOR[a.type]
                return (
                  <tr key={i}>
                    <td className="adm-td-muted">{a.time}</td>
                    <td className="adm-td-link">{a.user}</td>
                    <td>{a.action}</td>
                    <td>
                      <span className="adm-type-chip" style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                        {a.type}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
