"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Agent } from '../types';
import { Text } from '@/shared/components/Typography';
import { InputConfirmationModal } from '@/shared/components/modals/input-confirmation';
import { useDeleteAgent, useToggleAgentActive } from '../hooks';
import Button from '@/shared/components/Button';

interface AgentsGridProps {
    data: Agent[];
    isLoading?: boolean;
}

export const AgentsGrid: React.FC<AgentsGridProps> = ({ data, isLoading }) => {
    const router = useRouter();
    const { projectId } = useParams();
    const { mutate: deleteAgent, isPending: isDeleting } = useDeleteAgent();
    const { mutate: toggleActive } = useToggleAgentActive();
    const [deleteConfirm, setDeleteConfirm] = useState<Agent | null>(null);

    const handleViewClick = (agent: Agent) => {
        router.push(`/project/${projectId}/agents/${agent.id}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, agent: Agent) => {
        e.stopPropagation();
        setDeleteConfirm(agent);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteAgent(deleteConfirm.id.toString(), {
                onSuccess: () => setDeleteConfirm(null),
            });
        }
    };

    const handleToggleActive = (e: React.MouseEvent, agent: Agent) => {
        e.stopPropagation();
        toggleActive({ agentId: agent.id.toString(), active: !agent.active });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
                        <div className="h-4 bg-slate-100 rounded w-20 mb-4 ml-auto"></div>
                        <div className="h-6 bg-slate-100 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-100 rounded w-full mb-6"></div>
                        <div className="h-10 bg-slate-100 rounded w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">smart_toy</span>
                    <Text variant="sm" className="text-slate-500">
                        No agents found for this project.
                    </Text>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((agent) => (
                    <div
                        key={agent.id}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                        onClick={() => handleViewClick(agent)}
                    >
                        {/* Status Badge */}
                        <div className="flex justify-end mb-3">
                            <button
                                onClick={(e) => handleToggleActive(e, agent)}
                                className={`
                                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer
                                    ${agent.active
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'
                                    }
                                `}
                                title={agent.active ? 'Click to deactivate' : 'Click to activate'}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${agent.active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                {agent.active ? 'Active' : 'Inactive'}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1 group-hover:text-primary transition-colors">
                                {agent.name}
                            </h3>
                            <Text variant="sm" className="text-slate-500 line-clamp-2">
                                {agent.description || 'No description provided'}
                            </Text>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    handleViewClick(agent);
                                }}
                            >
                                View
                            </Button>
                            <button
                                onClick={(e) => handleDeleteClick(e, agent)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                title="Delete agent"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <InputConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Agent"
                description={
                    <>
                        This agent will be <strong>permanently deleted</strong>.
                        This cannot be undone.
                    </>
                }
                value={deleteConfirm?.name || ''}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                confirmText="Delete Agent"
                confirmVariant="primary"
            />
        </>
    );
};
