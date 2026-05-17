import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import Button from '@/shared/components/Button';

export const FeaturesHeader: React.FC = () => {
    const { projectId } = useParams();

    return (
        <div className="flex items-end justify-between mb-8">
            <div>
                <Heading as="h1" variant="section" className="text-3xl tracking-tight">
                    Features
                </Heading>
                <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                    Organize actions into logical feature groups for this project
                </Text>
            </div>
            <Link href={`/project/${projectId}/features/create`}>
                <Button variant="primary" size="md">
                    <span className="material-symbols-outlined text-[18px] mr-2">add</span>
                    Create Feature
                </Button>
            </Link>
        </div>
    );
};
