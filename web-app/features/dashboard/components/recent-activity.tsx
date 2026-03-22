import React from 'react';
import { Heading, Text } from '@/shared/components/Typography';

export const RecentActivity: React.FC = () => {
    return (
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <Heading as="h3" variant="card">Recent Audit Logs</Heading>
                <button className="text-sm text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">key</span>
                        </div>
                        <div>
                            <Text as="p" variant="sm" className="font-semibold text-slate-900">API Key Rotation</Text>
                            <Text variant="sm" className="text-xs">Performed by Admin (felix@eac.dev)</Text>
                        </div>
                    </div>
                    <Text variant="sm" className="text-xs">2h ago</Text>
                </div>
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </div>
                        <div>
                            <Text as="p" variant="sm" className="font-semibold text-slate-900">Production Deployment</Text>
                            <Text variant="sm" className="text-xs">Success: v2.4.0-stable</Text>
                        </div>
                    </div>
                    <Text variant="sm" className="text-xs">14m ago</Text>
                </div>
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <div>
                            <Text as="p" variant="sm" className="font-semibold text-slate-900">Failed Login Attempt</Text>
                            <Text variant="sm" className="text-xs">Origin: 192.168.1.1</Text>
                        </div>
                    </div>
                    <Text variant="sm" className="text-xs">5h ago</Text>
                </div>
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">edit_square</span>
                        </div>
                        <div>
                            <Text as="p" variant="sm" className="font-semibold text-slate-900">Schema Updated</Text>
                            <Text variant="sm" className="text-xs">Modified 'user_auth' definition</Text>
                        </div>
                    </div>
                    <Text variant="sm" className="text-xs">1d ago</Text>
                </div>
            </div>
        </div>
    );
};
