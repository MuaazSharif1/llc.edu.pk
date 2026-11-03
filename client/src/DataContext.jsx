import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'
const Ctx = createContext({ programs: [], news: [], faculty: [], settings: {}, loading: true })
export const useData = () => useContext(Ctx)
export function DataProvider({ children }) {
  const [d, setD] = useState({ programs: [], news: [], faculty: [], settings: {}, loading: true })
  useEffect(() => { api('/api/public/bootstrap').then(x => setD({ ...x, loading: false })).catch(() => setD(p => ({ ...p, loading: false }))) }, [])
  return <Ctx.Provider value={d}>{children}</Ctx.Provider>
}
