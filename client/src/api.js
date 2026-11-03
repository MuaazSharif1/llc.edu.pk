import { useEffect } from 'react'
export async function api(url, o = {}) {
  const fd = o.body instanceof FormData
  const r = await fetch(url, { credentials: 'same-origin', ...o, headers: { ...(o.body && !fd ? { 'Content-Type': 'application/json' } : {}), ...o.headers }, body: o.body && !fd ? JSON.stringify(o.body) : o.body })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.error || 'Request failed')
  return j
}
export function useSEO(title, desc) {
  useEffect(() => {
    document.title = title ? `${title} | Lahore Law College` : 'Lahore Law College | Law Programs, Admissions & Legal Education'
    if (desc) document.querySelector('meta[name=description]')?.setAttribute('content', desc)
  }, [title, desc])
}
