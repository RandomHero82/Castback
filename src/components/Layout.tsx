import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { SearchIcon, SettingsIcon } from './Icons'
import { getImageConfig, getToken } from '../lib/tmdb'
import { setImageBaseUrl } from '../lib/utils'

export default function Layout() {
  useEffect(() => {
    if (!getToken()) return
    getImageConfig().then(config => setImageBaseUrl(config.images.secure_base_url)).catch(() => {})
  }, [])
  return <div className="min-h-screen bg-ink text-white">
    <header className="sticky top-0 z-50 border-b border-white/8 bg-ink/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="CastBack home">
          <span className="logo-mark">C</span>
          <span className="font-display text-xl font-semibold tracking-tight">Cast<span className="text-gold">Back</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-white/55">
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><SearchIcon className="h-4 w-4"/><span className="hidden sm:inline">Search</span></NavLink>
          <NavLink to="/settings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><SettingsIcon className="h-4 w-4"/><span className="hidden sm:inline">Settings</span></NavLink>
        </nav>
      </div>
    </header>
    <main><Outlet /></main>
    <footer className="border-t border-white/8 px-5 py-8 text-center text-xs text-white/35">
      CastBack uses the TMDb API but is not endorsed or certified by TMDb.
    </footer>
  </div>
}
