import React from 'react';
import { Heading, Text } from '@/shared/components/Typography';
import Button from '@/shared/components/Button';
import { useAuth } from '@/providers/auth';

export const DashboardHeader: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 pb-6 border-b border-slate-200 gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Heading as="h1" variant="section" className="text-3xl tracking-tight">
                        {user?.project?.name}
                    </Heading>
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/30">
                        Live
                    </span>
                </div>
                <Text variant="sm" className="flex items-center gap-2">
                    <span className="flex size-2 bg-primary rounded-full animate-pulse"></span>
                    System Operational • Region: us-east-1 • Last deploy: 14m ago
                </Text>
            </div>
            <div className="flex gap-3">
                <Button variant="white" size="sm">
                    <span className="material-symbols-outlined text-lg mr-1.5">terminal</span>
                    View Logs
                </Button>
                <Button variant="white" size="sm">
                    <span className="material-symbols-outlined text-lg mr-1.5">settings</span>
                    Configure
                </Button>
            </div>
        </div>
    );
};
