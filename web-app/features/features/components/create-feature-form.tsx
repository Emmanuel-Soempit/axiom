'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '@/shared/components/forms/FormInput';
import Button from '@/shared/components/Button';
import { useCreateFeature, useUpdateFeature } from '../hooks';
import { Feature } from '../types';
import { useRouter } from 'next/navigation';

interface FeatureFormData {
    name: string;
    description: string;
}

const featureFormSchema = z.object({
    name: z.string().min(1, 'Feature name is required'),
    description: z.string().min(1, 'Description is required'),
});

interface CreateFeatureFormProps {
    feature?: Feature;
}

export const CreateFeatureForm: React.FC<CreateFeatureFormProps> = ({ feature }) => {
    const { mutateAsync: createFeature, isPending: isCreating } = useCreateFeature();
    const { mutateAsync: updateFeature, isPending: isUpdating } = useUpdateFeature(feature?.id?.toString() || '');
    const router = useRouter();
    const isEditMode = !!feature;
    const isPending = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FeatureFormData>({
        resolver: zodResolver(featureFormSchema),
        defaultValues: {
            name: feature?.name || '',
            description: feature?.description || '',
        },
    });

    const onSubmit = (data: FeatureFormData) => {
        const mutation = isEditMode ? updateFeature(data) : createFeature(data);
        mutation.then(() => {
            router.back();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-2xl space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-200 bg-slate-50">
                        <span className="font-bold text-sm uppercase tracking-wider text-slate-700">
                            Feature Details
                        </span>
                    </div>
                    <div className="p-5 space-y-4">
                        <FormInput
                            label="Feature Name"
                            placeholder="e.g. Task Management"
                            register={register('name', {
                                required: 'Feature name is required',
                            })}
                            error={errors.name}
                            helperText="Used to group related actions"
                        />

                        <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Description
                                </label>
                            </div>
                            <textarea
                                {...register('description', {
                                    required: 'Description is required',
                                })}
                                placeholder="Describe what this feature encompasses..."
                                rows={3}
                                className={`
                                    w-full rounded-lg border bg-slate-100 py-2.5 px-4 text-sm text-gray-700 transition-all
                                    focus:bg-slate-200 focus:outline-none placeholder:text-slate-600 resize-none
                                    ${errors.description
                                        ? 'border-red-500/50 focus:border-red-500'
                                        : 'border-slate-200 focus:border-primary/50'
                                    }
                                `}
                            />
                            {errors.description && (
                                <span className="ml-1 text-[11px] font-medium text-red-400">
                                    {errors.description.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                            Finalize Feature
                        </h3>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={isPending}
                        >
                            <span className="material-symbols-outlined text-lg mr-2">
                                {isEditMode ? 'save' : 'rocket_launch'}
                            </span>
                            {isPending
                                ? (isEditMode ? 'Updating...' : 'Creating...')
                                : (isEditMode ? 'Update Feature' : 'Create Feature')
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
