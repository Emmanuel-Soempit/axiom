"use client";

import React from 'react';
import { Heading, Text } from '@/shared/components/Typography';
import { useAudits } from '../hooks';
import { AuditStats } from '../components/audit-stats';
import { AuditTable } from '../components/audit-table';

const EMPTY_SUMMARY = {
    total: { value: 0, percentage: 0 },
    failed: { value: 0, percentage: 0 },
    successful: { value: 0, percentage: 0 },
};

export const AuditsScreen: React.FC = () => {
    const { data: response, isLoading } = useAudits();

    const overview = response?.data?.data;
    const audits = overview?.audits || [];
    const summary = overview?.summary || EMPTY_SUMMARY;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <Heading as="h1" variant="section" className="text-3xl">Audit Logs</Heading>
                <Text variant="sm" className="mt-1 max-w-xl">
                    Monitor all agent actions, validation outcomes, and system events across your project.
                </Text>
            </div>

            {/* Stats Cards */}
            <AuditStats summary={summary} isLoading={isLoading} />

            {/* Audit Table */}
            <AuditTable data={audits} isLoading={isLoading} />
        </div>
    );
};
