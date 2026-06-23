import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowIcon, SearchIcon, SettingsIcon, StarIcon } from '../components/Icons'
import { ErrorState, Spinner } from '../components/States'
import { getToken, searchEverything } from '../lib/tmdb'
import { creditYear, imageUrl } from '../lib/utils'
import type { MultiSearchResult, PersonSearchResult, TitleSearchResult } from '../types'

export default function Home() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') || ''
  const [query, setQuery] = useState(initial)
  const [results, setResults] = useState<MultiSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const hasToken = Boolean(getToken())

  useEffect(() => {
    if (!initial || !hasToken) return
    let live = true
    setLoading(true)
    setError('')
    searchEverything(initial)
      .then(data => {
        if (live) setResults(data.results.filter(item => item.media_type === 'person' || item.media_type === 'movie' || item.media_type === 'tv'))
      })
      .catch(err => { if (live) setError(err.message) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [initial, hasToken])

  const people = useMemo(() => results.filter((item): item is PersonSearchResult => item.media_type === 'person'), [results])
  const movies = useMemo(() => results.filter((item): item is TitleSearchResult => item.media_type === 'movie'), [results])
  const shows = useMemo(() => results.filter((item): item is TitleSearchResult => item.media_type === 'tv'), [results])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const clean = query.trim()
    if (clean) setParams({ q: clean })
  }

  return <>
    <section className={`hero-grid px-5 sm:px-8 ${initial ? 'pb-12 pt-16' : 'min-h-[68vh] py-24 sm:py-32'}`}>
      <div className="relative mx-auto max-w-4xl text-center">
        {!initial && <>
          <p className="eyebrow">Film, TV & people search</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[.98] tracking-[-.045em] sm:text-7xl lg:text-[5.5rem]">Where do I know<br/><span className="text-gradient">that from?</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/48 sm:text-lg">Search actors, crew, movies, and shows. Open a person to see credits separated by acting, directing, producing, writing, and more.</p>
        </>}
        {initial && <h1 className="font-display text-3xl font-semibold sm:text-4xl">Search CastBack</h1>}
        <form onSubmit={submit} className={`search-shell mx-auto ${initial ? 'mt-7' : 'mt-10'}`}>
          <SearchIcon className="h-6 w-6 shrink-0 text-gold"/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search actors, directors, movies, shows..." aria-label="Search people, movies, and TV shows" />
          <button type="submit" disabled={!query.trim() || !hasToken}>Search <ArrowIcon className="h-4 w-4"/></button>
        </form>
        {!hasToken && <div className="mx-auto mt-5 flex max-w-xl items-center justify-center gap-2 text-sm text-amber-200/75"><SettingsIcon className="h-4 w-4"/><span>Add your TMDb token in <Link to="/settings" className="border-b border-amber-200/40 text-amber-100">Settings</Link> to start searching.</span></div>}
        {!initial && <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[.16em] text-white/25"><span>Actors</span><i/><span>Movies</span><i/><span>Shows</span><i/><span>Crew</span></div>}
      </div>
    </section>

    {initial && <section className="mx-auto min-h-[45vh] max-w-6xl px-5 pb-24 sm:px-8">
      <div className="mb-7 flex items-end justify-between"><div><p className="eyebrow">Search results</p><h2 className="mt-2 font-display text-2xl font-semibold">Matches for "{initial}"</h2></div>{!loading && results.length > 0 && <span className="text-sm text-white/35">{results.length} results</span>}</div>
      {loading ? <Spinner label="Searching TMDb..."/> : error ? <ErrorState message={error === 'TMDB_TOKEN_INVALID' ? 'Your TMDb token was rejected. Update it in Settings and try again.' : 'TMDb could not be reached. Check your connection and try again.'} action={<Link to="/settings" className="button-secondary">Open settings</Link>}/> : results.length === 0 ? <div className="state-card"><SearchIcon className="mb-4 h-8 w-8 text-white/25"/><h2 className="font-display text-xl">No matches found</h2><p className="mt-2 text-sm text-white/45">Try a title, full name, or alternate spelling.</p></div> : <div className="space-y-10">
        <ResultSection title="People" count={people.length}>{people.map(person => <PersonCard key={`person-${person.id}`} person={person}/>)}</ResultSection>
        <ResultSection title="Movies" count={movies.length}>{movies.map(title => <TitleCard key={`movie-${title.id}`} title={title}/>)}</ResultSection>
        <ResultSection title="TV Shows" count={shows.length}>{shows.map(title => <TitleCard key={`tv-${title.id}`} title={title}/>)}</ResultSection>
      </div>}
    </section>}
  </>
}

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (!count) return null
  return <section>
    <div className="mb-4 flex items-baseline gap-3"><h3 className="font-display text-xl font-semibold">{title}</h3><span className="text-sm text-white/28">{count}</span></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
}

function PersonCard({ person }: { person: PersonSearchResult }) {
  const img = imageUrl(person.profile_path, 'profile')
  const known = person.known_for.map(item => item.title || item.name).filter(Boolean).slice(0, 3).join(' · ')
  return <Link to={`/person/${person.id}`} className="person-card group">
    <div className="h-28 w-22 shrink-0 overflow-hidden rounded-lg bg-white/5">{img ? <img src={img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/> : <div className="grid h-full place-items-center font-display text-3xl text-white/20">{person.name.charAt(0)}</div>}</div>
    <div className="min-w-0 flex-1"><span className="dept-badge">{person.known_for_department || 'Person'}</span><h3 className="mt-2 truncate font-display text-xl font-semibold group-hover:text-gold">{person.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-white/42">{known || 'Credits available on profile'}</p></div>
    <ArrowIcon className="h-5 w-5 self-center text-white/20 transition group-hover:translate-x-1 group-hover:text-gold"/>
  </Link>
}

function TitleCard({ title }: { title: TitleSearchResult }) {
  const img = imageUrl(title.poster_path)
  const label = title.title || title.name || 'Untitled'
  return <Link to={`/title/${title.media_type}/${title.id}`} className="person-card group">
    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">{img ? <img src={img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/> : <div className="grid h-full place-items-center font-display text-3xl text-white/20">{label.charAt(0)}</div>}</div>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`media-badge static ${title.media_type}`}>{title.media_type === 'movie' ? 'Movie' : 'TV'}</span><span className="text-xs text-white/35">{creditYear(title)}</span>{title.vote_average > 0 && <span className="inline-flex items-center gap-1 text-xs text-white/45"><StarIcon className="h-3 w-3 text-gold"/>{title.vote_average.toFixed(1)}</span>}</div><h3 className="mt-2 truncate font-display text-xl font-semibold group-hover:text-gold">{label}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-white/42">{title.overview || 'Open on TMDb for cast, crew, and details.'}</p></div>
    <ArrowIcon className="h-5 w-5 self-center text-white/20 transition group-hover:translate-x-1 group-hover:text-gold"/>
  </Link>
}
