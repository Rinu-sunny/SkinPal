const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || `Request failed with ${response.status}`
    throw new Error(message)
  }

  return payload
}

export function apiLogin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function apiSignup(email, password, name) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
}

export function apiAnalyze(userId, imageBase64) {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, image: imageBase64 }),
  })
}

export function apiProfile(userId, params = {}) {
  const searchParams = new URLSearchParams()
  if (params.limit) searchParams.append('limit', params.limit)
  if (params.offset !== undefined) searchParams.append('offset', params.offset)
  
  const queryString = searchParams.toString()
  const url = queryString ? `/profile/${userId}?${queryString}` : `/profile/${userId}`
  
  return request(url)
}

export function apiProducts(skinType) {
  return request(`/products/${encodeURIComponent(skinType)}`)
}
