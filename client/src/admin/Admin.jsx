import { useEffect, useState } from 'react'
import { api } from '../api'
const C = {
  enquiry: { l: 'Enquiries', r: ['ADMISSIONS'] },
  program: { l: 'Programs', r: ['EDITOR'], s: 'title', f: [['title'], ['slug'], ['level', 'select', ['undergrad', 'postgrad', 'short']], ['summary', 'area'], ['eligibility', 'area'], ['curriculum', 'area'], ['fees', 'area'], ['image', 'image'], ['seoTitle'], ['seoDescription'], ['published', 'check']] },
  post: { l: 'News & Events', r: ['EDITOR'], s: 'title', f: [['title'], ['slug'], ['type', 'select', ['NEWS', 'EVENT', 'NOTICE']], ['excerpt', 'area'], ['body', 'area'], ['image', 'image'], ['seoTitle'], ['seoDescription'], ['published', 'check']] },
  faculty: { l: 'Faculty', r: ['EDITOR'], s: 'name', f: [['name'], ['designation'], ['bio', 'area'], ['image', 'image'], ['published', 'check']] },
  settings: { l: 'Site settings', r: ['EDITOR'], f: [['announcement'], ['phone'], ['email'], ['address'], ['about', 'area']] },
  user: { l: 'Users', r: [], s: 'email', f: [['name'], ['email'], ['role', 'select', ['ADMIN', 'EDITOR', 'ADMISSIONS']], ['password']] },
  audit: { l: 'Activity log', r: [] },
}
const can = (role, k) => role === 'ADMIN' || C[k].r.includes(role)

function Login({ onOk }) {
  const [e, setE] = useState(''), [p, setP] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const [mode, setMode] = useState('login'), [notice, setNotice] = useState('')
  const token = new URLSearchParams(window.location.search).get('token') || ''
  const resetPage = window.location.pathname.replace(/\/$/, '').endsWith('/reset-password')
  const [newPassword, setNewPassword] = useState(''), [confirmPassword, setConfirmPassword] = useState('')
  const go = async ev => {
    ev.preventDefault(); setErr(''); setNotice(''); setBusy(true)
    try { onOk(await api('/api/auth/login', { method: 'POST', body: { email: e.trim(), password: p } })) }
    catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  const forgot = async ev => {
    ev.preventDefault(); setErr(''); setNotice(''); setBusy(true)
    try { const result = await api('/api/auth/forgot-password', { method: 'POST', body: { email: e.trim() } }); setNotice(result.message || 'If an account exists for that email, a reset link has been sent.') }
    catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  const reset = async ev => {
    ev.preventDefault(); setErr(''); setNotice('')
    if (newPassword.length < 8) return setErr('Password must be at least 8 characters long.')
    if (newPassword !== confirmPassword) return setErr('Passwords do not match.')
    setBusy(true)
    try { const result = await api('/api/auth/reset-password', { method: 'POST', body: { token, password: newPassword } }); setNotice(result.message); setNewPassword(''); setConfirmPassword('') }
    catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  if (resetPage) return <form className="login" onSubmit={reset}>
    <h2>Reset password</h2><p>Choose a new password for your staff account.</p>
    {!token && <span className="err" role="alert">Reset token missing. Please request a new reset link.</span>}
    <label>New password<input type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={x => setNewPassword(x.target.value)} required /></label>
    <label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={x => setConfirmPassword(x.target.value)} required /></label>
    {err && <span className="err" role="alert">{err}</span>}{notice && <p role="status">{notice}</p>}
    <button className="btn p" style={{ justifyContent: 'center' }} disabled={busy || !token}>{busy ? 'Please wait…' : 'Update password'}</button>
    <p><button type="button" className="btn o sm" onClick={() => { window.history.replaceState({}, '', '/admin'); window.location.reload() }}>Back to login</button></p>
  </form>
  return <form className="login" onSubmit={mode === 'login' ? go : forgot}>
    <h2>{mode === 'login' ? 'Staff login' : 'Forgot password'}</h2>
    {mode === 'forgot' && <p>Enter your staff account email. If the account exists, a password reset link will be sent.</p>}
    <label>Email<input type="email" autoComplete="username" value={e} onChange={x => setE(x.target.value)} required /></label>
    {mode === 'login' && <label>Password<input type="password" autoComplete="current-password" value={p} onChange={x => setP(x.target.value)} required /></label>}
    {err && <span className="err" role="alert">{err}</span>}{notice && <p role="status">{notice}</p>}
    <button className="btn p" style={{ justifyContent: 'center' }} disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Send reset link'}</button>
    {mode === 'login' ? <p><button type="button" className="btn o sm" onClick={() => { setMode('forgot'); setErr(''); setNotice('') }}>Forgot password?</button></p>
      : <p><button type="button" className="btn o sm" onClick={() => { setMode('login'); setErr(''); setNotice('') }}>Back to login</button></p>}
  </form>
}

function Fields({ fields, f, setF, up }) {
  return fields.map(([k, t, o]) => <label key={k}>{k}
    {t === 'area' ? <textarea rows={4} value={f[k] || ''} onChange={e => setF({ ...f, [k]: e.target.value })} />
      : t === 'select' ? <select value={f[k] || o[0]} onChange={e => setF({ ...f, [k]: e.target.value })}>{o.map(x => <option key={x}>{x}</option>)}</select>
      : t === 'check' ? <input type="checkbox" checked={!!f[k]} onChange={e => setF({ ...f, [k]: e.target.checked })} style={{ width: 20, height: 20 }} />
      : t === 'image' ? <span>{f[k] && <img className="thumb" src={f[k]} alt="" />}<input type="file" accept="image/*" onChange={e => e.target.files[0] && up(k, e.target.files[0])} /></span>
      : <input type={k === 'password' ? 'password' : 'text'} placeholder={k === 'password' ? 'min 8 chars (leave empty to keep)' : ''} value={f[k] || ''} onChange={e => setF({ ...f, [k]: e.target.value })} />}</label>)
}

function Dashboard({ me, setMe }) {
  const tabs = Object.keys(C).filter(k => can(me.role, k))
  const [tab, setTab] = useState(tabs[0]), [rows, setRows] = useState([]), [f, setF] = useState(null), [msg, setMsg] = useState(''), [q, setQ] = useState('')
  const c = C[tab], isList = !!c.s
  const load = () => { if (tab === 'settings') api('/api/admin/settings').then(setF); else api('/api/admin/' + tab).then(d => setRows(Array.isArray(d) ? d : [])).catch(x => setMsg(x.message)) }
  useEffect(() => { setF(null); setMsg(''); setQ(''); load() }, [tab])
  const flash = x => { setMsg(x); setTimeout(() => setMsg(''), 3000) }
  const up = async (k, file) => { const fd = new FormData(); fd.append('file', file); try { const j = await api('/api/admin/upload', { method: 'POST', body: fd }); setF(p => ({ ...p, [k]: j.url })) } catch (x) { flash(x.message) } }
  async function save(body, id) {
    try { await api(tab === 'settings' ? '/api/admin/settings' : `/api/admin/${tab}${id ? '/' + id : ''}`, { method: id || tab === 'settings' ? 'PUT' : 'POST', body }); flash('Saved ✓'); if (tab !== 'settings') { setF(null); load() } } catch (x) { flash(x.message) }
  }
  const del = async id => { if (confirm('Delete permanently?')) try { await api(`/api/admin/${tab}/${id}`, { method: 'DELETE' }); load() } catch (x) { flash(x.message) } }
  const csv = () => { const h = ['ref', 'name', 'email', 'phone', 'program', 'status', 'message', 'createdAt'], t = [h.join(','), ...rows.map(r => h.map(k => `"${String(r[k] || '').replace(/"/g, '""')}"`).join(','))].join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/csv' })); a.download = 'enquiries.csv'; a.click() }
  const shown = tab === 'enquiry' ? rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())) : rows
  const logout = async () => { await api('/api/auth/logout', { method: 'POST' }); setMe(null) }
  return <div className="adm">
    <div className="row"><h2 style={{ flex: 1 }}>Admin panel</h2><small>{me.email} · {me.role}</small><button className="btn o sm" onClick={logout}>Logout</button></div>
    <div className="row">{tabs.map(t => <button key={t} className="tab" style={t === tab ? { background: 'var(--brand)', color: '#fff' } : {}} onClick={() => setTab(t)}>{C[t].l}</button>)}</div>
    {msg && <p role="status"><b>{msg}</b></p>}
    {tab === 'settings' && f && <form onSubmit={e => { e.preventDefault(); save(f) }}><Fields fields={c.f} f={f} setF={setF} up={up} /><button className="btn p sm">Save settings</button></form>}
    {tab === 'audit' && <table><thead><tr><th>When</th><th>User</th><th>Action</th><th>Item</th></tr></thead><tbody>{rows.map(r => <tr key={r._id}><td>{new Date(r.createdAt).toLocaleString('en-GB')}</td><td>{r.userEmail}</td><td>{r.action}</td><td>{r.entity}</td></tr>)}</tbody></table>}
    {tab === 'enquiry' && <>
      <div className="row"><input placeholder="Search enquiries…" value={q} onChange={e => setQ(e.target.value)} /><button className="btn o sm" onClick={csv}>Export CSV</button><small>{rows.filter(r => r.status === 'NEW').length} new</small></div>
      <table><thead><tr><th>Ref</th><th>Applicant</th><th>Program</th><th>Status</th><th>Notes</th><th></th></tr></thead><tbody>
        {shown.map(r => <tr key={r._id}><td>{r.ref}<br /><small>{new Date(r.createdAt).toLocaleDateString('en-GB')}</small></td><td>{r.name}<br /><small>{r.email} {r.phone}</small><br /><small>{r.message}</small></td><td>{r.program}</td>
          <td><select value={r.status} onChange={e => setRows(rows.map(x => x._id === r._id ? { ...x, status: e.target.value } : x))}>{['NEW', 'CONTACTED', 'CLOSED'].map(s => <option key={s}>{s}</option>)}</select></td>
          <td><input value={r.notes || ''} placeholder="Internal note" onChange={e => setRows(rows.map(x => x._id === r._id ? { ...x, notes: e.target.value } : x))} /></td>
          <td><button className="btn p sm" onClick={() => save({ status: r.status, notes: r.notes }, r._id)}>Save</button></td></tr>)}
        {!shown.length && <tr><td colSpan={6}>No enquiries found.</td></tr>}</tbody></table></>}
    {isList && <>
      <button className="btn p sm" onClick={() => setF({ published: false })}>+ New</button>
      {f && <form onSubmit={e => { e.preventDefault(); save(f, f._id) }}><Fields fields={c.f} f={f} setF={setF} up={up} />
        <div className="row"><button className="btn p sm">Save</button><button type="button" className="btn o sm" onClick={() => setF(null)}>Cancel</button></div></form>}
      <table><tbody>{rows.map(r => <tr key={r._id}><td>{r[c.s]}</td><td>{tab === 'user' ? r.role : r.published ? 'Published' : 'Draft'}</td>
        <td><button className="btn o sm" onClick={() => setF({ ...r, password: '' })}>Edit</button> <button className="btn o sm" onClick={() => del(r._id)}>Delete</button></td></tr>)}</tbody></table></>}
  </div>
}

export default function Admin() {
  const [me, setMe] = useState(undefined)
  useEffect(() => { api('/api/auth/me').then(setMe).catch(() => setMe(null)) }, [])
  useEffect(() => { document.title = 'Admin | Lahore Law College'; const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'; document.head.appendChild(m); return () => m.remove() }, [])
  if (me === undefined) return <p style={{ padding: 40 }}>Loading…</p>
  return me ? <Dashboard me={me} setMe={setMe} /> : <Login onOk={setMe} />
}
