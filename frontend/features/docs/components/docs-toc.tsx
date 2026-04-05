import React from 'react';
import Link from 'next/link';
import Button from '@/shared/components/Button';

interface TocItem {
    label: string;
    href: string;
    active?: boolean;
}

const tocItems: TocItem[] = [
    { label: 'Introduction', href: '#introduction', active: true },
    { label: 'Core Concepts', href: '#concepts' },
    { label: 'API Reference', href: '#api' },
    { label: 'Code Example', href: '#example' },
];

const DocsToc: React.FC = () => {
    return (
        <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-8">
                <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">On this page</p>
                    <nav className="space-y-1 text-sm">
                        {tocItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`block border-l-2 pl-4 py-1.5 transition-all ${
                                    item.active
                                        ? 'text-primary border-primary'
                                        : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-white/20'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Support card */}
                <div className="relative overflow-hidden rounded-xl bg-primary p-6 group cursor-pointer">
                    <div className="relative z-10">
                        <h4 className="text-white font-bold mb-2">Need help?</h4>
                        <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                            Chat with our technical engineering team for implementation support.
                        </p>
                        <span className="inline-flex items-center gap-1 text-white text-xs font-bold">
                            Contact Support
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-8xl">support_agent</span>
                    </div>
                </div>

                {/* Upgrade card */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">enterprise</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">EAC Enterprise</p>
                            <p className="text-[10px] text-slate-500">Advanced security features</p>
                        </div>
                    </div>
                    <Button variant="white" size="sm" className="w-full justify-center">
                        Upgrade Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DocsToc;
