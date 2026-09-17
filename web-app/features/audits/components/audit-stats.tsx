"use client";

import React from 'react';
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { AuditSummary } from '../types';

interface AuditStatsProps {
    summary: AuditSummary;
    isLoading?: boolean;
}

const formatPercentage = (pct: number): string => {
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(1)}%`;
};

const getTrendType = (pct: number, invert = false): 'positive' | 'negative' | 'neutral' => {
    if (pct === 0) return 'neutral';
    if (invert) return pct > 0 ? 'negative' : 'positive';
    return pct > 0 ? 'positive' : 'negative';
};

export const AuditStats: React.FC<AuditStatsProps> = ({ summary, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-pulse">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg mb-4" />
                        <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                        <div className="h-6 w-16 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
                title="Total Events"
                value={summary.total.value.toLocaleString()}
                icon="browse_activity"
                variant="primary"
                trendLabel={`${formatPercentage(summary.total.percentage)} from last 24h`}
                trendType={getTrendType(summary.total.percentage)}
            />
            <StatsCard
                title="Failed Validations"
                value={summary.failed.value.toLocaleString()}
                icon="report"
                variant="accent"
                trendLabel={`${formatPercentage(summary.failed.percentage)} from last 24h`}
                trendType={getTrendType(summary.failed.percentage, true)}
            />
            <StatsCard
                title="Successful Validations"
                value={summary.successful.value.toLocaleString()}
                icon="check_circle"
                variant="secondary"
                trendLabel={`${formatPercentage(summary.successful.percentage)} from last 24h`}
                trendType={getTrendType(summary.successful.percentage)}
            />
        </div>
    );
};
