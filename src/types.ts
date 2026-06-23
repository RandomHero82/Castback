export interface KnownFor {
  id: number
  media_type: 'movie' | 'tv'
  title?: string
  name?: string
  release_date?: string
  first_air_date?: string
}

export interface PersonSearchResult {
  id: number
  media_type: 'person'
  name: string
  profile_path: string | null
  known_for_department: string
  popularity: number
  known_for: KnownFor[]
}

export interface SearchResponse<T = PersonSearchResult> {
  page: number
  total_pages: number
  total_results: number
  results: T[]
}

export interface TitleSearchResult {
  id: number
  media_type: 'movie' | 'tv'
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  popularity: number
  vote_average: number
  vote_count: number
}

export type MultiSearchResult = PersonSearchResult | TitleSearchResult

export interface Person {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  homepage: string | null
}

export interface Credit {
  id: number
  credit_id: string
  media_type: 'movie' | 'tv'
  title?: string
  name?: string
  release_date?: string
  first_air_date?: string
  poster_path: string | null
  character?: string
  job?: string
  department?: string
  popularity: number
  vote_average: number
  vote_count: number
}

export interface CombinedCredits { cast: Credit[]; crew: Credit[] }

export interface ExternalIds {
  imdb_id: string | null
  instagram_id: string | null
  facebook_id: string | null
  twitter_id: string | null
  tiktok_id: string | null
  youtube_id: string | null
}

export interface ImageConfig {
  secure_base_url: string
  profile_sizes: string[]
  poster_sizes: string[]
}
