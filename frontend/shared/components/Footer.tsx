import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#111121] border-t border-white/10 px-6 py-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined text-xl">settings_input_component</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">EAC</span>
                    </div>
                    <p className="text-sm text-slate-400">© 2024 Embedded Agent Controller Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="text-slate-400 hover:text-primary" href="#"><span className="material-symbols-outlined">public</span></a>
                        <a className="text-slate-400 hover:text-primary" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
                        <a className="text-slate-400 hover:text-primary" href="#"><span className="material-symbols-outlined">terminal</span></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
