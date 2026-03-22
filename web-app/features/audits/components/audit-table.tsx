"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DataTable, DataColumn } from '@/shared/components/data-table';
import { Text } from '@/shared/components/Typography';
import { AuditRecord } from '../types';

const timeAgo = (dateStr: string): string => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHr > 0) return `${diffHr}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
};

const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
};

interface AuditTableProps {
    data: AuditRecord[];
    isLoading?: boolean;
}

export const AuditTable: React.FC<AuditTableProps> = ({ data, isLoading }) => {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.projectId as string;

    const handleInspect = (item: AuditRecord) => {
        const encoded = encodeURIComponent(JSON.stringify(item));
        router.push(`/project/${projectId}/audits/${item.id}?data=${encoded}`);
    };

    const columns: DataColumn<AuditRecord>[] = [
        {
            header: 'Event Time',
            accessor: 'created_at',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-700 text-sm">{timeAgo(item.created_at)}</span>
                    <span className="text-[10px] text-slate-400">{formatTime(item.created_at)}</span>
                </div>
            ),
        },
        {
            header: 'Prompt',
            accessor: 'prompt',
            render: (item) => (
                <Text variant="sm" className="max-w-[280px] truncate text-slate-600">
                    {item.prompt}
                </Text>
            ),
        },
        {
            header: 'Validation',
            accessor: 'validated',
            render: (item) =>
                item.validated ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Valid
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-tight">
                        <span className="size-1.5 bg-red-500 rounded-full" />
                        Failed
                    </span>
                ),
        },
        {
            header: 'Status',
            accessor: 'id',
            render: (item) =>
                item.validated ? (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                        <span className="font-medium text-sm text-slate-700">Completed</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-400 text-base">block</span>
                        <span className="font-medium text-sm text-slate-700">Blocked</span>
                    </div>
                ),
        },
        {
            header: '',
            accessor: 'id',
            render: (item) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => handleInspect(item)}
                        className="text-xs font-bold text-blue-500 hover:text-blue-600 px-3 py-1 bg-blue-500/10 rounded-lg transition-colors border border-blue-500/20"
                    >
                        Inspect
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No audit records found for this project."
        />
    );
};
