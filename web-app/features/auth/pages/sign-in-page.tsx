"use client";

import Card from '@/shared/components/Card';
import { Heading, Text } from '@/shared/components/Typography';
import { SignInForm } from '../components';

export const SignInPage: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="relative w-full max-w-md">
                {/* Background Decor */}
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl animate-pulse delay-700"></div>

                <Card className="relative z-10 overflow-hidden border-primary/10 bg-slate-50">
                    <div className="flex flex-col gap-6 p-8">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-2xl">lock_open</span>
                            </div>
                            <Heading variant="card" as="h2" className="text-2xl font-bold tracking-tight">
                                Welcome Back
                            </Heading>
                            <Text variant="md">
                                Enter your credentials to access your dashboard
                            </Text>
                        </div>

                        <SignInForm />

                        <div className="relative flex items-center gap-2 py-2">
                            <div className="h-px flex-1 bg-white/5"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">OR CONTINUE WITH</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/50 cursor-pointer py-2 text-xs font-medium text-white transition-colors hover:bg-white/[0.05]">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-4 w-4" alt="Google" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/50 cursor-pointer py-2 text-xs font-medium text-white transition-colors hover:bg-white/[0.05]">
                                <img src="https://www.svgrepo.com/show/448225/github.svg" className="h-4 w-4 invert brightness-200" alt="GitHub" />
                                GitHub
                            </button>
                        </div>

                        <p className="mt-2 text-center text-xs text-slate-500">
                            Don't have an account?{' '}
                            <a href="/sign-up" className="font-semibold hover:text-primary transition-colors">
                                Create an account
                            </a>
                        </p>
                    </div>
                </Card>
            </div >
        </div >
    );
};

