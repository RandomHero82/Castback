import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronDown, ExternalIcon, StarIcon } from '../components/Icons'
import { ErrorState, Spinner } from '../components/States'
import { getPersonBundle } from '../lib/tmdb'
import { creditDate, creditTitle, creditYear, dedupeCredits, formatDate, imageUrl } from '../lib/utils'
import type { CombinedCredits, Credit, ExternalIds, Person } from '../types'

type Filter = 'all' | 'movie' | 'tv' | `department:${string}`
type Sort = 'popularity' | 'year' | 'rating' | 'title'

export default function PersonDetail() {
  const { id = '' } = useParams()
  const [data, setData] = useState<{person: Person; credits: CombinedCredits; externalIds: ExternalIds} | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [decade, setDecade] = useState('all')
  const [sort, setSort] = useState<Sort>('popularity')

  useEffect(() => { let live = true; setLoading(true); getPersonBundle(id).then(x => live && setData(x)).catch(e => live && setError(e.message)).finally(() => live && setLoading(false)); return () => { live = false } }, [id])

  const allCredits = useMemo(() => data ? dedupeCredits([...data.credits.cast.map(c => ({...c, department: castDepartment(c)})), ...data.credits.crew.map(c => ({ ...c, department: c.department || 'Crew' }))]) : [], [data])
  const departmentCounts = useMemo(() => allCredits.reduce((counts, credit) => {
    const department = credit.department || 'Crew'
    counts.set(department, (counts.get(department) || 0) + 1)
    return counts
  }, new Map<string, number>()), [allCredits])
  const departments = useMemo(() => [...departmentCounts.entries()].sort((a, b) => b[1] - a[1]).map(([department]) => department), [departmentCounts])
  const decades = useMemo(() => [...new Set(allCredits.map(c => creditYear(c)).filter(y => y !== 'TBA').map(y => `${Math.floor(Number(y) / 10) * 10}s`))].sort().reverse(), [allCredits])
  const filtered = useMemo(() => allCredits.filter(c => {
    if (filter === 'movie' && c.media_type !== 'movie') return false
    if (filter === 'tv' && c.media_type !== 'tv') return false
    if (filter.startsWith('department:') && c.department !== filter.replace('department:', '')) return false
    if (decade !== 'all' && !creditYear(c).startsWith(decade.slice(0, 3))) return false
    return true
  }).sort((a,b) => sort === 'popularity' ? b.popularity-a.popularity : sort === 'year' ? creditDate(b).localeCompare(creditDate(a)) : sort === 'rating' ? b.vote_average-a.vote_average : creditTitle(a).localeCompare(creditTitle(b))), [allCredits, filter, decade, sort])
  const groupedCredits = useMemo(() => {
    const groups = new Map<string, Credit[]>()
    for (const credit of filtered) {
      const department = credit.department || 'Crew'
      groups.set(department, [...(groups.get(department) || []), credit])
    }
    return [...groups.entries()].sort((a, b) => {
      if (filter.startsWith('department:')) return 0
      return (departmentCounts.get(b[0]) || 0) - (departmentCounts.get(a[0]) || 0)
    })
  }, [departmentCounts, filter, filtered])

  if (loading) return <div className="min-h-[75vh]"><Spinner label="Loading person and credits…"/></div>
  if (error || !data) return <div className="mx-auto min-h-[75vh] max-w-3xl px-5 py-16"><ErrorState message={error === 'TMDB_TOKEN_INVALID' ? 'Your TMDb token was rejected.' : 'We couldn’t load this person from TMDb.'} action={<Link className="button-secondary" to="/settings">Check settings</Link>}/></div>

  const { person, externalIds } = data
  const highlights = [...allCredits].filter(c => c.poster_path && c.vote_count > 25).sort((a,b) => (b.popularity * .65 + b.vote_average * 4) - (a.popularity * .65 + a.vote_average * 4)).slice(0,5)
  return <>
    <section className="profile-hero"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[220px_1fr] md:py-16">
      <div className="mx-auto w-48 md:mx-0 md:w-full"><ProfileImage person={person}/></div>
      <div className="self-end"><p className="eyebrow">{person.known_for_department || 'Film & television'}</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.035em] sm:text-6xl">{person.name}</h1><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">{person.birthday && <span><b>Born</b> {formatDate(person.birthday)}</span>}{person.deathday && <span><b>Died</b> {formatDate(person.deathday)}</span>}{person.place_of_birth && <span>{person.place_of_birth}</span>}</div><ExternalLinks person={person} ids={externalIds}/>{person.biography ? <p className="mt-7 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">{person.biography}</p> : <p className="mt-7 text-white/35">No biography is available.</p>}</div>
    </div></section>

    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="mb-7"><p className="eyebrow">The quick answer</p><h2 className="mt-2 font-display text-3xl font-semibold">Where do I know them from?</h2></div>{highlights.length ? <div className="highlight-grid">{highlights.map((c,i) => <HighlightCard key={c.credit_id + i} credit={c} rank={i+1}/>)}</div> : <p className="text-white/40">No ranked credits are available.</p>}</section>

    <section className="border-t border-white/8 bg-white/[.015]"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Filmography</p><h2 className="mt-2 font-display text-3xl font-semibold">Credits by department <span className="text-white/20">{filtered.length}</span></h2></div><div className="select-wrap"><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value as Sort)}><option value="popularity">Popularity</option><option value="year">Release year</option><option value="rating">Rating</option><option value="title">Title</option></select><ChevronDown className="h-4 w-4"/></div></div>
      <div className="mt-7 flex flex-col gap-4 border-y border-white/8 py-4 lg:flex-row lg:items-center lg:justify-between"><div className="filter-row"><button onClick={() => setFilter('all')} className={filter === 'all' ? 'selected' : ''}>All credits</button><button onClick={() => setFilter('movie')} className={filter === 'movie' ? 'selected' : ''}>Movies</button><button onClick={() => setFilter('tv')} className={filter === 'tv' ? 'selected' : ''}>TV</button>{departments.map(department => { const value = `department:${department}` as Filter; return <button key={department} onClick={() => setFilter(value)} className={filter === value ? 'selected' : ''}>{department} <span className="text-white/28">{departmentCounts.get(department)}</span></button> })}</div><div className="select-wrap decade"><select value={decade} onChange={e => setDecade(e.target.value)}><option value="all">All decades</option>{decades.map(d => <option key={d}>{d}</option>)}</select><ChevronDown className="h-4 w-4"/></div></div>
      {filtered.length ? <div className="mt-8 space-y-9">{groupedCredits.map(([department, credits]) => <section key={department}><div className="mb-3 flex items-baseline gap-3"><h3 className="font-display text-xl font-semibold">{department}</h3><span className="text-sm text-white/28">{credits.length}</span></div><div className="divide-y divide-white/7">{credits.map((c,i) => <CreditRow key={c.credit_id + i} credit={c}/>)}</div></section>)}</div> : <div className="state-card mt-8"><h3 className="font-display text-xl">No matching credits</h3><p className="mt-2 text-sm text-white/45">Try changing or clearing a filter.</p></div>}
    </div></section>
  </>
}

function ProfileImage({ person }: {person: Person}) { const src=imageUrl(person.profile_path,'profile'); return <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">{src ? <img src={src} alt={person.name} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center font-display text-6xl text-white/15">{person.name[0]}</div>}</div> }
function castDepartment(credit: Credit) {
  const role = (credit.character || '').toLowerCase()
  const appearanceTerms = ['self', 'himself', 'herself', 'themself', 'guest', 'host', 'presenter', 'narrator', 'announcer', 'interviewer', 'archive footage', 'archival footage', 'cameo']
  return appearanceTerms.some(term => role.includes(term)) ? 'Appearances' : 'Acting'
}
function ExternalLinks({person,ids}:{person:Person;ids:ExternalIds}) { const links=[person.homepage&&['Website',person.homepage],ids.imdb_id&&['IMDb',`https://www.imdb.com/name/${ids.imdb_id}`],ids.instagram_id&&['Instagram',`https://instagram.com/${ids.instagram_id}`],ids.twitter_id&&['X',`https://x.com/${ids.twitter_id}`]].filter(Boolean) as string[][]; if(!links.length)return null; return <div className="mt-5 flex flex-wrap gap-2">{links.map(([label,url])=><a key={label} href={url} target="_blank" rel="noreferrer" className="external-link">{label}<ExternalIcon className="h-3.5 w-3.5"/></a>)}</div> }
function HighlightCard({credit,rank}:{credit:Credit;rank:number}) { const src=imageUrl(credit.poster_path); return <article className="highlight-card group"><div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5">{src&&<img src={src} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>}<span className="rank">{String(rank).padStart(2,'0')}</span><span className={`media-badge ${credit.media_type}`}>{credit.media_type === 'movie'?'Movie':'TV'}</span></div><h3 className="mt-3 line-clamp-1 font-display text-lg font-semibold">{creditTitle(credit)}</h3><div className="mt-1 flex items-center gap-2 text-xs text-white/42"><span>{creditYear(credit)}</span>{credit.vote_average>0&&<><i/><span className="inline-flex items-center gap-1"><StarIcon className="h-3 w-3 text-gold"/>{credit.vote_average.toFixed(1)}</span></>}</div></article> }
function CreditRow({credit}:{credit:Credit}) { const src=imageUrl(credit.poster_path); return <article className="credit-row"><div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-white/5">{src?<img src={src} alt="" className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center text-white/15">—</div>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`media-badge static ${credit.media_type}`}>{credit.media_type==='movie'?'Movie':'TV'}</span><span className="dept-badge">{credit.department || 'Credit'}</span><span className="text-xs text-white/35">{creditYear(credit)}</span></div><h3 className="mt-1.5 truncate font-display text-lg font-semibold">{creditTitle(credit)}</h3><p className="mt-1 truncate text-sm text-white/40">{credit.character ? `as ${credit.character}` : credit.job || credit.department || 'Credit'}</p></div><div className="hidden gap-8 text-right sm:flex"><Metric label="Rating" value={credit.vote_average ? credit.vote_average.toFixed(1) : '—'} star/><Metric label="Popularity" value={credit.popularity ? credit.popularity.toFixed(0) : '—'}/></div></article> }
function Metric({label,value,star}:{label:string;value:string;star?:boolean}) { return <div className="w-16"><p className="text-[10px] uppercase tracking-wider text-white/25">{label}</p><p className="mt-1 inline-flex items-center gap-1 font-mono text-sm text-white/65">{star&&<StarIcon className="h-3 w-3 text-gold"/>}{value}</p></div> }
