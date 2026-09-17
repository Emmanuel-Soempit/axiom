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

const errorTypeLabel: Record<string, string> = {
    agent_not_found: 'Agent Not Found',
    load_actions: 'Load Actions',
    load_history: 'Load History',
    build_system_prompt: 'Build Prompt',
    llm_chat: 'LLM Chat',
    action_not_found: 'Action Not Found',
    validation_error: 'Validation Error',
    validation_failed: 'Validation Failed',
    persist_user_message: 'Persist User Msg',
    persist_assistant_message: 'Persist Assistant Msg',
    persist_tool_message: 'Persist Tool Msg',
};

interface AuditTableProps {
    data: AuditRecord[];
    isLoading?: boolean;
    page?: number;
    total?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    emptyMessage?: string;
}

export const AuditTable: React.FC<AuditTableProps> = ({
    data,
    isLoading,
    page = 1,
    total,
    limit = 20,
    onPageChange,
    emptyMessage = 'No audit records found.',
}) => {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.projectId as string;

    const totalPages = total !== undefined ? Math.ceil(total / limit) : 1;

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
                <Text variant="sm" className="max-w-[260px] truncate text-slate-600">
                    {item.prompt}
                </Text>
            ),
        },
        {
            header: 'Agent / Action',
            accessor: 'agent_id',
            render: (item) => (
                <div className="flex flex-col gap-0.5">
                    {item.agent_id && (
                        <span className="text-xs text-slate-500">Agent <span className="font-mono text-slate-700">#{item.agent_id}</span></span>
                    )}
                    {item.action_id && (
                        <span className="text-xs text-slate-500">Action <span className="font-mono text-slate-700">#{item.action_id}</span></span>
                    )}
                    {!item.agent_id && !item.action_id && (
                        <span className="text-xs text-slate-400">—</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Outcome',
            accessor: 'validated',
            render: (item) => (
                <div className="flex flex-col gap-1">
                    {item.validated ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight w-fit">
                            <span className="size-1.5 bg-emerald-500 rounded-full" />
                            Valid
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-tight w-fit">
                            <span className="size-1.5 bg-red-500 rounded-full" />
                            Failed
                        </span>
                    )}
                    {item.error_type && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold w-fit">
                            {errorTypeLabel[item.error_type] ?? item.error_type}
                        </span>
                    )}
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
        <div className="space-y-0">
            <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                emptyMessage={emptyMessage}
            />
            {onPageChange && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white rounded-b-xl">
                    <p className="text-xs text-slate-500">
                        {total !== undefined ? `${total} total records` : `${data.length} records`}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
