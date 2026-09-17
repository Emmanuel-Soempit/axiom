"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DataTable, DataColumn } from '@/shared/components/data-table';
import { Feature } from '../types';
import { Text } from '@/shared/components/Typography';
import { InputConfirmationModal } from '@/shared/components/modals/input-confirmation';
import { useDeleteFeature } from '../hooks';

interface FeaturesTableProps {
    data: Feature[];
    isLoading?: boolean;
}

export const FeaturesTable: React.FC<FeaturesTableProps> = ({ data, isLoading }) => {
    const router = useRouter();
    const { projectId } = useParams();
    const { mutate: deleteFeature, isPending: isDeleting } = useDeleteFeature();
    const [deleteConfirm, setDeleteConfirm] = useState<Feature | null>(null);

    const handleViewClick = (feature: Feature) => {
        router.push(`/project/${projectId}/features/${feature.id}`);
    };

    const handleEditClick = (feature: Feature) => {
        router.push(`/project/${projectId}/features/${feature.id}/edit`);
    };

    const handleDeleteClick = (e: React.MouseEvent, feature: Feature) => {
        e.stopPropagation();
        setDeleteConfirm(feature);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteFeature(deleteConfirm.id.toString(), {
                onSuccess: () => setDeleteConfirm(null),
            });
        }
    };

    const columns: DataColumn<Feature>[] = [
        {
            header: 'Feature Name',
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
                <Text variant="sm" className="max-w-[300px] truncate text-slate-600">
                    {item.description}
                </Text>
            )
        },
        {
            header: 'Actions',
            accessor: 'name',
            render: (item) => (
                <div className="flex items-center justify-end gap-3 pr-4">
                    <button
                        onClick={() => handleViewClick(item)}
                        className="text-slate-400 hover:text-primary cursor-pointer transition-colors font-bold text-xs uppercase tracking-wider"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleEditClick(item)}
                        className="text-slate-400 hover:text-primary cursor-pointer transition-colors font-bold text-xs uppercase tracking-wider"
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => handleDeleteClick(e, item)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                        title="Delete feature"
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
                emptyMessage="No features found for this project."
            />

            <InputConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Feature"
                description={
                    <>
                        This feature will be <strong>permanently deleted</strong>.
                        This cannot be undone and may affect any actions linked to this feature.
                    </>
                }
                value={deleteConfirm?.name || ''}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                confirmText="Delete Feature"
                confirmVariant="primary"
            />
        </>
    );
};
