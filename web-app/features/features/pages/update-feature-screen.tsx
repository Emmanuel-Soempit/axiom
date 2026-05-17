'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import { CreateFeatureForm } from '../components/create-feature-form';
import { useFeature } from '../hooks';

export const UpdateFeatureScreen: React.FC = () => {
    const { projectId, featureId } = useParams();
    const { data, isLoading, error } = useFeature(featureId as string);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <Text variant="sm" className="text-slate-500">Loading feature...</Text>
                </div>
            </div>
        );
    }

    if (error || !data?.data?.data) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <Heading as="h2" variant="section">Feature not found</Heading>
                    <Text variant="sm" className="mt-2 text-slate-500">
                        The feature you're looking for doesn't exist or has been deleted.
                    </Text>
                    <Link
                        href={`/project/${projectId}/features`}
                        className="inline-block mt-4 text-primary hover:underline"
                    >
                        Back to Features
                    </Link>
                </div>
            </div>
        );
    }

    const feature = data.data.data;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div>
                <Link
                    href={`/project/${projectId}/features`}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-4"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Features
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading as="h1" variant="section" className="text-3xl tracking-tight">
                            Edit Feature
                        </Heading>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            Modify the feature <span className="font-mono text-primary">{feature.name}</span>
                        </Text>
                    </div>
                </div>
            </div>

            <CreateFeatureForm feature={feature} />
        </div>
    );
};
