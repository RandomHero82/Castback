export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <div className="flex flex-col items-center justify-center gap-4 py-24 text-white/50"><span className="spinner"/><p className="text-sm">{label}</p></div>
}

export function ErrorState({ title = 'Something went wrong', message, action }: { title?: string; message: string; action?: React.ReactNode }) {
  return <div className="state-card"><div className="mb-4 text-3xl">!</div><h2 className="font-display text-xl font-semibold">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-white/50">{message}</p>{action && <div className="mt-6">{action}</div>}</div>
}
