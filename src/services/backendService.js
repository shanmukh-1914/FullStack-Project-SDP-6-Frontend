import {
  apiRequest,
  clearSession,
  loadCurrentUser,
  saveCurrentUser,
  setToken,
  toBackendRole,
  toUiRole,
} from './apiClient'

function mapAuthUser(data) {
  return {
    id: data.id,
    fullName: data.fullName,
    email: data.email,
    role: toUiRole(data.role),
    roleKey: data.role,
  }
}

function mapFund(fund) {
  return {
    ...fund,
    nav: Number(fund.nav || 0),
    ret1: Number(fund.returns1yr || 0),
    ret3: Number(fund.returns3yr || 0),
    ret5: Number(fund.returns5yr || 0),
    minInvestment: fund.minInvest || 'Rs 500',
  }
}

function mapInvestment(inv) {
  return {
    id: inv.id,
    fundId: inv.fundId,
    name: inv.fundName,
    category: inv.category,
    risk: inv.risk,
    invested: Number(inv.amountInvested || 0),
    units: Number(inv.units || 0),
    nav: Number(inv.navAtPurchase || 0),
    current: Number(inv.currentValue || 0),
    gains: Number(inv.gains || 0),
    gainPct: Number(inv.gainPercent || 0),
    status: inv.status,
    investmentDate: inv.investmentDate,
  }
}

function mapContentItem(item) {
  const status = item.status ? `${item.status[0]}${item.status.slice(1).toLowerCase()}` : 'Draft'
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    content: item.content,
    keyTakeaways: item.keyTakeaways,
    status,
    views: item.views || 0,
    date: item.createdDate,
    authorId: item.authorId,
    authorName: item.authorName,
  }
}

function mapUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: toUiRole(user.role),
    roleKey: user.role,
    status: user.status ? `${user.status[0]}${user.status.slice(1).toLowerCase()}` : 'Active',
    phone: user.phone || '',
    pan: user.pan || '',
    address: user.address || '',
    profilePic: user.profilePic || '',
    preferences: {
      riskAppetite: user.riskAppetite || 'Moderate',
      horizon: user.investmentHorizon || 'Medium Term (3-5 years)',
      sipBudget: user.sipBudget ? String(user.sipBudget) : '15000',
    },
    joinDate: user.joinDate,
  }
}

function mapQuery(item) {
  const rawStatus = String(item.status || '').toUpperCase()
  const isResponded = rawStatus === 'ANSWERED' || rawStatus === 'REPLIED' || rawStatus === 'RESPONDED' || !!item.replyText
  return {
    id: item.id,
    investorId: item.investorId,
    name: item.investorName,
    email: item.investorEmail,
    query: item.queryText,
    response: item.replyText || '',
    repliedByName: item.repliedByName || '',
    status: isResponded ? 'Responded' : 'Pending',
    time: item.createdAt,
    repliedAt: item.repliedAt,
  }
}

/* ================= AUTH ================= */

export async function registerUser({ fullName, email, password, role }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, role: toBackendRole(role) }),
  })
}

export async function loginUser({ email, password }) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  setToken(data.token)
  const user = mapAuthUser(data)
  saveCurrentUser(user)
  return user
}

export { loadCurrentUser, saveCurrentUser }

export function logoutUser() {
  clearSession()
}

/* ================= INVESTOR ================= */

export async function getFunds() {
  const data = await apiRequest('/investor/funds')
  return (data || []).map(mapFund)
}

export async function getFundById(id) {
  const data = await apiRequest(`/investor/funds/${id}`)
  return mapFund(data)
}

export async function investInFund(userId, fundId, amount) {
  const data = await apiRequest(`/investor/invest/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ fundId, amount: Number(amount) }),
  })
  return mapInvestment(data)
}

export async function getPortfolio(userId) {
  const data = await apiRequest(`/investor/portfolio/${userId}`)
  return (data || []).map(mapInvestment)
}

export async function getPublishedContent() {
  const data = await apiRequest('/investor/content')
  return (data || []).map(mapContentItem)
}

export async function getUserProfile(id) {
  const data = await apiRequest(`/investor/profile/${id}`)
  return mapUser(data)
}

export async function updateUserProfile(id, payload) {
  const data = await apiRequest(`/investor/profile/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      pan: payload.pan,
      address: payload.address,
      riskAppetite: payload.preferences?.riskAppetite,
      investmentHorizon: payload.preferences?.horizon,
      sipBudget: Number(payload.preferences?.sipBudget || 0),
    }),
  })
  return mapUser(data)
}

export async function submitInvestorQuery(investorId, queryText) {
  const data = await apiRequest(`/investor/queries/${investorId}`, {
    method: 'POST',
    body: JSON.stringify({ queryText }),
  })
  return mapQuery(data)
}

export async function getMyQueries(investorId) {
  const data = await apiRequest(`/investor/queries/${investorId}`)
  return (data || []).map(mapQuery)
}

/* ================= ADMIN ================= */

export async function getAdminContent() {
  const data = await apiRequest('/admin/content')
  return (data || []).map(mapContentItem)
}

export async function createFund(payload) {
  const data = await apiRequest('/admin/funds', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapFund(data)
}

export async function updateFund(id, payload) {
  const data = await apiRequest(`/admin/funds/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return mapFund(data)
}

export async function updateFundNav(id, nav) {
  const data = await apiRequest(`/admin/funds/${id}/nav`, {
    method: 'PUT',
    body: JSON.stringify({ nav: Number(nav) }),
  })
  return mapFund(data)
}

export async function getAllUsers() {
  const data = await apiRequest('/admin/users')
  return (data || []).map(mapUser)
}

export async function toggleUserStatus(id) {
  await apiRequest(`/admin/users/${id}/toggle-status`, { method: 'PUT' })
}
/* ================= ADVISOR ================= */

export async function getAdvisorContent() {
  const data = await apiRequest('/advisor/content')
  return (data || []).map(mapContentItem)
}

export async function createAdvisorContent(authorId, payload) {
  const data = await apiRequest(`/advisor/content/${authorId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapContentItem(data)
}

export async function updateAdvisorContent(id, payload) {
  const data = await apiRequest(`/advisor/content/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return mapContentItem(data)
}

export async function deleteAdvisorContent(id) {
  await apiRequest(`/advisor/content/${id}`, { method: 'DELETE' })
}

export async function getAdvisorQueries() {
  const data = await apiRequest('/advisor/queries')
  return (data || []).map(mapQuery)
}

export async function replyToInvestorQuery(queryId, advisorId, replyText) {
  const data = await apiRequest(`/advisor/queries/${queryId}/reply/${advisorId}`, {
    method: 'PUT',
    body: JSON.stringify({ replyText }),
  })
  return mapQuery(data)
}

/* ================= ANALYST ================= */

export async function getAnalystReports() {
  const data = await apiRequest('/analyst/reports')
  return (data || []).map(mapReport)
}

export async function createAnalystReport(analystId, payload) {
  const data = await apiRequest(`/analyst/reports/${analystId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapReport(data)
}

export async function getAnalystAnalytics() {
  return apiRequest('/analyst/analytics')
}

function mapReport(item) {
  return {
    id: item.id,
    title: item.title,
    type: item.reportType,
    period: item.generatedAt ? item.generatedAt.slice(0, 10) : 'N/A',
    size: item.filePath ? 'Linked' : 'N/A',
    generated: item.generatedAt ? item.generatedAt.slice(0, 10) : 'N/A',
    description: item.description,
    filePath: item.filePath,
    generatedById: item.generatedById,
    generatedByName: item.generatedByName,
  }
}
