'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import { CreateActionForm } from '../components/create-action-form';
import { useAction } from '../hooks';

export const UpdateActionScreen: React.FC = () => {
    const { projectId, actionId } = useParams();
    const { data, isLoading, error } = useAction(actionId as string);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <Text variant="sm" className="text-slate-500">Loading action...</Text>
                </div>
            </div>
        );
    }

    if (error || !data?.data?.data) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <Heading as="h2" variant="section">Action not found</Heading>
                    <Text variant="sm" className="mt-2 text-slate-500">
                        The action you're looking for doesn't exist or has been deleted.
                    </Text>
                    <Link
                        href={`/project/${projectId}/actions`}
                        className="inline-block mt-4 text-primary hover:underline"
                    >
                        Back to Actions
                    </Link>
                </div>
            </div>
        );
    }

    const action = data.data.data;

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
                            Edit Action
                        </Heading>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            Modify the action schema for <span className="font-mono text-primary">{action.name}</span>
                        </Text>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-mono border border-amber-200">
                            v{action.version}
                        </span>
                    </div>
                </div>
            </div>

            <CreateActionForm action={action} />
        </div>
    );
};
