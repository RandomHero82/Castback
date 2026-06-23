import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalIcon, StarIcon } from '../components/Icons'
import { ErrorState, Spinner } from '../components/States'
import { getTitleBundle } from '../lib/tmdb'
import { creditYear, imageUrl } from '../lib/utils'
import type { TitleCastMember, TitleCredits, TitleCrewMember, TitleDetail } from '../types'

type MediaType = 'movie' | 'tv'

export default function TitleDetailPage() {
  const { mediaType = 'movie', id = '' } = useParams()
  const safeMediaType: MediaType = mediaType === 'tv' ? 'tv' : 'movie'
  const [data, setData] = useState<{ title: TitleDetail; credits: TitleCredits } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let live = true
    setLoading(true)
    setError('')
    getTitleBundle(safeMediaType, id)
      .then(bundle => { if (live) setData(bundle) })
      .catch(err => { if (live) setError(err.message) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [id, safeMediaType])

  const crewGroups = useMemo(() => {
    const groups = new Map<string, TitleCrewMember[]>()
    for (const member of data?.credits.crew || []) {
      groups.set(member.department, [...(groups.get(member.department) || []), member])
    }
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length)
  }, [data])

  if (loading) return <div className="min-h-[75vh]"><Spinner label="Loading title details..."/></div>
  if (error || !data) return <div className="mx-auto min-h-[75vh] max-w-3xl px-5 py-16"><ErrorState message={error === 'TMDB_TOKEN_INVALID' ? 'Your TMDb token was rejected.' : 'We could not load this title from TMDb.'} action={<Link className="button-secondary" to="/settings">Check settings</Link>}/></div>

  const { title, credits } = data
  const label = title.title || title.name || 'Untitled'
  const poster = imageUrl(title.poster_path)
  const backdrop = imageUrl(title.backdrop_path, 'backdrop')
  const runtime = safeMediaType === 'movie' ? title.runtime : title.episode_run_time?.[0]
  const tmdbUrl = `https://www.themoviedb.org/${safeMediaType}/${title.id}`

  return <>
    <section className="profile-hero overflow-hidden">
      {backdrop && <div className="pointer-events-none absolute inset-0 opacity-20 blur-sm"><img src={backdrop} alt="" className="h-full w-full object-cover"/></div>}
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[220px_1fr] md:py-16">
        <div className="mx-auto w-48 md:mx-0 md:w-full">
          <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">{poster ? <img src={poster} alt={label} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center font-display text-6xl text-white/15">{label[0]}</div>}</div>
        </div>
        <div className="self-end">
          <p className="eyebrow">{safeMediaType === 'movie' ? 'Movie' : 'TV series'}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.035em] sm:text-6xl">{label}</h1>
          {title.tagline && <p className="mt-4 max-w-3xl text-lg italic text-white/55">“{title.tagline}”</p>}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
            <span>{creditYear(title)}</span>
            {runtime ? <span>{runtime} min</span> : null}
            {safeMediaType === 'tv' && title.number_of_seasons ? <span>{title.number_of_seasons} seasons</span> : null}
            {safeMediaType === 'tv' && title.number_of_episodes ? <span>{title.number_of_episodes} episodes</span> : null}
            {title.vote_average > 0 && <span className="inline-flex items-center gap-1"><StarIcon className="h-4 w-4 text-gold"/>{title.vote_average.toFixed(1)} <span className="text-white/30">({title.vote_count.toLocaleString()})</span></span>}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">{title.genres.map(genre => <span key={genre.id} className="dept-badge">{genre.name}</span>)}</div>
          {title.overview ? <p className="mt-7 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">{title.overview}</p> : <p className="mt-7 text-white/35">No overview is available.</p>}
          <div className="mt-6 flex flex-wrap gap-2">{title.homepage && <a href={title.homepage} target="_blank" rel="noreferrer" className="external-link">Website <ExternalIcon className="h-3.5 w-3.5"/></a>}<a href={tmdbUrl} target="_blank" rel="noreferrer" className="external-link">TMDb <ExternalIcon className="h-3.5 w-3.5"/></a></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <div className="mb-7"><p className="eyebrow">Cast</p><h2 className="mt-2 font-display text-3xl font-semibold">Featured cast <span className="text-white/20">{credits.cast.length}</span></h2></div>
      {credits.cast.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{credits.cast.slice(0, 18).map(member => <CastCard key={member.credit_id} member={member}/>)}</div> : <p className="text-white/40">No cast is listed.</p>}
    </section>

    <section className="border-t border-white/8 bg-white/[.015]"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <div className="mb-7"><p className="eyebrow">Crew</p><h2 className="mt-2 font-display text-3xl font-semibold">Crew by department <span className="text-white/20">{credits.crew.length}</span></h2></div>
      {crewGroups.length ? <div className="space-y-8">{crewGroups.map(([department, members]) => <section key={department}><div className="mb-3 flex items-baseline gap-3"><h3 className="font-display text-xl font-semibold">{department}</h3><span className="text-sm text-white/28">{members.length}</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{members.slice(0, 12).map(member => <CrewCard key={member.credit_id} member={member}/>)}</div></section>)}</div> : <p className="text-white/40">No crew is listed.</p>}
    </div></section>
  </>
}

function CastCard({ member }: { member: TitleCastMember }) {
  const img = imageUrl(member.profile_path, 'profile')
  return <Link to={`/person/${member.id}`} className="person-card group">
    <PersonThumb img={img} name={member.name}/>
    <div className="min-w-0 flex-1"><span className="dept-badge">{member.known_for_department || 'Cast'}</span><h3 className="mt-2 truncate font-display text-xl font-semibold group-hover:text-gold">{member.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-white/42">{member.character ? `as ${member.character}` : 'Cast member'}</p></div>
  </Link>
}

function CrewCard({ member }: { member: TitleCrewMember }) {
  const img = imageUrl(member.profile_path, 'profile')
  return <Link to={`/person/${member.id}`} className="person-card group">
    <PersonThumb img={img} name={member.name}/>
    <div className="min-w-0 flex-1"><span className="dept-badge">{member.department}</span><h3 className="mt-2 truncate font-display text-xl font-semibold group-hover:text-gold">{member.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-white/42">{member.job || 'Crew'}</p></div>
  </Link>
}

function PersonThumb({ img, name }: { img: string | null; name: string }) {
  return <div className="h-24 w-18 shrink-0 overflow-hidden rounded-lg bg-white/5">{img ? <img src={img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/> : <div className="grid h-full place-items-center font-display text-3xl text-white/20">{name.charAt(0)}</div>}</div>
}
