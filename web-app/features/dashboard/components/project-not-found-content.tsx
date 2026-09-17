"use client";

import React from 'react';
import Link from 'next/link';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';

export const ProjectNotFoundContent: React.FC = () => {
    return (
        <div className="w-full max-w-[520px]">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <span className="material-symbols-outlined">running_with_errors</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Not Found</h1>
                            <p className="text-slate-500 text-sm">The project you're looking for doesn't exist or you don't have access.</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
                    <Button
                        href="/project"
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <span>Go to Projects</span>
                        <span className="material-symbols-outlined text-sm">list_alt</span>
                    </Button>
                    <Link
                        href="/project/new-project"
                        className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Create New Project</span>
                        <span className="material-symbols-outlined text-sm">add_box</span>
                    </Link>
                </div>
            </Card>
        </div>
    );
};
