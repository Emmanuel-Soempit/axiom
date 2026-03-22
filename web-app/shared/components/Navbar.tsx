import React from 'react';
import Button from './Button';

const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#111121]/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                        <span className="material-symbols-outlined text-xl">settings_input_component</span>
                    </div>
                    <span className="text-xl font-black tracking-tight text-white">EAC</span>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-medium hover:text-primary transition-colors text-slate-400" href="#">Product</a>
                    <a className="text-sm font-medium hover:text-primary transition-colors text-slate-400" href="#">Architecture</a>
                    <a className="text-sm font-medium hover:text-primary transition-colors text-slate-400" href="#">Docs</a>
                    <a className="text-sm font-medium hover:text-primary transition-colors text-slate-400" href="#">Examples</a>
                    <a className="text-sm font-medium hover:text-primary transition-colors text-slate-400" href="#">GitHub</a>
                </nav>
                <div className="flex items-center gap-4">
                    <Button variant="primary" size="md">
                        Start Building
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
