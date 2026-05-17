'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import Button from '@/shared/components/Button';
import { DataTable, DataColumn } from '@/shared/components/data-table';
import { AuditTable } from '@/features/audits/components/audit-table';
import { useAgent, useAgentAudits, useAgentFeatures } from '../hooks';
import { Feature } from '@/features/features/types';

const Pagination: React.FC<{
    page: number;
    total: number;
    limit: number;
    onChange: (p: number) => void;
}> = ({ page, total, limit, onChange }) => {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">{total} total</p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export const AgentDetailsScreen: React.FC = () => {
    const { projectId, agentId } = useParams();
    const id = agentId as string;

    const { data: agentRes, isLoading } = useAgent(id);

    const [featuresPage, setFeaturesPage] = useState(1);
    const [auditsPage, setAuditsPage] = useState(1);

    const { data: featuresRes, isLoading: featuresLoading } = useAgentFeatures(id, featuresPage);
    const { data: auditsRes, isLoading: auditsLoading } = useAgentAudits(id, auditsPage);

    const agent = agentRes?.data?.data;
    const featuresData = featuresRes?.data?.data;
    const auditsData = auditsRes?.data?.data;

    const featureColumns: DataColumn<Feature>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (f) => <span className="font-medium text-slate-700 text-sm">{f.name}</span>,
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (f) => (
                <Text variant="sm" className="max-w-[320px] truncate text-slate-500">
                    {f.description || '—'}
                </Text>
            ),
        },
        {
            header: 'Slug',
            accessor: 'id',
            render: (f: any) => (
                <span className="font-mono text-xs text-slate-400">{f.slug ?? '—'}</span>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <Text variant="sm" className="text-slate-500">Loading agent...</Text>
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <Heading as="h2" variant="section">Agent not found</Heading>
                    <Text variant="sm" className="mt-2 text-slate-500">
                        The agent you are looking for does not exist or has been deleted.
                    </Text>
                    <Link href={`/project/${projectId}/agents`} className="inline-block mt-4 text-primary hover:underline">
                        Back to Agents
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <Link
                    href={`/project/${projectId}/agents`}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-4"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Agents
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Heading as="h1" variant="section" className="text-3xl tracking-tight">
                                {agent.name}
                            </Heading>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${agent.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${agent.active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {agent.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            {agent.description || 'No description provided'}
                        </Text>
                        <span className="inline-block mt-1 font-mono text-xs text-slate-400">slug: {agent.slug}</span>
                    </div>
                    <Link href={`/project/${projectId}/agents/${agentId}/edit`}>
                        <Button variant="primary" size="sm">
                            <span className="material-symbols-outlined text-[18px] mr-2">edit</span>
                            Edit Agent
                        </Button>
                    </Link>
                </div>
            </div>

            {/* System Prompt */}
            {agent.system_prompt && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 mb-3">System Prompt</h3>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <Text variant="sm" className="text-slate-600 whitespace-pre-wrap font-mono">
                            {agent.system_prompt}
                        </Text>
                    </div>
                </div>
            )}

            {/* Features Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <Heading as="h2" variant="section">Associated Features</Heading>
                    <Text variant="sm" className="text-slate-400 mt-0.5">
                        Features linked to this agent — their actions are available as tools.
                    </Text>
                </div>
                <DataTable
                    data={featuresData?.data ?? []}
                    columns={featureColumns}
                    isLoading={featuresLoading}
                    emptyMessage="No features associated with this agent."
                />
                <Pagination
                    page={featuresPage}
                    total={featuresData?.total ?? 0}
                    limit={featuresData?.limit ?? 20}
                    onChange={setFeaturesPage}
                />
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <Heading as="h2" variant="section">Audit Logs</Heading>
                    <Text variant="sm" className="text-slate-400 mt-0.5">
                        All recorded events for this agent, including errors and validated actions.
                    </Text>
                </div>
                <AuditTable
                    data={auditsData?.data ?? []}
                    isLoading={auditsLoading}
                    page={auditsPage}
                    total={auditsData?.total}
                    limit={auditsData?.limit ?? 20}
                    onPageChange={setAuditsPage}
                    emptyMessage="No audit records for this agent yet."
                />
            </div>
        </div>
    );
};
