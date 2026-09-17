'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import Button from '@/shared/components/Button';
import { FeatureActionsTable } from '../components/feature-actions-table';
import { useFeature, useActionsByFeature } from '../hooks';

export const FeatureDetailsScreen: React.FC = () => {
    const { projectId, featureId } = useParams();
    const { data: featureRes, isLoading: isFeatureLoading } = useFeature(featureId as string);
    const { data: actionsRes, isLoading: isActionsLoading } = useActionsByFeature(featureId as string);

    const feature = featureRes?.data?.data;
    const actions = actionsRes?.data?.data || [];

    if (isFeatureLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <Text variant="sm" className="text-slate-500">Loading feature...</Text>
                </div>
            </div>
        );
    }

    if (!feature) {
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Breadcrumb */}
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
                            {feature.name}
                        </Heading>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            {feature.description}
                        </Text>
                    </div>
                    <Link href={`/project/${projectId}/features/${featureId}/edit`}>
                        <Button variant="primary" size="sm">
                            <span className="material-symbols-outlined text-[18px] mr-2">edit</span>
                            Edit Feature
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-4">
                <div className="flex items-end justify-between">
                    <div>
                        <Heading as="h5" variant='card' className="text- tracking-tight">
                            Actions
                        </Heading>
                        <Text variant="sm" className="mt-1 text-slate-500">
                            Actions grouped under this feature
                        </Text>
                    </div>
                    <Link href={`/project/${projectId}/features/${featureId}/actions/create`}>
                        <Button variant="primary" size="sm">
                            <span className="material-symbols-outlined text-[18px] mr-2">add</span>
                            Add Action
                        </Button>
                    </Link>
                </div>
                <FeatureActionsTable data={actions} isLoading={isActionsLoading} />
            </div>
        </div>
    );
};
