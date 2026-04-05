'use client';

import React from 'react';
import Link from 'next/link';

interface NavItem {
    label: string;
    icon: string;
    href: string;
    active?: boolean;
}

const navItems: NavItem[] = [
    { label: 'Project', icon: 'folder', href: '#introduction', active: true },
    { label: 'Action', icon: 'play_arrow', href: '#concepts' },
    { label: 'Audit', icon: 'history', href: '#api' },
    { label: 'API Keys', icon: 'vpn_key', href: '#example' },
];

const DocsSidebar: React.FC = () => {
    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-white/10 bg-[#111121] flex flex-col p-4 space-y-2 text-sm z-40 hidden md:flex">
            <div className="mb-6 px-4">
                <h2 className="text-lg font-semibold text-white">Project Settings</h2>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">Infrastructure Management</p>
            </div>

            <nav className="space-y-1 flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all active:scale-95 ${
                            item.active
                                ? 'text-primary bg-primary/10 font-bold'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="pt-4 border-t border-white/10">
                <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">System Status</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block"></span>
                        Operational
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DocsSidebar;
