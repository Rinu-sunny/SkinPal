const SESSION_KEY = 'skinpal_session'
const LAST_ANALYSIS_KEY = 'skinpal_last_analysis'

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(LAST_ANALYSIS_KEY)
}

export function saveLastAnalysis(analysis) {
  localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify(analysis))
}

export function getLastAnalysis() {
  try {
    return JSON.parse(localStorage.getItem(LAST_ANALYSIS_KEY) || 'null')
  } catch {
    return null
  }
}
