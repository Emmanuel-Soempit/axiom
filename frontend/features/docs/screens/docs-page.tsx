import React from 'react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import { DocsSidebar, DocsContent, DocsToc } from '../components';

const DocsPage: React.FC = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#111121]">
            <Navbar />

            <div className="flex flex-1">
                <DocsSidebar />

                <main className="flex-1 md:ml-64 pt-10 pb-20 px-6 lg:px-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <DocsContent />
                            <DocsToc />
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#111121] border-t border-white/10 grid grid-cols-4 h-16 z-50">
                {[
                    { label: 'Project', icon: 'folder', active: true },
                    { label: 'Action', icon: 'play_arrow' },
                    { label: 'Audit', icon: 'history' },
                    { label: 'API Keys', icon: 'vpn_key' },
                ].map((item) => (
                    <a
                        key={item.label}
                        href="#"
                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                            item.active ? 'text-primary' : 'text-slate-500'
                        }`}
                    >
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        <span className="text-[10px]">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="hidden md:block">
                <Footer />
            </div>
        </div>
    );
};

export default DocsPage;
