const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
const TOKEN_KEY = 'mfp_auth_token'
const CURRENT_USER_KEY = 'mfp_current_user'

const BACKEND_TO_UI_ROLE = {
  INVESTOR: 'Investor',
  ADMIN: 'Admin',
  FINANCIAL_ADVISOR: 'Financial Advisor',
  DATA_ANALYST: 'Data Analyst',
}

const UI_TO_BACKEND_ROLE = {
  Investor: 'Investor',
  Admin: 'Admin',
  'Financial Advisor': 'Financial Advisor',
  'Data Analyst': 'Data Analyst',
}

function parseBody(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY)
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY)
    return
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function toUiRole(role) {
  return BACKEND_TO_UI_ROLE[role] || role || 'Investor'
}

export function toBackendRole(role) {
  return UI_TO_BACKEND_ROLE[role] || 'Investor'
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const token = getToken()
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const text = await response.text()
  const payload = parseBody(text)

  if (!response.ok) {
    const message = payload?.message || payload?.error || text || `Request failed: ${response.status}`
    throw new Error(message)
  }

  return payload
}
