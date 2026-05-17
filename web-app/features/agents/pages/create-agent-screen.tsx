'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import { CreateAgentForm } from '../components/create-agent-form';

export const CreateAgentScreen: React.FC = () => {
    const { projectId } = useParams();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div>
                <Link
                    href={`/project/${projectId}/agents`}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-4"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Agents
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading as="h1" variant="section" className="text-3xl tracking-tight">
                            Agent Configuration
                        </Heading>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            Define a new AI agent and associate it with features
                        </Text>
                    </div>
                </div>
            </div>

            <CreateAgentForm />
        </div>
    );
};
