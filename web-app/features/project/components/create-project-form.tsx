"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import FormInput from '@/shared/components/forms/FormInput';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';

interface CreateProjectFormData {
    name: string;
}

interface CreateProjectFormProps {
    onSubmit: (data: CreateProjectFormData) => Promise<void>;
    isSubmitting: boolean;
}

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSubmit, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateProjectFormData>();

    const onFormSubmit = async (data: CreateProjectFormData) => {
        await onSubmit(data);
    };

    return (
        <div className="w-full max-w-[520px]">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Modal Header */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">add_box</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Project</h1>
                                <p className="text-slate-500 text-sm">Spin up a new development environment instantly.</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="px-8 py-4 space-y-6">
                        <FormInput
                            label="Project Name"
                            id="project-name"
                            placeholder="e.g. Test Project"
                            register={register("name", {
                                required: "Project name is required",
                                minLength: { value: 3, message: "Project name must be at least 3 characters" }
                            })}
                            error={errors.name}
                        />

                        {/* Advanced Options Placeholder */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                            <div className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-sm">settings</span>
                                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Advanced Settings</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="primary"
                            className="w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            <span>{isSubmitting ? 'Creating...' : 'Create Project'}</span>
                            <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        </Button>
                        <Button
                            href="/dashboard"
                            variant="ghost"
                            className="w-full text-sm"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
