import React from 'react'

type Props = {
    page: number
    pageSize: number
    total: number
    onPageChange: (p: number) => void
    onPageSizeChange: (s: number) => void
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: Props) {
    const pages = Math.max(1, Math.ceil(total / pageSize))
    const pageList = Array.from({ length: pages }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-end gap-x-4 mt-4">
            <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Page size:</label>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            <div className="flex items-center gap-1">
                <button
                    className="px-2 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Prev
                </button>
                <div className="flex gap-1">
                    {pageList.slice(Math.max(0, page - 3), Math.min(pages, page + 2)).map(p => (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`px-3 py-1 rounded border ${p === page
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <button
                    className="px-2 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    disabled={page === pages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </button>
                <div className="ml-4 text-sm text-gray-600">Total: {total}</div>
            </div>
        </div>
    )
}