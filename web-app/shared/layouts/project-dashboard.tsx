import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import { useProjects } from '@/features/project/hooks';
import toast from 'react-hot-toast';
import { comingSoonToast } from '@/utils/methods';

export function ProjectDashboardLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const projectIdFromUrl = params.projectId as string;
    const { user } = useAuth();
    const [activeProject, setActiveProject] = useState<any>(user?.project);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (user?.project?.id === projectIdFromUrl) {
            setActiveProject(user?.project);
        } else {
            setActiveProject(undefined);
        }
    }, [user, projectIdFromUrl]);

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50 text-slate-900">
            <Navbar
                projectId={projectIdFromUrl}
                activeProject={activeProject}
                isCollapsed={isCollapsed}
                onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />
            <div className="flex h-full overflow-hidden">
                <Sidebar
                    projectId={projectIdFromUrl}
                    activeProject={activeProject}
                    isCollapsed={isCollapsed}
                />
                <main className="flex-1 overflow-y-auto p-8 bg-[#f1f5f9]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}


function ProjectSwitcher({ activeProject }: { activeProject: any }) {
    const { switchProject, user } = useAuth();
    const { data: projectsResponse, isLoading } = useProjects();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();


    const projects = projectsResponse?.data?.data || [];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSwitch = async (projectId: string) => {
        if (projectId === user?.project?.id) {
            setIsOpen(false);
            router.replace(`/project/${projectId}`);
            return;
        }

        const toastId = toast.loading('Switching project...');
        try {
            const result = await switchProject(projectId);
            if (result.success) {
                toast.success('Switched successfully', { id: toastId });
                setIsOpen(false);
                router.replace(`/project/${projectId}`);
            } else {
                toast.error(result.error || 'Failed to switch project', { id: toastId });
            }
        } catch (error) {
            toast.error('An unexpected error occurred', { id: toastId });
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 transition-colors bg-white shadow-sm"
            >
                <div className="size-5 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                    {activeProject ? activeProject?.name?.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project</span>
                    <span className="text-sm font-semibold text-slate-700">{activeProject ? activeProject?.name : 'Not Found'}</span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-lg">unfold_more</span>
            </button>

            {isOpen && (
                <div className="absolute top-full z-20 left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Your Projects</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-400 text-sm">Loading projects...</div>
                        ) : projects.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-sm">No projects found</div>
                        ) : (
                            projects.map((project: any) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleSwitch(project.id)}
                                    className={`w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-lg transition-colors text-left group ${project.id === activeProject?.id
                                        ? 'bg-primary/5 text-primary'
                                        : 'hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${project.id === activeProject?.id
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                        }`}>
                                        {project.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-sm font-semibold truncate">{project.name}</div>
                                        <div className="text-[10px] text-slate-400 truncate">ID: {project.id.slice(0, 8)}...</div>
                                    </div>
                                    {project.id === activeProject?.id && (
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    <div className="p-1 border-t border-slate-100 bg-slate-50/50">
                        <Link
                            href="/project"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-600 group"
                        >
                            <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">add</span>
                            </div>
                            <span className="text-sm font-semibold">Create New Project</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}


function Navbar({
    projectId,
    activeProject,
    isCollapsed,
    onToggleSidebar
}: {
    projectId: string;
    activeProject: any;
    isCollapsed: boolean;
    onToggleSidebar: () => void;
}) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 shrink-0 z-20 bg-white">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span className="material-symbols-outlined">
                        {isCollapsed ? 'menu_open' : 'menu'}
                    </span>
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                {/* Project Switcher */}
                <ProjectSwitcher activeProject={activeProject} />
            </div>
            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="relative w-full max-w-md hidden md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input
                        className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400"
                        placeholder="Search logs, actions, or projects..."
                        type="text"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-1"></div>
                    <div className="flex items-center gap-3 pl-1">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/40">
                            <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Sidebar({
    projectId,
    activeProject,
    isCollapsed
}: {
    projectId: string;
    activeProject: any;
    isCollapsed: boolean
}) {
    const basePath = `/project/${projectId}`;
    const { signOut } = useAuth();
    const pathname = usePathname();
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} relative border-r border-slate-200 bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out`}>
            {/* Disabled Overlay */}
            {!activeProject && (
                <div className="absolute inset-0 z-10 bg-slate-50/50 blur-sm cursor-not-allowed flex items-center justify-center">
                </div>
            )}

            <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-slate-200`}>
                <Link href={`${basePath}/dashboard`}>
                    <img
                        src={`/${isCollapsed ? 'axiom-icon.svg' : 'axiom-logo.svg'}`}
                        alt="EAC"
                        className={`${isCollapsed ? 'h-8 w-8 object-contain' : 'h-10'} transition-all`}
                    />
                </Link>
            </div>
            <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
                <SidebarLink href={`${basePath}`} icon="home" label="Home" active={pathname === basePath || pathname === `${basePath}/dashboard`} isCollapsed={isCollapsed} />
                <SidebarLink href={`${basePath}/audits`} icon="analytics" label="Audits" active={pathname.includes("/audits")} isCollapsed={isCollapsed} />
                {/* <SidebarLink href={`${basePath}/actions`} icon="auto_fix" label="Actions" active={pathname.includes("/actions")} isCollapsed={isCollapsed} /> */}
                <SidebarLink href={`${basePath}/features`} icon="folder_managed" label="Features" active={pathname.includes("/features")} isCollapsed={isCollapsed} />
                <SidebarLink href={`${basePath}/agents`} icon="smart_toy" label="Agents" active={pathname.includes("/agents")} isCollapsed={isCollapsed} />
                {/* <SidebarLink onClick={() => {
                   comingSoonToast("Marketplace")
                }} href={`#`} icon="storefront" label="Marketplace" active={pathname.includes("/marketplace")} isCollapsed={isCollapsed} /> */}
                <div className="my-4 border-t border-slate-100"></div>
                <SidebarLink href={`${basePath}/keys`} icon="key" label="API Keys" active={pathname.includes("/keys")} isCollapsed={isCollapsed} />
                <SidebarLink onClick={() => {
                   comingSoonToast("Settings")
                }} href={`#s`} icon="settings" label="Settings" active={pathname.includes("/settings")} isCollapsed={isCollapsed} />
                <SidebarLink icon="logout" label="Logout" isCollapsed={isCollapsed} onClick={() => {
                    signOut();
                }} />
            </nav>
            <div className={`p-4 border-t border-slate-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
                <Link
                    href="/project"
                    className={`flex items-center justify-center gap-2 bg-primary rounded-lg text-white font-bold transition-all hover:opacity-90 ${isCollapsed ? 'size-10' : 'w-full py-2.5 px-4 text-sm'}`}
                    title={isCollapsed ? "New Project" : ""}
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    {!isCollapsed && <span>New Project</span>}
                </Link>
                {/* {!isCollapsed && (
                    <div className="mt-4 flex flex-col gap-1">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage</span>
                            <span className="text-[10px] font-bold text-slate-400">82%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[82%]"></div>
                        </div>
                    </div>
                )} */}
            </div>
        </aside>
    );
}

function SidebarLink({
    href,
    icon,
    label,
    active = false,
    isCollapsed,
    onClick
}: {
    href?: string;
    icon: string;
    label: string;
    active?: boolean;
    isCollapsed: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            onClick={() => {
                onClick?.();
            }}
            href={href || '#'}
            title={isCollapsed ? label : ""}
            className={`flex items-center rounded-lg transition-colors ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} ${active
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            {!isCollapsed && <span className="text-sm">{label}</span>}
        </Link>
    );
}