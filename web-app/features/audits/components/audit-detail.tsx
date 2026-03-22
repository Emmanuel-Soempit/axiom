"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import Button from '@/shared/components/Button';
import { AuditRecord } from '../types';

interface AuditDetailProps {
    audit: AuditRecord;
}

export const AuditDetail: React.FC<AuditDetailProps> = ({ audit }) => {
    const router = useRouter();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Audit Logs
                    </button>
                    <Heading as="h1" variant="section" className="text-3xl">
                        Audit Detail: {audit.id}
                    </Heading>
                </div>
                <div className="flex gap-3">
                    <Button variant="white" size="md">
                        <span className="material-symbols-outlined text-base mr-2">download</span>
                        Download JSON
                    </Button>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metadata Card */}
                <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                        Technical Metadata
                    </h3>
                    <div className="space-y-1">
                        {/* <MetadataRow label="Record ID" value={<span className="font-mono font-bold text-primary">{audit.id}</span>} />
                        <MetadataRow label="Project ID" value={<span className="font-mono text-slate-900">{audit.project_id}</span>} /> */}
                        <MetadataRow
                            label="Created At"
                            value={
                                <span className="text-slate-900">
                                    {new Date(audit.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}{' '}
                                    {new Date(audit.created_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit', minute: '2-digit', hour12: true,
                                    })}
                                </span>
                            }
                        />
                        <MetadataRow
                            label="Validated"
                            value={
                                audit.validated ? (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded inline-flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">check_circle</span>
                                        Success
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded inline-flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">cancel</span>
                                        Failed
                                    </span>
                                )
                            }
                        />
                        <MetadataRow
                            label="Validation Errors"
                            value={
                                audit.validation_errors && audit.validation_errors.length > 0 ? (
                                    <div className="space-y-1">
                                        {audit.validation_errors.map((err, i) => (
                                            <p key={i} className="text-xs text-red-600 font-mono">{err}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-slate-400 italic text-sm">None</span>
                                )
                            }
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Prompt Section */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-700">Raw Prompt</h3>
                            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">TEXT_INPUT</span>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {audit.prompt}
                            </p>
                        </div>
                    </div>

                    {/* Code Blocks Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Proposed Action */}
                        <JsonBlock
                            title="PROPOSED ACTION"
                            data={audit.proposed_action}
                            colorClass="text-emerald-400"
                        />

                        {/* Final Response */}
                        <JsonBlock
                            title="FINAL RESPONSE"
                            data={audit.final_response}
                            colorClass="text-blue-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetadataRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-start py-3 border-b border-slate-50 last:border-0">
        <span className="text-slate-500 text-sm">{label}</span>
        <div className="text-right">{value}</div>
    </div>
);

const JsonBlock = ({
    title,
    data,
    colorClass,
}: {
    title: string;
    data: Record<string, any> | null | undefined;
    colorClass: string;
}) => {
    const isEmpty = !data || Object.keys(data).length === 0;

    const handleCopy = () => {
        if (!isEmpty) {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        }
    };

    return (
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 tracking-wider">{title}</span>
                {!isEmpty && (
                    <button
                        onClick={handleCopy}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                )}
            </div>
            <div className="p-4 overflow-x-auto">
                {isEmpty ? (
                    <p className="text-sm text-slate-500 italic">No data</p>
                ) : (
                    <pre className={`text-sm font-mono leading-6 ${colorClass}`}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};
