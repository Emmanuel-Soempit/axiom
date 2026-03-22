import React from 'react';
import { Text } from '@/shared/components/Typography';

export const QuickLinks: React.FC = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <Text variant="xs" className="font-bold tracking-widest mb-4">
                Quick Links
            </Text>
            <ul className="space-y-3">
                <li>
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">description</span>
                        API Reference
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">contact_support</span>
                        Dev Support
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">receipt_long</span>
                        Billing Portal
                    </a>
                </li>
            </ul>
        </div>
    );
};
