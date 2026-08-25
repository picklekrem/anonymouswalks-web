'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const KEY_STORAGE = 'aw_admin_key'

type Tab = 'users' | 'reports' | 'calls'

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

interface CallListItem {
  call_id: string
  match_id: string
  user1_id: string
  user1_username: string
  user2_id: string
  user2_username: string
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  end_reason: string | null
  feedback_count: number
  avg_rating: number | null
  has_report: boolean
}

interface CallFeedbackEntry {
  reviewer_id: string
  reviewed_id: string
  rating: number | null
  tags: string[] | null
  comment: string | null
  created_at: string
}

interface CallReportEntry {
  id: string
  reporter_id: string
  reporter_username: string | null
  reported_id: string
  reported_username: string | null
  reason: string
  status: string
  created_at: string
}

interface CallDetail {
  call_id: string
  match_id: string | null
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  end_reason: string | null
  user1: { id: string; username: string | null } | null
  user2: { id: string; username: string | null } | null
  feedback: CallFeedbackEntry[]
  reports: CallReportEntry[]
}

interface UserCallHistoryEntry {
  call_id: string
  match_id: string
  partner_id: string
  partner_username: string
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  end_reason: string | null
  who_left: 'self' | 'partner' | null
  feedback_given: { rating: number | null; tags: string[] | null; comment: string | null } | null
  feedback_received: { rating: number | null; tags: string[] | null; comment: string | null } | null
}

interface UserReportEntry {
  id: string
  other_user_id: string
  other_username: string
  reason: string
  status: string
  created_at: string
}

interface UserDetail {
  id: string
  login_type: string
  is_active: boolean
  is_banned: boolean
  is_demo_account: boolean
  created_at: string
  username: string | null
  bio: string | null
  role: string | null
  language: string | null
  interests: string[] | null
  anonymity_level: string | null
  trust_score: number | null
  calls: UserCallHistoryEntry[]
  reports_filed: UserReportEntry[]
  reports_received: UserReportEntry[]
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function fmtDuration(seconds: number | null) {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const END_REASON_LABELS: Record<string, string> = {
  completed: 'Tamamlandı',
  reported: 'Rapor edildi',
  error: 'Hata',
}

function callEndReasonText(call: CallListItem) {
  if (!call.end_reason) return 'Devam ediyor'
  if (call.end_reason === 'user1_left') return `${call.user1_username} ayrıldı`
  if (call.end_reason === 'user2_left') return `${call.user2_username} ayrıldı`
  return END_REASON_LABELS[call.end_reason] ?? call.end_reason
}

function userCallEndReasonText(call: UserCallHistoryEntry) {
  if (!call.end_reason) return 'Devam ediyor'
  if (call.who_left === 'self') return 'Kullanıcı ayrıldı'
  if (call.who_left === 'partner') return 'Karşı taraf ayrıldı'
  return END_REASON_LABELS[call.end_reason] ?? call.end_reason
}

function callDetailEndReasonText(call: CallDetail) {
  if (!call.end_reason) return 'Devam ediyor'
  if (call.end_reason === 'user1_left') return `${call.user1?.username ?? 'Kullanıcı 1'} ayrıldı`
  if (call.end_reason === 'user2_left') return `${call.user2?.username ?? 'Kullanıcı 2'} ayrıldı`
  return END_REASON_LABELS[call.end_reason] ?? call.end_reason
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} bg-surface border border-border rounded-2xl p-6 my-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-tertiary hover:text-primary transition-colors text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [apiKey, setApiKey] = useState('')
  const [inputKey, setInputKey] = useState('')
  const [authError, setAuthError] = useState(false)
  const [authChecking, setAuthChecking] = useState(false)

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

  const [calls, setCalls] = useState<CallListItem[]>([])
  const [callTotal, setCallTotal] = useState(0)
  const [callPage, setCallPage] = useState(1)
  const [callPages, setCallPages] = useState(1)
  const [callSearch, setCallSearch] = useState('')
  const [callSearchInput, setCallSearchInput] = useState('')

  const [loading, setLoading] = useState(false)

  const [userModalOpen, setUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [userDetailLoading, setUserDetailLoading] = useState(false)

  const [callModalOpen, setCallModalOpen] = useState(false)
  const [selectedCall, setSelectedCall] = useState<CallDetail | null>(null)
  const [callDetailLoading, setCallDetailLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE)
    if (stored) setApiKey(stored)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(KEY_STORAGE)
    setApiKey('')
    setStats(null)
    setUsers([])
    setReports([])
    setCalls([])
  }, [])

  const apiFetch = useCallback(
    async (path: string, opts?: RequestInit) => {
      const res = await fetch(`${API_URL}${path}`, {
        ...opts,
        headers: { 'X-Admin-Key': apiKey, 'Content-Type': 'application/json', ...opts?.headers },
      })
      if (res.status === 401) {
        logout()
        setAuthError(true)
        throw new Error('unauthorized')
      }
      if (!res.ok) throw new Error('request_failed')
      if (res.status === 204) return null
      return res.json()
    },
    [apiKey, logout],
  )

  const login = async () => {
    const key = inputKey.trim()
    if (!key) return
    setAuthChecking(true)
    setAuthError(false)
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: { 'X-Admin-Key': key } })
      if (!res.ok) throw new Error('unauthorized')
      sessionStorage.setItem(KEY_STORAGE, key)
      setApiKey(key)
    } catch {
      setAuthError(true)
    } finally {
      setAuthChecking(false)
    }
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

  const fetchCalls = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(callPage), limit: '20' })
      if (callSearch) params.set('search', callSearch)
      const data = await apiFetch(`/admin/calls?${params}`)
      setCalls(data.calls)
      setCallTotal(data.total)
      setCallPages(data.pages)
    } catch { /* noop */ }
    finally { setLoading(false) }
  }, [apiFetch, callPage, callSearch])

  useEffect(() => {
    if (!apiKey) return
    fetchStats()
  }, [apiKey, fetchStats])

  useEffect(() => {
    if (!apiKey) return
    if (tab === 'users') fetchUsers()
    if (tab === 'reports') fetchReports()
    if (tab === 'calls') fetchCalls()
  }, [apiKey, tab, fetchUsers, fetchReports, fetchCalls])

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

  const openUserDetail = async (userId: string) => {
    setUserModalOpen(true)
    setUserDetailLoading(true)
    setSelectedUser(null)
    try {
      const data = await apiFetch(`/admin/users/${userId}`)
      setSelectedUser(data)
    } catch { /* noop */ }
    finally { setUserDetailLoading(false) }
  }

  const closeUserDetail = () => {
    setUserModalOpen(false)
    setSelectedUser(null)
  }

  const openCallDetail = async (callId: string) => {
    setCallModalOpen(true)
    setCallDetailLoading(true)
    setSelectedCall(null)
    try {
      const data = await apiFetch(`/admin/calls/${callId}`)
      setSelectedCall(data)
    } catch { /* noop */ }
    finally { setCallDetailLoading(false) }
  }

  const closeCallDetail = () => {
    setCallModalOpen(false)
    setSelectedCall(null)
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
              onChange={e => { setInputKey(e.target.value); setAuthError(false) }}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="admin key girin"
              className={`px-4 py-3 rounded-xl bg-background border text-primary placeholder-tertiary text-sm outline-none transition-colors ${
                authError ? 'border-destructive/60 focus:border-destructive' : 'border-border focus:border-accent/60'
              }`}
            />
            {authError && (
              <p className="text-destructive text-xs -mt-2">Geçersiz admin key</p>
            )}
            <button
              onClick={login}
              disabled={authChecking}
              className="py-3 rounded-xl bg-accent hover:bg-accent-light disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {authChecking ? 'Kontrol ediliyor...' : 'Giriş Yap'}
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
          {(['users', 'reports', 'calls'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-accent text-white'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {t === 'users' ? 'Kullanıcılar' : t === 'reports' ? 'Raporlar' : 'Görüşmeler'}
              {t === 'users' && userTotal > 0 && (
                <span className="ml-2 text-xs opacity-70">{userTotal}</span>
              )}
              {t === 'reports' && reportTotal > 0 && (
                <span className="ml-2 text-xs opacity-70">{reportTotal}</span>
              )}
              {t === 'calls' && callTotal > 0 && (
                <span className="ml-2 text-xs opacity-70">{callTotal}</span>
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

            <div className="bg-surface border border-border rounded-xl overflow-hidden overflow-x-auto">
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
                            onClick={() => openUserDetail(u.id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-border text-secondary hover:text-primary transition-colors"
                          >
                            Detay
                          </button>
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

            <div className="bg-surface border border-border rounded-xl overflow-hidden overflow-x-auto">
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

        {/* Calls Tab */}
        {tab === 'calls' && (
          <div>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={callSearchInput}
                onChange={e => setCallSearchInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setCallSearch(callSearchInput)
                    setCallPage(1)
                  }
                }}
                placeholder="Kullanıcı adına göre ara..."
                className="flex-1 max-w-xs px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-primary placeholder-tertiary outline-none focus:border-accent/60 transition-colors"
              />
              <button
                onClick={() => { setCallSearch(callSearchInput); setCallPage(1) }}
                className="px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-secondary hover:text-primary transition-colors"
              >
                Ara
              </button>
              {callSearch && (
                <button
                  onClick={() => { setCallSearch(''); setCallSearchInput(''); setCallPage(1) }}
                  className="px-4 py-2.5 rounded-xl text-sm text-tertiary hover:text-secondary transition-colors"
                >
                  Temizle
                </button>
              )}
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Kullanıcı 1', 'Kullanıcı 2', 'Başlangıç', 'Süre', 'Bitiş', 'Puan', ''].map(h => (
                      <th key={h} className="text-left text-tertiary font-medium px-4 py-3 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-secondary text-sm">
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : calls.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-secondary text-sm">
                        Görüşme bulunamadı
                      </td>
                    </tr>
                  ) : calls.map(c => (
                    <tr key={c.call_id} className="border-b border-border/50 hover:bg-background/40 transition-colors">
                      <td className="px-4 py-3 font-medium">{c.user1_username}</td>
                      <td className="px-4 py-3 font-medium">{c.user2_username}</td>
                      <td className="px-4 py-3 text-secondary text-xs">{fmtDateTime(c.started_at)}</td>
                      <td className="px-4 py-3 text-secondary">{fmtDuration(c.duration_seconds)}</td>
                      <td className="px-4 py-3 text-secondary text-xs">
                        <div className="flex items-center gap-1.5">
                          {callEndReasonText(c)}
                          {c.has_report && (
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive" title="Rapor var" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.avg_rating != null ? (
                          <span className="text-xs font-medium text-accent-light">{c.avg_rating}★</span>
                        ) : (
                          <span className="text-tertiary text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => openCallDetail(c.call_id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-border text-secondary hover:text-primary transition-colors"
                          >
                            Detay
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {callPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-tertiary text-sm">{callTotal} görüşme</p>
                <div className="flex gap-2">
                  <button
                    disabled={callPage <= 1}
                    onClick={() => setCallPage(p => p - 1)}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-secondary disabled:opacity-40 hover:text-primary transition-colors"
                  >
                    ← Önceki
                  </button>
                  <span className="px-3 py-1.5 text-sm text-secondary">{callPage} / {callPages}</span>
                  <button
                    disabled={callPage >= callPages}
                    onClick={() => setCallPage(p => p + 1)}
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

      {/* User Detail Modal */}
      {userModalOpen && (
        <Modal title={selectedUser?.username ?? 'Kullanıcı Detayı'} onClose={closeUserDetail} wide>
          {userDetailLoading || !selectedUser ? (
            <p className="text-secondary text-sm py-8 text-center">Yükleniyor...</p>
          ) : (
            <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Rol', value: selectedUser.role ?? '—' },
                  { label: 'Dil', value: selectedUser.language?.toUpperCase() ?? '—' },
                  { label: 'Trust', value: selectedUser.trust_score ?? '—' },
                  { label: 'Giriş', value: selectedUser.login_type },
                ].map(f => (
                  <div key={f.label} className="bg-background border border-border rounded-xl px-3 py-2">
                    <p className="text-tertiary text-[11px] mb-0.5">{f.label}</p>
                    <p className="text-sm font-medium">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-tertiary text-xs">{selectedUser.id}</span>
                {selectedUser.is_banned && (
                  <span className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-xs font-medium">Banlı</span>
                )}
                {selectedUser.is_demo_account && (
                  <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent-light text-xs font-medium">Demo hesap</span>
                )}
                <span className="text-tertiary text-xs">Kayıt: {fmtDate(selectedUser.created_at)}</span>
              </div>

              {selectedUser.bio && <p className="text-secondary text-sm">{selectedUser.bio}</p>}

              <div>
                <h3 className="text-sm font-semibold text-secondary mb-2">Görüşme Geçmişi ({selectedUser.calls.length})</h3>
                {selectedUser.calls.length === 0 ? (
                  <p className="text-tertiary text-sm">Henüz görüşme yok</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedUser.calls.map(c => (
                      <button
                        key={c.call_id}
                        onClick={() => openCallDetail(c.call_id)}
                        className="text-left bg-background border border-border rounded-xl px-4 py-3 hover:border-accent/60 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{c.partner_username}</p>
                          <p className="text-tertiary text-xs">{fmtDateTime(c.started_at)}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-secondary">
                          <span>{fmtDuration(c.duration_seconds)}</span>
                          <span>·</span>
                          <span>{userCallEndReasonText(c)}</span>
                          {c.feedback_given?.rating != null && <span>· Verilen puan: {c.feedback_given.rating}★</span>}
                          {c.feedback_received?.rating != null && <span>· Alınan puan: {c.feedback_received.rating}★</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-secondary mb-2">Şikayet Ettikleri ({selectedUser.reports_filed.length})</h3>
                  {selectedUser.reports_filed.length === 0 ? (
                    <p className="text-tertiary text-xs">Yok</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {selectedUser.reports_filed.map(r => (
                        <div key={r.id} className="bg-background border border-border rounded-xl px-3 py-2 text-xs">
                          <p className="font-medium">{r.other_username}</p>
                          <p className="text-secondary line-clamp-2">{r.reason}</p>
                          <p className="text-tertiary mt-1">{fmtDate(r.created_at)} · {r.status}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-secondary mb-2">Hakkındaki Şikayetler ({selectedUser.reports_received.length})</h3>
                  {selectedUser.reports_received.length === 0 ? (
                    <p className="text-tertiary text-xs">Yok</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {selectedUser.reports_received.map(r => (
                        <div key={r.id} className="bg-background border border-destructive/30 rounded-xl px-3 py-2 text-xs">
                          <p className="font-medium">{r.other_username}</p>
                          <p className="text-secondary line-clamp-2">{r.reason}</p>
                          <p className="text-tertiary mt-1">{fmtDate(r.created_at)} · {r.status}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Call Detail Modal */}
      {callModalOpen && (
        <Modal title="Görüşme Detayı" onClose={closeCallDetail}>
          {callDetailLoading || !selectedCall ? (
            <p className="text-secondary text-sm py-8 text-center">Yükleniyor...</p>
          ) : (
            <div className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">{selectedCall.user1?.username ?? '—'} ↔ {selectedCall.user2?.username ?? '—'}</p>
                <p className="text-tertiary text-xs">{fmtDateTime(selectedCall.started_at)}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-background border border-border rounded-xl px-3 py-2">
                  <p className="text-tertiary text-[11px] mb-0.5">Süre</p>
                  <p className="text-sm font-medium">{fmtDuration(selectedCall.duration_seconds)}</p>
                </div>
                <div className="bg-background border border-border rounded-xl px-3 py-2">
                  <p className="text-tertiary text-[11px] mb-0.5">Bitiş</p>
                  <p className="text-sm font-medium">{callDetailEndReasonText(selectedCall)}</p>
                </div>
                <div className="bg-background border border-border rounded-xl px-3 py-2">
                  <p className="text-tertiary text-[11px] mb-0.5">Bitiş Zamanı</p>
                  <p className="text-sm font-medium">{selectedCall.ended_at ? fmtDateTime(selectedCall.ended_at) : '—'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-secondary mb-2">Feedback ({selectedCall.feedback.length})</h3>
                {selectedCall.feedback.length === 0 ? (
                  <p className="text-tertiary text-xs">Yok</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedCall.feedback.map((f, i) => (
                      <div key={i} className="bg-background border border-border rounded-xl px-3 py-2 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{f.rating != null ? `${f.rating}★` : 'Puan yok'}</p>
                          <p className="text-tertiary">{fmtDateTime(f.created_at)}</p>
                        </div>
                        {f.tags && f.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {f.tags.map(t => (
                              <span key={t} className="px-1.5 py-0.5 rounded-full bg-border text-secondary text-[10px]">{t}</span>
                            ))}
                          </div>
                        )}
                        {f.comment && <p className="text-secondary mt-1">{f.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedCall.reports.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-secondary mb-2">Raporlar ({selectedCall.reports.length})</h3>
                  <div className="flex flex-col gap-2">
                    {selectedCall.reports.map(r => (
                      <div key={r.id} className="bg-background border border-destructive/30 rounded-xl px-3 py-2 text-xs">
                        <p className="font-medium">{r.reporter_username ?? '—'} → {r.reported_username ?? '—'}</p>
                        <p className="text-secondary mt-1">{r.reason}</p>
                        <p className="text-tertiary mt-1">{fmtDate(r.created_at)} · {r.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
