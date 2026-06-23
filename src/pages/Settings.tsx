import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalIcon, SettingsIcon } from '../components/Icons'
import { clearCache, clearToken, getToken, saveToken } from '../lib/tmdb'

export default function Settings() {
  const [token, setToken] = useState(getToken())
  const [saved, setSaved] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); saveToken(token); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const remove = () => { clearToken(); setToken(''); setSaved(false) }
  return <div className="mx-auto min-h-[75vh] max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
    <p className="eyebrow">Preferences</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Settings</h1><p className="mt-3 text-white/45">Connect CastBack to The Movie Database.</p>
    <section className="settings-card mt-10">
      <div className="flex items-start gap-4"><span className="icon-box"><SettingsIcon className="h-5 w-5"/></span><div><h2 className="font-display text-xl font-semibold">TMDb API credential</h2><p className="mt-1 text-sm leading-6 text-white/45">Your credential stays in this browser. It is only sent to TMDb when you search or open a profile.</p></div></div>
      <form onSubmit={submit} className="mt-7"><label htmlFor="token" className="mb-2 block text-sm font-medium text-white/70">API Read Access Token or v3 API Key</label><textarea id="token" value={token} onChange={e => setToken(e.target.value)} rows={4} placeholder="Paste your TMDb credential…" className="token-input"/><div className="mt-4 flex flex-wrap gap-3"><button className="button-primary" disabled={!token.trim()}>{saved ? 'Saved ✓' : 'Save credential'}</button>{getToken() && <button type="button" onClick={remove} className="button-secondary">Remove</button>}</div></form>
    </section>
      <section className="settings-card mt-5"><h2 className="font-display text-xl font-semibold">How to get a credential</h2><ol className="mt-5 space-y-4 text-sm leading-6 text-white/55"><li><b>1</b><span>Create or sign in to your free TMDb account.</span></li><li><b>2</b><span>Go to account settings, choose <strong>API</strong>, and request an API key for personal use.</span></li><li><b>3</b><span>Copy either the <strong>API Read Access Token</strong> or shorter <strong>API Key</strong>, then paste it above.</span></li></ol><a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-gold hover:text-yellow-300">Open TMDb API settings <ExternalIcon className="h-4 w-4"/></a></section>
    <div className="mt-6 flex items-center justify-between rounded-xl border border-white/8 px-5 py-4 text-sm"><span className="text-white/45">Cached search and credit data</span><button onClick={clearCache} className="text-white/70 hover:text-white">Clear cache</button></div>
    <Link to="/" className="mt-8 inline-block text-sm text-white/45 hover:text-white">← Back to search</Link>
  </div>
}
