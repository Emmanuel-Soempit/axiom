"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/Button';
import FormInput from '@/shared/components/forms/FormInput';
import { useAuth } from '@/providers/auth';
import toast from 'react-hot-toast';

interface SignInFormData {
    email: string;
    password: string;
    remember: boolean;
}

export const SignInForm: React.FC = () => {
    const router = useRouter();
    const { signIn } = useAuth();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SignInFormData>({
        defaultValues: {
            email: "",
            password: "",
            remember: false
        }
    });

    const onSubmit = async (data: SignInFormData) => {
        const result = await signIn(data);

        if (!result.success && result.error) {
            setError("root", { message: result.error });
            return;
        }

        if (result.success) {
            if (result.project) {
                router.push(`/project/${result.project}`);
            } else {
                router.push("/project/")
            }
            toast.success("Signed in successfully");
            // router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {errors.root && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.root.message}
                    </div>
                </div>
            )}
            <FormInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                leftIcon="mail"
                register={register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                })}
                error={errors.email}
            />

            <FormInput
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon="key"
                helperText="Forgot password?"
                register={register("password", {
                    required: "Password is required",
                    minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                    }
                })}
                error={errors.password}
            />

            <div className="flex items-center gap-2 py-1">
                <input
                    type="checkbox"
                    id="remember"
                    {...register("remember")}
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary accent-primary"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 hover:text-slate-300 cursor-pointer">
                    Remember me for 30 days
                </label>
            </div>

            <Button
                type="submit"
                variant="primary"
                className="mt-2 w-full py-3 font-semibold shadow-lg shadow-primary/25"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
        </form>
    );
};

