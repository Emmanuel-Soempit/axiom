import React from 'react';

export const CreationNavbar: React.FC = () => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 shrink-0 z-20 bg-white">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <img src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/pngs/main-logo.png`} alt="EAC" className='h-10' />
                </div>
            </div>
            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-1"></div>
                    <div className="flex items-center gap-3 pl-1">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/40">
                            <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
