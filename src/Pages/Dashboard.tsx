import { useEffect, useMemo, useState } from 'react'
import { fetchComments } from '../api/api'
import Loading from '../components/Loading'
import DataGrid from '../components/DataGrid'
import Pagination from '../components/Pagination'

import type { CommentItem } from '../types/types'

type SortMode = 'none' | 'asc' | 'desc'
type SortKey = 'postId' | 'name' | 'email' | null

const STORAGE_KEY = 'comments_dashboard_state_v1'

type Persisted = {
    page: number
    pageSize: number
    search: string
    sortKey: SortKey
    sortMode: SortMode
}

export default function Dashboard() {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<CommentItem[]>([])
    const [err, setErr] = useState<string | null>(null)

    // UI state
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [search, setSearch] = useState<string>('')
    const [sortKey, setSortKey] = useState<SortKey>(null)
    const [sortMode, setSortMode] = useState<SortMode>('none')

    // Load persisted state
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as Persisted
                setPage(parsed.page || 1)
                setPageSize(parsed.pageSize || 10)
                setSearch(parsed.search || '')
                setSortKey(parsed.sortKey || null)
                setSortMode(parsed.sortMode || 'none')
            } catch (e) {
                console.log(e)
            }
        }
    }, [])

    // Fetch data
    useEffect(() => {
        setLoading(true)
        fetchComments()
            .then(list => setData(list))
            .catch(e => setErr(String(e)))
            .finally(() => setLoading(false))
    }, [])

    // Persist state
    useEffect(() => {
        const p: Persisted = { page, pageSize, search, sortKey, sortMode }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    }, [page, pageSize, search, sortKey, sortMode])

    // Apply search - FIXED: Added comment body search
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return data
        return data.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.email.toLowerCase().includes(q) ||
            String(d.postId).includes(q) ||
            d.body.toLowerCase().includes(q) // Added this line to search comment body
        )
    }, [data, search])

    // Apply sorting
    const sorted = useMemo(() => {
        if (!sortKey || sortMode === 'none') return filtered
        const arr = [...filtered]
        arr.sort((a, b) => {
            let va = a[sortKey as keyof CommentItem]
            let vb = b[sortKey as keyof CommentItem]
            if (typeof va === 'string') va = va.toLowerCase()
            if (typeof vb === 'string') vb = vb.toLowerCase()
            if (va < vb) return sortMode === 'asc' ? -1 : 1
            if (va > vb) return sortMode === 'asc' ? 1 : -1
            return 0
        })
        return arr
    }, [filtered, sortKey, sortMode])

    // Cycle sorting per column
    const cycleSort = (key: SortKey) => {
        if (sortKey !== key) {
            setSortKey(key)
            setSortMode('asc')
        } else {
            if (sortMode === 'none') setSortMode('asc')
            else if (sortMode === 'asc') setSortMode('desc')
            else {
                setSortKey(null)
                setSortMode('none')
            }
        }
        setPage(1)
    }

    const sortLabel = (key: SortKey, label: string) => {
        if (sortKey !== key) return label
        if (sortMode === 'asc') return `${label} ↑`
        if (sortMode === 'desc') return `${label} ↓`
        return label
    }

    if (loading) return <Loading />
    if (err) return <div className="card">{err}</div>

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Filters */}
            <div className="p-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Sort toggles on left */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Sort Options</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => cycleSort('postId')}
                                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                        {sortLabel('postId', 'Post ID')}
                                    </div>
                                </button>
                                <button
                                    onClick={() => cycleSort('name')}
                                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {sortLabel('name', 'Name')}
                                    </div>
                                </button>
                                <button
                                    onClick={() => cycleSort('email')}
                                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        {sortLabel('email', 'Email')}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Search on right */}
                        <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[320px]">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Search Records</h3>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                    placeholder="Search by name, email, ID, or comment..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                                />
                                {search && (
                                    <button
                                        onClick={() => { setSearch(''); setPage(1); }}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results info */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="font-medium">{sorted.length}</span>
                                <span>records found</span>
                                {search && (
                                    <span className="text-blue-600">
                                        • Filtered by "{search}"
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data grid */}
                <DataGrid
                    data={sorted}
                    page={page}
                    pageSize={pageSize}
                    sortState={{ key: sortKey, mode: sortMode }}
                    onSortChange={(k) => cycleSort(k)}
                />

                {/* Pagination */}
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={sorted.length}
                    onPageChange={(p) => setPage(p)}
                    onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
                />
            </div>
        </div>
    )
}