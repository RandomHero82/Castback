export interface Genre {
  id: number
  name: string
}

export interface TitleDetail {
  id: number
  media_type?: 'movie' | 'tv'
  title?: string
  name?: string
  tagline?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  runtime?: number | null
  episode_run_time?: number[]
  number_of_seasons?: number
  number_of_episodes?: number
  status: string
  homepage: string | null
  genres: Genre[]
  popularity: number
  vote_average: number
  vote_count: number
}

export interface TitleCastMember {
  id: number
  credit_id: string
  name: string
  character: string
  profile_path: string | null
  order: number
  known_for_department?: string
}

export interface TitleCrewMember {
  id: number
  credit_id: string
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TitleCredits {
  cast: TitleCastMember[]
  crew: TitleCrewMember[]
}
