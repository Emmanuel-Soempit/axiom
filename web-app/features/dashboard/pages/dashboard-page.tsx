"use client";

import React from 'react';
import { StatsCard } from '../components/stats-card';
import { Heading, Text } from '@/shared/components/Typography';
import { DashboardHeader } from '../components/dashboard-header';
import { ApiUsageChart } from '../components/api-usage-chart';
import { QuickLinks } from '../components/quick-links';
import { RecentActivity } from '../components/recent-activity';

const dummyTrafficData = [
    { time: '00:00', reqs: 1200 },
    { time: '04:00', reqs: 900 },
    { time: '08:00', reqs: 2100 },
    { time: '12:00', reqs: 4800 },
    { time: '16:00', reqs: 5200 },
    { time: '20:00', reqs: 3100 },
    { time: '24:00', reqs: 1500 },
];

export function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Main Header */}
            <DashboardHeader />

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Action Count Card */}
                <StatsCard
                    title="Defined Schemas"
                    value="128"
                    icon="schema"
                    variant="secondary"
                    trendLabel="+4 today"
                    trendType="positive"
                />

                {/* API Usage Area Chart */}
                <ApiUsageChart data={dummyTrafficData} />

                {/* Quick Links */}
                <QuickLinks />
            </div>

            {/* Bottom Grid: Logs and Other Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Audit Logs */}
                <RecentActivity />

                {/* Recently Accessed Projects */}
                <div className="space-y-6">
                    <Heading as="h3" variant="card" className="px-2">Other Projects</Heading>
                    <div className="flex flex-col gap-4">
                        <StatsCard
                            icon="biotech"
                            variant="default"
                            className="group cursor-pointer hover:border-primary/50"
                            trendLabel="Staging"
                            trendType="neutral"
                            title={
                                <Heading as="h4" variant="card" className="mt-2 text-base">Staging Environment</Heading>
                            }
                            value={
                                <Text variant="sm" className="text-xs">v2.5.0-beta • 3 active nodes</Text>
                            }
                        />

                        <StatsCard
                            icon="construction"
                            variant="default"
                            className="group cursor-pointer hover:border-primary/50"
                            trendLabel="Internal"
                            trendType="neutral"
                            title={
                                <Heading as="h4" variant="card" className="mt-2 text-base">Internal Tools</Heading>
                            }
                            value={
                                <Text variant="sm" className="text-xs">v1.2.0 • Admin dashboard only</Text>
                            }
                        />

                        <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 mt-2">
                            <span className="material-symbols-outlined">apps</span>
                            Manage All Projects
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}