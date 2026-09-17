'use client';
import React from 'react';
import { AgentsHeader, AgentsGrid } from '../components';
import { useAgents } from '../hooks';

export const AgentsScreen: React.FC = () => {
    const { data: response, isLoading } = useAgents();
    const agents = response?.data?.data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <AgentsHeader />
            <AgentsGrid data={agents} isLoading={isLoading} />
        </div>
    );
};
