'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import { CreateFeatureForm } from '../components/create-feature-form';

export const CreateFeatureScreen: React.FC = () => {
    const { projectId } = useParams();

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
                            Feature Configuration
                        </Heading>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            Define a new feature to organize related actions
                        </Text>
                    </div>
                </div>
            </div>

            <CreateFeatureForm />
        </div>
    );
};
