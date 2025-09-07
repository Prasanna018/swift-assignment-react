
import type { CommentItem } from '../types/types'

type SortMode = 'none' | 'asc' | 'desc'
type SortKey = 'postId' | 'name' | 'email' | null

type Props = {
    data: CommentItem[]
    page: number
    pageSize: number
    onSortChange: (key: SortKey) => void
    sortState: { key: SortKey; mode: SortMode }
    onRowClick?: (c: CommentItem) => void
}

export default function DataGrid({ data, page, pageSize, onRowClick }: Props) {
    const start = (page - 1) * pageSize
    const pageData = data.slice(start, start + pageSize)

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-200 border-b border-gray-300">
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                Post ID
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                Comment
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {pageData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    hover:bg-blue-50 transition-colors cursor-pointer
                                    border-b border-gray-100 last:border-b-0
                                `}
                                onClick={() => onRowClick?.(item)}
                            >
                                <td className="px-6 py-5 text-sm text-gray-900 font-mono">
                                    {item.postId}
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-900">
                                    {item.name}
                                </td>
                                <td className="px-6 py-5 text-sm text-blue-600">
                                    {item.email}
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-700 max-w-xs">
                                    <div className="truncate">
                                        {item.body.slice(0, 60)}{item.body.length > 60 ? '...' : ''}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}