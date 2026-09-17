"use client";

import React, { useState } from 'react';
import { DataTable, DataColumn } from '@/shared/components/data-table';
import Button from '@/shared/components/Button';
import { Heading, Text } from '@/shared/components/Typography';
import { useApiKeys, useRevokeApiKey, useDeleteApiKey } from '../hooks';
import { ApiKey } from '../types';
import { CreateApiKeyForm } from '../components/create-api-key-form';
import { InputConfirmationModal } from '@/shared/components/modals';

const ActionMenu = ({ item, onAction }: { item: ApiKey, onAction: (action: 'revoke' | 'delete', item: ApiKey) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative flex justify-end">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100"
            >
                <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-[60] overflow-hidden">
                    <button
                        onClick={() => { setIsOpen(false); onAction('revoke', item); }}
                        className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 font-medium"
                    >
                        Revoke
                    </button>
                    <button
                        onClick={() => { setIsOpen(false); onAction('delete', item); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export const KeysScreen: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        action: 'revoke' | 'delete' | null;
        key: ApiKey | null;
    }>({
        isOpen: false,
        action: null,
        key: null,
    });

    const { data: response, isLoading } = useApiKeys();
    const { mutate: revokeApiKey, isPending: isRevoking } = useRevokeApiKey();
    const { mutate: deleteApiKey, isPending: isDeleting } = useDeleteApiKey();

    const keys = response?.data?.data || [];

    const handleAction = (action: 'revoke' | 'delete', key: ApiKey) => {
        setConfirmState({ isOpen: true, action, key });
    };

    const handleConfirm = () => {
        if (!confirmState.key) return;
        if (confirmState.action === 'revoke') {
            revokeApiKey(confirmState.key.id, {
                onSettled: () => setConfirmState(prev => ({ ...prev, isOpen: false }))
            });
        } else if (confirmState.action === 'delete') {
            deleteApiKey(confirmState.key.id, {
                onSettled: () => setConfirmState(prev => ({ ...prev, isOpen: false }))
            });
        }
    };

    const columns: DataColumn<ApiKey>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (item) => (
                <span className="text-sm font-semibold text-slate-700">
                    {item.name}
                </span>
            )
        },
        {
            header: 'Key',
            accessor: 'key_prefix',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                        {item.key_prefix}
                    </code>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'revoked'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            )
        },
        {
            header: 'Created Date',
            accessor: 'created_at',
            render: (item) => (
                <span className="text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    })}
                </span>
            )
        },
        {
            header: '',
            accessor: 'id',
            render: (item) => <ActionMenu item={item} onAction={handleAction} />
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Heading as="h1" variant="section" className="text-3xl">API Keys</Heading>
                    <Text variant="sm" className="mt-1 max-w-xl">
                        Manage your API keys to authenticate with the EAC Engine API.
                        Keep your secret keys secure and never expose them in client-side code.
                    </Text>
                </div>
                <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
                    <span className="material-symbols-outlined text-lg mr-1">add</span>
                    Create New API Key
                </Button>
            </div>

            {/* Alert / Best Practices */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                    <span className="material-symbols-outlined">security</span>
                </div>
                <div className="flex-1">
                    <Text variant="xs" className="text-amber-800 mb-1">Security Best Practice</Text>
                    <Text variant="sm" className="text-amber-700 leading-relaxed">
                        Never share your secret keys in public repositories or client-side code.
                        Use environment variables to manage them securely. Rotating keys every 90 days is recommended.
                    </Text>
                    <a className="inline-flex items-center gap-1 text-amber-800 font-bold text-xs mt-3 group hover:underline underline-offset-4" href="#">
                        View Security Documentation
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </a>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={keys}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No API keys found for this project"
            />

            {/* Create API Key Modal */}
            <CreateApiKeyForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {/* Confirmation Modal */}
            <InputConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                title={confirmState.action === 'revoke' ? 'Revoke API Key' : 'Delete API Key'}
                description={
                    confirmState.action === 'revoke'
                        ? 'Revoking this API key will immediately invalidate it. Any applications using it will be denied access.'
                        : 'Deleting this API key is a permanent action and cannot be undone. Any applications using it will be denied access.'
                }
                value={confirmState.key?.name || ''}
                onConfirm={handleConfirm}
                isLoading={isRevoking || isDeleting}
                confirmText={confirmState.action === 'revoke' ? 'Revoke Key' : 'Delete Key'}
                confirmVariant="primary"
            />
        </div>
    );
};
