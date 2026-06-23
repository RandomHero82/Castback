import type { Credit } from '../types'

let imageBaseUrl = 'https://image.tmdb.org/t/p/'
export const setImageBaseUrl = (base: string) => { imageBaseUrl = base.endsWith('/') ? base : `${base}/` }

export const imageUrl = (path: string | null | undefined, size: 'profile' | 'poster' = 'poster') =>
  path ? `${imageBaseUrl}${size === 'profile' ? 'h632' : 'w342'}${path}` : null

export const creditTitle = (credit: Credit) => credit.title || credit.name || 'Untitled'
export const creditDate = (credit: Credit) => credit.release_date || credit.first_air_date || ''
export const creditYear = (credit: Credit) => creditDate(credit).slice(0, 4) || 'TBA'

export const formatDate = (date: string | null) => {
  if (!date) return null
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
}

export const dedupeCredits = (credits: Credit[]) => {
  const seen = new Map<string, Credit>()
  for (const credit of credits) {
    const role = credit.character || credit.job || ''
    const key = `${credit.media_type}-${credit.id}-${role}`
    if (!seen.has(key)) seen.set(key, credit)
  }
  return [...seen.values()]
}
