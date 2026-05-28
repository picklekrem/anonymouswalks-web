'use client'

import { useState, useEffect, useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const KEY_STORAGE = 'aw_admin_key'

type Tab = 'users' | 'reports'

interface Stats {
  total_users: number
  banned_users: number
  pending_reports: number
  total_matches: number
}

interface AdminUser {
  id: string
  login_type: string
  is_active: boolean
  is_banned: boolean
  created_at: string
  username: string | null
  role: string | null
  trust_score: number | null
  language: string | null
}

interface Report {
  id: string
  reporter_id: string
  reporter_username: string
  reported_id: string
  reported_username: string
  reason: string
  status: string
  created_at: string
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function AdminPage() {
  const [apiKey, setApiKey] = useState('')
  const [inputKey, setInputKey] = useState('')
  const [authError, setAuthError] = useState(false)

  const [tab, setTab] = useState<Tab>('users')
  const [stats, setStats] = useState<Stats | null>(null)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [userTotal, setUserTotal] = useState(0)
  const [userPage, setUserPage] = useState(1)
  const [userPages, setUserPages] = useState(1)
  const [userSearch, setUserSearch] = useState('')
  const [userSearchInput, setUserSearchInput] = useState('')

  const [reports, setReports] = useState<Report[]>([])
  const [reportTotal, setReportTotal] = useState(0)
  const [reportPage, setReportPage] = useState(1)
  const [reportPages, setReportPages] = useState(1)
  const [reportFilter, setReportFilter] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE)
    if (stored) setApiKey(stored)
  }, [])

  const apiFetch = useCallback(
    async (path: string, opts?: RequestInit) => {
      const res = await fetch(`${API_URL}${path}`, {
        ...opts,
        headers: { 'X-Admin-Key': apiKey, 'Content-Type': 'application/json', ...opts?.headers },
      })
      if (res.status === 401) throw new Error('unauthorized')
      if (!res.ok) throw new Error('request_failed')
      if (res.status === 204) return null
      return res.json()
    },
    [apiKey],
  )

  const login = () => {
    if (!inputKey.trim()) return
    sessionStorage.setItem(KEY_STORAGE, inputKey.trim())
    setApiKey(inputKey.trim())
  }

  const logout = () => {
    sessionStorage.removeItem(KEY_STORAGE)
    setApiKey('')
    setStats(null)
    setUsers([])
    setReports([])
  }

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiFetch('/admin/stats')
      setStats(data)
    } catch { /* noop */ }
  }, [apiFetch])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(userPage), limit: '20' })
      if (userSearch) params.set('search', userSearch)
      const data = await apiFetch(`/admin/users?${params}`)
      setUsers(data.users)
      setUserTotal(data.total)
      setUserPages(data.pages)
    } catch { /* noop */ }
    finally { setLoading(false) }
  }, [apiFetch, userPage, userSearch])

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(reportPage), limit: '20' })
      if (reportFilter) params.set('status', reportFilter)
      const data = await apiFetch(`/admin/reports?${params}`)
      setReports(data.reports)
      setReportTotal(data.total)
      setReportPages(data.pages)
    } catch { /* noop */ }
    finally { setLoading(false) }
  }, [apiFetch, reportPage, reportFilter])

  useEffect(() => {
    if (!apiKey) return
    fetchStats()
  }, [apiKey, fetchStats])

  useEffect(() => {
    if (!apiKey) return
    if (tab === 'users') fetchUsers()
    if (tab === 'reports') fetchReports()
  }, [apiKey, tab, fetchUsers, fetchReports])

  const toggleBan = async (userId: string) => {
    try {
      const updated = await apiFetch(`/admin/users/${userId}/ban`, { method: 'PATCH' })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: updated.is_banned } : u))
      fetchStats()
    } catch { /* noop */ }
  }

  const deleteUser = async (userId: string, username: string | null) => {
    if (!confirm(`"${username ?? userId.slice(0, 8)}" kullanıcısını silmek istediğine emin misin?`)) return
    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' })
      fetchUsers()
      fetchStats()
    } catch { /* noop */ }
  }

  const updateReport = async (reportId: string, status: string) => {
    try {
      await apiFetch(`/admin/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      fetchReports()
      fetchStats()
    } catch { /* noop */ }
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="font-bold text-2xl tracking-tight">
              Anon<span className="text-accent">Walks</span>
            </span>
            <p className="text-secondary text-sm mt-2">Admin Panel</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
            <label className="text-sm font-medium text-secondary">API Key</label>
            <input
              type="password"
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="admin key girin"
              className="px-4 py-3 rounded-xl bg-background border border-border text-primary placeholder-tertiary text-sm outline-none focus:border-accent/60 transition-colors"
            />
            <button
              onClick={login}
              className="py-3 rounded-xl bg-accent hover:bg-accent-light text-white text-sm font-semibold transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight">
            Anon<span className="text-accent">Walks</span>
            <span className="text-tertiary font-normal text-sm ml-2">Admin</span>
          </span>
          <button
            onClick={logout}
            className="text-secondary hover:text-primary text-sm transition-colors"
          >
            Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Toplam Kullanıcı', value: stats.total_users },
              { label: 'Banlı', value: stats.banned_users, accent: stats.banned_users > 0 },
              { label: 'Bekleyen Rapor', value: stats.pending_reports, accent: stats.pending_reports > 0 },
              { label: 'Toplam Eşleşme', value: stats.total_matches },
            ].map(s => (
              <div key={s.label} className="bg-surface border border-border rounded-xl px-5 py-4">
                <p className="text-secondary text-xs mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.accent ? 'text-destructive' : 'text-primary'}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface border border-border rounded-xl p-1 w-fit">
          {(['users', 'reports'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-accent text-white'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {t === 'users' ? 'Kullanıcılar' : 'Raporlar'}
              {t === 'users' && userTotal > 0 && (
                <span className="ml-2 text-xs opacity-70">{userTotal}</span>
              )}
              {t === 'reports' && reportTotal > 0 && (
                <span className="ml-2 text-xs opacity-70">{reportTotal}</span>
              )}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={userSearchInput}
                onChange={e => setUserSearchInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setUserSearch(userSearchInput)
                    setUserPage(1)
                  }
                }}
                placeholder="Kullanıcı adı ara..."
                className="flex-1 max-w-xs px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-primary placeholder-tertiary outline-none focus:border-accent/60 transition-colors"
              />
              <button
                onClick={() => { setUserSearch(userSearchInput); setUserPage(1) }}
                className="px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-secondary hover:text-primary transition-colors"
              >
                Ara
              </button>
              {userSearch && (
                <button
                  onClick={() => { setUserSearch(''); setUserSearchInput(''); setUserPage(1) }}
                  className="px-4 py-2.5 rounded-xl text-sm text-tertiary hover:text-secondary transition-colors"
                >
                  Temizle
                </button>
              )}
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Kullanıcı', 'Giriş Tipi', 'Rol', 'Trust', 'Dil', 'Tarih', 'Durum', ''].map(h => (
                      <th key={h} className="text-left text-tertiary font-medium px-4 py-3 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-secondary text-sm">
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-secondary text-sm">
                        Kullanıcı bulunamadı
                      </td>
                    </tr>
                  ) : users.map(u => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-background/40 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{u.username ?? <span className="text-tertiary italic">isimsiz</span>}</p>
                          <p className="text-tertiary text-xs">{u.id.slice(0, 8)}…</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-secondary">{u.login_type}</td>
                      <td className="px-4 py-3 text-secondary">{u.role ?? '—'}</td>
                      <td className="px-4 py-3">
                        {u.trust_score != null ? (
                          <span className={`text-xs font-medium ${u.trust_score >= 0.7 ? 'text-success' : u.trust_score >= 0.4 ? 'text-accent-light' : 'text-destructive'}`}>
                            {u.trust_score}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-secondary text-xs uppercase">{u.language ?? '—'}</td>
                      <td className="px-4 py-3 text-secondary text-xs">{fmtDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        {u.is_banned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-xs font-medium">
                            Banlı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success text-xs font-medium">
                            Aktif
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => toggleBan(u.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              u.is_banned
                                ? 'bg-success/15 text-success hover:bg-success/25'
                                : 'bg-destructive/15 text-destructive hover:bg-destructive/25'
                            }`}
                          >
                            {u.is_banned ? 'Banı Kaldır' : 'Banla'}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id, u.username)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-border text-tertiary hover:text-destructive hover:bg-destructive/15 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-tertiary text-sm">{userTotal} kullanıcı</p>
                <div className="flex gap-2">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage(p => p - 1)}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-secondary disabled:opacity-40 hover:text-primary transition-colors"
                  >
                    ← Önceki
                  </button>
                  <span className="px-3 py-1.5 text-sm text-secondary">{userPage} / {userPages}</span>
                  <button
                    disabled={userPage >= userPages}
                    onClick={() => setUserPage(p => p + 1)}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-secondary disabled:opacity-40 hover:text-primary transition-colors"
                  >
                    Sonraki →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {tab === 'reports' && (
          <div>
            <div className="flex gap-2 mb-4">
              {['', 'pending', 'reviewed', 'resolved'].map(s => (
                <button
                  key={s}
                  onClick={() => { setReportFilter(s); setReportPage(1) }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    reportFilter === s
                      ? 'bg-accent border-accent text-white'
                      : 'bg-surface border-border text-secondary hover:text-primary'
                  }`}
                >
                  {s === '' ? 'Tümü' : s === 'pending' ? 'Bekleyen' : s === 'reviewed' ? 'İncelendi' : 'Çözüldü'}
                </button>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Şikayet Eden', 'Şikayet Edilen', 'Sebep', 'Durum', 'Tarih', ''].map(h => (
                      <th key={h} className="text-left text-tertiary font-medium px-4 py-3 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-secondary text-sm">
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-secondary text-sm">
                        Rapor bulunamadı
                      </td>
                    </tr>
                  ) : reports.map(r => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-background/40 transition-colors">
                      <td className="px-4 py-3 font-medium">{r.reporter_username}</td>
                      <td className="px-4 py-3 font-medium">{r.reported_username}</td>
                      <td className="px-4 py-3 text-secondary max-w-xs">
                        <span className="line-clamp-2">{r.reason}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.status === 'pending' ? 'bg-accent/15 text-accent-light' :
                          r.status === 'reviewed' ? 'bg-border text-secondary' :
                          'bg-success/15 text-success'
                        }`}>
                          {r.status === 'pending' ? 'Bekleyen' : r.status === 'reviewed' ? 'İncelendi' : 'Çözüldü'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-secondary text-xs">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          {r.status !== 'reviewed' && (
                            <button
                              onClick={() => updateReport(r.id, 'reviewed')}
                              className="px-2.5 py-1 rounded-lg text-xs bg-border text-secondary hover:text-primary transition-colors"
                            >
                              İncele
                            </button>
                          )}
                          {r.status !== 'resolved' && (
                            <button
                              onClick={() => updateReport(r.id, 'resolved')}
                              className="px-2.5 py-1 rounded-lg text-xs bg-success/15 text-success hover:bg-success/25 transition-colors"
                            >
                              Çöz
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reportPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-tertiary text-sm">{reportTotal} rapor</p>
                <div className="flex gap-2">
                  <button
                    disabled={reportPage <= 1}
                    onClick={() => setReportPage(p => p - 1)}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-secondary disabled:opacity-40 hover:text-primary transition-colors"
                  >
                    ← Önceki
                  </button>
                  <span className="px-3 py-1.5 text-sm text-secondary">{reportPage} / {reportPages}</span>
                  <button
                    disabled={reportPage >= reportPages}
                    onClick={() => setReportPage(p => p + 1)}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-secondary disabled:opacity-40 hover:text-primary transition-colors"
                  >
                    Sonraki →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
