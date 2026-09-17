import React from 'react';

export interface DataColumn<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
    headerClassName?: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataColumn<T>[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    isLoading = false,
    emptyMessage = "No data found"
}: DataTableProps<T>) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${column.headerClassName || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-gray-400 text-sm">
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-gray-400 text-sm">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-50 transition-colors group"
                                >
                                    {columns.map((column, index) => (
                                        <td key={index} className={`px-6 py-6 text-gray-400 ${column.className || ''}`}>
                                            {column.render
                                                ? column.render(item)
                                                : typeof column.accessor === 'function'
                                                    ? column.accessor(item)
                                                    : (item[column.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Showing {data.length} items</p>
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                        disabled
                    >
                        Previous
                    </button>
                    <button
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                        disabled
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
