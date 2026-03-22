"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, SignInCredentials, SignUpCredentials } from "@/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (credentials: SignInCredentials) => Promise<{ success: boolean; error?: string, project?: string }>;
    signUp: (data: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    switchProject: (projectId: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter()
    const checkAuth = async () => {
        try {
            const response = await fetch("/api/auth/session");
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const signIn = async (credentials: SignInCredentials) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.message || "Login failed" };
            }

            console.log("sign in User", result.user)

            setUser(result.user);
            return { success: true, project: result?.user?.project?.id };
        } catch (error) {
            console.error("SignIn failed:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    };

    const signUp = async (data: SignUpCredentials) => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return { success: false, error: result.message || "Registration failed" };
            }

            return { success: true };
        } catch (error) {
            console.error("SignUp failed:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    };

    const signOut = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/sign-in");
        } catch (error) {
            console.error("SignOut failed:", error);
        }
    };

    // signOut()

    const switchProject = async (projectId: string) => {
        try {
            const response = await fetch("/api/auth/switch-project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectId: projectId }),
            });

            const result = await response.json();

            console.log("switch project", result)

            if (!response.ok) {
                return { success: false, error: result.message || "Failed to switch project" };
            }

            // Update the user state directly with the new data (including updated project)
            setUser(result.user);
            return { success: true };
        } catch (error) {
            console.error("SwitchProject failed:", error);
            return { success: false, error: "An unexpected error occurred" };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isAuthenticated: !!user,
            isLoading,
            signIn,
            signUp,
            signOut,
            switchProject
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
