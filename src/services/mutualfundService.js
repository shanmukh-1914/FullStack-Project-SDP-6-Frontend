
import { getFunds } from './backendService'

export const getAllSchemes = async () => {
  const funds = await getFunds()
  return funds.map((fund) => ({
    schemeCode: fund.id,
    schemeName: fund.name,
  }))
}

// Keeps the previous function name used by pages, but now reads from backend.
export const getSchemeNAV = async (fundId) => {
  const funds = await getFunds()
  const fund = funds.find((f) => Number(f.id) === Number(fundId))
  if (!fund) throw new Error(`Fund not found for id ${fundId}`)

  return {
    meta: {
      scheme_name: fund.name,
      scheme_code: fund.id,
      scheme_category: fund.category,
    },
    data: [{
      date: new Date().toISOString().slice(0, 10),
      nav: String(fund.nav),
    }],
  }
}

export const getLatestNAV = async (fundId) => {
  const data = await getSchemeNAV(fundId)
  return data?.data?.[0]?.nav ?? null
}
