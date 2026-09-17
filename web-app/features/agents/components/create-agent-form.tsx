'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '@/shared/components/forms/FormInput';
import Button from '@/shared/components/Button';
import { useCreateAgent, useUpdateAgent } from '../hooks';
import { useFeatures } from '@/features/features/hooks';
import { Agent } from '../types';
import { useRouter } from 'next/navigation';
import { MultiSelectFeatures } from './multi-select-features';

const agentFormSchema = z.object({
    name: z.string().min(1, 'Agent name is required'),
    description: z.string().min(1, 'Description is required'),
    system_prompt: z.string(),
    features: z.array(z.number()),
});

type AgentFormData = z.infer<typeof agentFormSchema>;

interface CreateAgentFormProps {
    agent?: Agent;
}

export const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ agent }) => {
    const { mutateAsync: createAgent, isPending: isCreating } = useCreateAgent();
    const { mutateAsync: updateAgent, isPending: isUpdating } = useUpdateAgent(agent?.id?.toString() || '');
    const { data: featuresResponse, isLoading: isFeaturesLoading } = useFeatures();
    const router = useRouter();
    const isEditMode = !!agent;
    const isPending = isCreating || isUpdating;

    const features = featuresResponse?.data?.data || [];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AgentFormData>({
        resolver: zodResolver(agentFormSchema),
        defaultValues: {
            name: agent?.name || '',
            description: agent?.description || '',
            system_prompt: agent?.system_prompt || '',
            features: agent?.features || [],
        },
    });

    const selectedFeatures = watch('features');

    const onSubmit = (data: AgentFormData) => {
        const mutation = isEditMode
            ? updateAgent({
                name: data.name,
                description: data.description,
                system_prompt: data.system_prompt,
                features: data.features,
            })
            : createAgent({
                name: data.name,
                description: data.description,
                system_prompt: data.system_prompt,
                features: data.features,
            });
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
                            Agent Details
                        </span>
                    </div>
                    <div className="p-5 space-y-4">
                        <FormInput
                            label="Agent Name"
                            placeholder="e.g. Email Assistant"
                            register={register('name', {
                                required: 'Agent name is required',
                            })}
                            error={errors.name}
                            helperText="A descriptive name for this agent"
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
                                placeholder="Describe what this agent does..."
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

                        <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    System Prompt
                                </label>
                            </div>
                            <textarea
                                {...register('system_prompt')}
                                placeholder="Enter the system prompt for this agent..."
                                rows={4}
                                className="w-full rounded-lg border border-slate-200 bg-slate-100 py-2.5 px-4 text-sm text-gray-700 transition-all focus:bg-slate-200 focus:outline-none placeholder:text-slate-600 resize-none"
                            />
                        </div>

                        {isFeaturesLoading ? (
                            <div className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
                        ) : (
                            <MultiSelectFeatures
                                features={features}
                                selectedIds={selectedFeatures}
                                onChange={(ids) => setValue('features', ids, { shouldValidate: true })}
                                error={errors.features}
                            />
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                            Finalize Agent
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
                                : (isEditMode ? 'Update Agent' : 'Create Agent')
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
