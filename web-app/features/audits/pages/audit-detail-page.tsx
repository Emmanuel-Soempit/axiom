"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuditRecord } from '../types';
import { AuditDetail } from '../components/audit-detail';
import { Text } from '@/shared/components/Typography';

export const AuditDetailPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const raw = searchParams.get('data');
    let audit: AuditRecord | null = null;

    try {
        if (raw) {
            audit = JSON.parse(decodeURIComponent(raw));
        }
    } catch {
        audit = null;
    }

    if (!audit) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="material-symbols-outlined text-5xl text-slate-300">error_outline</span>
                <Text variant="md" className="text-slate-500">Audit record not found.</Text>
                <button
                    onClick={() => router.back()}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    return <AuditDetail audit={audit} />;
};
