import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';

export const QuickAccess: React.FC = () => {
    const params = useParams();
    const projectId = params.projectId as string;
    const basePath = `/project/${projectId}`;

    const quickAccessLinks = [
        {
            label: 'Audits',
            description: 'View project audit logs and activity',
            href: `${basePath}/audits`,
            icon: 'analytics',
            iconClass: 'bg-primary/10 text-primary',
        },
        {
            label: 'Actions',
            description: 'Run and monitor project actions',
            href: `${basePath}/actions`,
            icon: 'auto_fix',
            iconClass: 'bg-emerald-500/10 text-emerald-600',
        },
        {
            label: 'API Keys',
            description: 'Manage access keys for this project',
            href: `${basePath}/keys`,
            icon: 'key',
            iconClass: 'bg-orange-500/10 text-orange-500',
        },
    ];

    return (
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <Heading as="h3" variant="card">Quick Access</Heading>
                <Link href={basePath} className="text-sm text-primary font-medium hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
                {quickAccessLinks.map((item) => (
                    <Link key={item.label} href={item.href} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`size-10 rounded-lg flex items-center justify-center ${item.iconClass}`}>
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div>
                                <Text as="p" variant="sm" className="font-semibold text-slate-900">{item.label}</Text>
                                <Text variant="sm" className="text-xs">{item.description}</Text>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
