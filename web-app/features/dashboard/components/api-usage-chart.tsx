import React from 'react';
import { Text } from '@/shared/components/Typography';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

interface ApiUsageChartProps {
    data: Array<{ time: string, reqs: number }>;
}

export const ApiUsageChart: React.FC<ApiUsageChartProps> = ({ data }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm col-span-1 md:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined">monitoring</span>
                    </div>
                    <Text variant="sm" className="font-medium text-slate-500">API Traffic (24h)</Text>
                </div>
                <div className="text-right">
                    <Text as="p" variant="lg" className="font-bold text-slate-900 leading-none">1.2M reqs</Text>
                    <Text variant="sm" className="text-xs text-slate-400 mt-1">Avg 842ms latency</Text>
                </div>
            </div>
            {/* Recharts Wrapper */}
            <div className="h-28 mt-auto w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1919e6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#1919e6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#1919e6', fontWeight: 600 }}
                        />
                        <Area type="monotone" dataKey="reqs" stroke="#1919e6" strokeWidth={2} fillOpacity={1} fill="url(#colorReqs)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
