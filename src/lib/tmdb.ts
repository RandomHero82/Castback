import type { CombinedCredits, ExternalIds, ImageConfig, MultiSearchResult, Person, SearchResponse, TitleCredits, TitleDetail } from '../types'

const TOKEN_KEY = 'castback_tmdb_token'
const CACHE_PREFIX = 'castback_cache_v1:'
const SIX_HOURS = 6 * 60 * 60 * 1000
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000

type CacheEntry<T> = { expires: number; data: T }

export const getToken = () => localStorage.getItem(TOKEN_KEY) ?? ''
export const saveToken = (token: string) => {
  const cleaned = token.trim().replace(/^Bearer\s+/i, '')
  localStorage.setItem(TOKEN_KEY, cleaned)
}
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (Date.now() > entry.expires) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return entry.data
  } catch { return null }
}

function cacheSet<T>(key: string, data: T, ttl = SIX_HOURS) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ expires: Date.now() + ttl, data }))
  } catch {
    // A full or disabled localStorage should never block the app.
  }
}

async function request<T>(path: string, ttl = SIX_HOURS): Promise<T> {
  const cached = cacheGet<T>(path)
  if (cached) return cached
  const token = getToken()
  if (!token) throw new Error('TMDB_TOKEN_MISSING')
  const isBearerToken = token.startsWith('eyJ')
  const separator = path.includes('?') ? '&' : '?'
  const url = isBearerToken
    ? `https://api.themoviedb.org/3${path}`
    : `https://api.themoviedb.org/3${path}${separator}api_key=${encodeURIComponent(token)}`
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      ...(isBearerToken ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (response.status === 401) throw new Error('TMDB_TOKEN_INVALID')
  if (!response.ok) throw new Error(`TMDB_ERROR_${response.status}`)
  const data = await response.json() as T
  cacheSet(path, data, ttl)
  return data
}

export const searchPeople = (query: string, page = 1) =>
  request<SearchResponse>(`/search/person?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`)

export const searchEverything = (query: string, page = 1) =>
  request<SearchResponse<MultiSearchResult>>(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`)

export const getPersonBundle = async (id: string) => {
  const [person, credits, externalIds] = await Promise.all([
    request<Person>(`/person/${id}?language=en-US`),
    request<CombinedCredits>(`/person/${id}/combined_credits?language=en-US`),
    request<ExternalIds>(`/person/${id}/external_ids`),
  ])
  return { person, credits, externalIds }
}

export const getTitleBundle = async (mediaType: 'movie' | 'tv', id: string) => {
  const [title, credits] = await Promise.all([
    request<TitleDetail>(`/${mediaType}/${id}?language=en-US`),
    request<TitleCredits>(`/${mediaType}/${id}/credits?language=en-US`),
  ])
  return { title: { ...title, media_type: mediaType }, credits }
}

export const getImageConfig = () => request<{ images: ImageConfig }>('/configuration', SEVEN_DAYS)

export const clearCache = () => {
  Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX)).forEach(k => localStorage.removeItem(k))
}
