"use client";

import React from 'react';
import { CreationNavbar, CreateProjectForm } from '../components';
import { useCreateProject } from '../hooks';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import toast from 'react-hot-toast';

export const CreateProjectPage: React.FC = () => {
    const { mutateAsync: createProject, isPending } = useCreateProject();
    const router = useRouter();
    const { switchProject } = useAuth();

    const handleCreateProject = async (data: { name: string }) => {
        const toastId = toast.loading('Creating your project...');
        try {
            const response = await createProject(data);
            const project = response.data.data;

            if (project) {
                toast.loading('Switching to new project...', { id: toastId });
                await switchProject(project.id);
                toast.success('Project created and switched successfully!', { id: toastId });
                router.replace(`/project/${project.id}`);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to create project', { id: toastId });
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
            <CreationNavbar />

            <main className="flex-1 flex items-center justify-center p-6">
                <CreateProjectForm onSubmit={handleCreateProject} isSubmitting={isPending} />
            </main>

            {/* Footer Help */}
            <footer className="py-6 flex justify-center items-center gap-6">
                <a className="text-xs font-medium text-slate-400 hover:text-primary transition-colors flex items-center gap-1" href="#">
                    <span className="material-symbols-outlined text-base">help</span>
                    Documentation
                </a>
                <a className="text-xs font-medium text-slate-400 hover:text-primary transition-colors flex items-center gap-1" href="#">
                    <span className="material-symbols-outlined text-base">terminal</span>
                    API Support
                </a>
            </footer>
        </div>
    );
};
