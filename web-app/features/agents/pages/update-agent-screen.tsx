'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heading, Text } from '@/shared/components/Typography';
import { CreateAgentForm } from '../components/create-agent-form';
import { useAgent } from '../hooks';

export const UpdateAgentScreen: React.FC = () => {
    const { projectId, agentId } = useParams();
    const { data, isLoading, error } = useAgent(agentId as string);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <Text variant="sm" className="text-slate-500">Loading agent...</Text>
                </div>
            </div>
        );
    }

    if (error || !data?.data?.data) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <Heading as="h2" variant="section">Agent not found</Heading>
                    <Text variant="sm" className="mt-2 text-slate-500">
                        The agent you are looking for does not exist or has been deleted.
                    </Text>
                    <Link
                        href={`/project/${projectId}/agents`}
                        className="inline-block mt-4 text-primary hover:underline"
                    >
                        Back to Agents
                    </Link>
                </div>
            </div>
        );
    }

    const agent = data.data.data;

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
                            Edit Agent
                        </Heading>
                        <Text variant="sm" className="mt-1 max-w-xl text-slate-500">
                            Modify the agent <span className="font-mono text-primary">{agent.name}</span>
                        </Text>
                    </div>
                </div>
            </div>

            <CreateAgentForm agent={agent} />
        </div>
    );
};
