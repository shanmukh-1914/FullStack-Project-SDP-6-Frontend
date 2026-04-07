import { createContext, useContext, useState, useEffect } from 'react'
import {
  getAdvisorContent,
  getPortfolio,
  getPublishedContent,
  createAdvisorContent,
  updateAdvisorContent,
  loadCurrentUser,
  logoutUser,
  saveCurrentUser,
} from '../services/backendService'

const InvestmentContext = createContext(null)

export function InvestmentProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(loadCurrentUser)
  const [investments, setInvestments] = useState([])
  const [educationalContent, setEducationalContent] = useState([])

  useEffect(() => {
    if (!currentUser?.id) {
      setInvestments([])
      return
    }
    getPortfolio(currentUser.id).then(setInvestments).catch(() => setInvestments([]))
  }, [currentUser?.id])

  useEffect(() => {
    const loadContent = currentUser?.role === 'Financial Advisor' ? getAdvisorContent : getPublishedContent
    loadContent().then(setEducationalContent).catch(() => setEducationalContent([]))
  }, [currentUser?.role])

  const setCurrentUser = (user) => {
    setCurrentUserState(user)
    saveCurrentUser(user)
  }

  const logout = () => {
    logoutUser()
    setCurrentUser(null)
  }

  const refreshPortfolio = async () => {
    if (!currentUser?.id) return
    const portfolio = await getPortfolio(currentUser.id)
    setInvestments(portfolio)
  }

  const refreshEducationalContent = async () => {
    const loadContent = currentUser?.role === 'Financial Advisor' ? getAdvisorContent : getPublishedContent
    const content = await loadContent()
    setEducationalContent(content)
  }

  const upsertEducationalArticle = async (articleData, editId = null) => {
    if (!currentUser?.id) throw new Error('Login required')

    const payload = {
      title: articleData.title,
      category: articleData.category,
      content: articleData.content,
      keyTakeaways: articleData.keyTakeaways,
      status: articleData.status,
    }

    if (editId) {
      await updateAdvisorContent(editId, payload)
    } else {
      await createAdvisorContent(currentUser.id, payload)
    }
    await refreshEducationalContent()
  }

  return (
    <InvestmentContext.Provider value={{
      investments,
      currentUser,
      setCurrentUser,
      logout,
      educationalContent,
      upsertEducationalArticle,
      refreshPortfolio,
      refreshEducationalContent,
    }}>
      {children}
    </InvestmentContext.Provider>
  )
}

export const useInvestments = () => useContext(InvestmentContext)
