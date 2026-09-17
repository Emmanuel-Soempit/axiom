"use client"
import { ProjectDashboardLayout } from "@/shared/layouts/project-dashboard";
import { ReactNode } from "react";

export default function ProjectLayout({ children }: { children: ReactNode }) {
    return <ProjectDashboardLayout>{children}</ProjectDashboardLayout>;
}