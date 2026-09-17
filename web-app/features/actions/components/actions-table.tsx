"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DataTable, DataColumn } from '@/shared/components/data-table';
import { Action } from '../types';
import { Text } from '@/shared/components/Typography';
import { InputConfirmationModal } from '@/shared/components/modals/input-confirmation';
import { useDeleteAction } from '../hooks';

interface ActionsTableProps {
    data: Action[];
    isLoading?: boolean;
}

export const ActionsTable: React.FC<ActionsTableProps> = ({ data, isLoading }) => {
    const router = useRouter();
    const { projectId } = useParams();
    const { mutate: deleteAction, isPending: isDeleting } = useDeleteAction();
    const [deleteConfirm, setDeleteConfirm] = useState<Action | null>(null);

    const handleActionClick = (action: Action) => {
        router.push(`/project/${projectId}/actions/${action.id}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, action: Action) => {
        e.stopPropagation();
        setDeleteConfirm(action);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteAction(deleteConfirm.id.toString(), {
                onSuccess: () => setDeleteConfirm(null),
            });
        }
    };

    const columns: DataColumn<Action>[] = [
        {
            header: 'Action Name',
            accessor: 'name',
            render: (item) => (
                <span className="font-mono text-sm font-bold text-primary">
                    {item.name}
                </span>
            )
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (item) => (
                <Text variant="sm" className="max-w-[200px] truncate text-slate-600">
                    {item.description}
                </Text>
            )
        },
        {
            header: 'Parameters',
            accessor: 'parameters',
            render: (item) => {
                const keys = Object.keys(item.parameters || {});
                if (keys.length === 0) {
                     return <span className="text-slate-400 text-xs italic">None</span>;
                }
                return (
                    <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                        {keys.map((key) => (
                            <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-primary/5 text-primary border border-primary/20">
                                {key}
                            </span>
                        ))}
                    </div>
                );
            }
        },
        {
            header: 'Actions',
            accessor: 'name',
            render: (item) => (
                <div className="flex items-center justify-end gap-3 pr-4">
                    <button 
                        onClick={() => handleActionClick(item)}
                        className="text-slate-400 hover:text-primary cursor-pointer transition-colors font-bold text-xs uppercase tracking-wider"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={(e) => handleDeleteClick(e, item)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                        title="Delete action"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No registry actions found for this project."
            />

            {/* Delete Confirmation Modal */}
            <InputConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Action"
                description={
                    <>
                        This action will be <strong>permanently deleted</strong> from the registry.
                        This cannot be undone and may affect any systems relying on this action.
                    </>
                }
                value={deleteConfirm?.name || ''}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                confirmText="Delete Action"
                confirmVariant="primary"
            />
        </>
    );
};
