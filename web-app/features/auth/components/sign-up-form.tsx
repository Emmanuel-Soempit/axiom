"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/Button';
import FormInput from '@/shared/components/forms/FormInput';
import { useAuth } from '@/providers/auth';

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const SignUpForm: React.FC = () => {
    const router = useRouter();
    const { signUp } = useAuth();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SignUpFormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const password = watch("password");

    const onSubmit = async (data: SignUpFormData) => {
        const result = await signUp(data);

        if (!result.success && result.error) {
            setError("root", { message: result.error });
            return;
        }

        if (result.success) {
            router.push("/sign-in");
            router.refresh();
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
            <div className="flex flex-col md:flex-row gap-4">
                <FormInput
                    label="First Name"
                    type="text"
                    placeholder="John"
                    leftIcon="person"
                    register={register("firstName", {
                        required: "First name is required"
                    })}
                    error={errors.firstName}
                />
                <FormInput
                    label="Last Name"
                    type="text"
                    placeholder="Doe"
                    register={register("lastName", {
                        required: "Last name is required"
                    })}
                    error={errors.lastName}
                />
            </div>

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
                register={register("password", {
                    required: "Password is required",
                    minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                    }
                })}
                error={errors.password}
            />

            <FormInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                leftIcon="lock_reset"
                register={register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match"
                })}
                error={errors.confirmPassword}
            />

            <div className="flex items-center gap-2 py-1">
                <input
                    type="checkbox"
                    id="terms"
                    required
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary accent-primary"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 hover:text-slate-300 cursor-pointer">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
            </div>

            <Button
                type="submit"
                variant="primary"
                className="mt-2 w-full py-3 font-semibold shadow-lg shadow-primary/25"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
        </form>
    );
};
