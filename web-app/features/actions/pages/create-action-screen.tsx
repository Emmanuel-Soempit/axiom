'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import { CreateActionForm } from '../components/create-action-form';

export const CreateActionScreen: React.FC = () => {
    const { projectId } = useParams();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div>
                <Link
                    href={`/project/${projectId}/actions`}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-4"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Actions
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading as="h1" variant="section" className="text-3xl tracking-tight">
                            Action Configuration
                        </Heading>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            Define a new structured action schema for the EAC engine
                        </Text>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200">
                            Draft
                        </span>
                    </div>
                </div>
            </div>

            <CreateActionForm />
        </div>
    );
};
