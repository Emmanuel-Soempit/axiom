import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    register?: UseFormRegisterReturn;
    error?: FieldError;
    leftIcon?: string;
    rightIcon?: string;
    helperText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    register,
    error,
    leftIcon,
    rightIcon,
    helperText,
    className = "",
    id,
    ...props
}) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substring(7));

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <div className="flex items-center justify-between ml-1">
                    <label
                        htmlFor={inputId}
                        className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                        {label}
                    </label>
                    {helperText && (
                        <span className="text-xs font-medium text-primary hover:underline cursor-pointer">
                            {helperText}
                        </span>
                    )}
                </div>
            )}
            <div className="relative">
                {leftIcon && (
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg select-none">
                        {leftIcon}
                    </span>
                )}
                <input
                    id={inputId}
                    {...register}
                    {...props}
                    className={`
                        w-full rounded-lg border bg-slate-100 py-2.5 text-sm text-gray-700 transition-all 
                        focus:bg-slate-200 focus:outline-none placeholder:text-slate-600
                        ${leftIcon ? 'pl-10' : 'pl-4'} 
                        ${rightIcon ? 'pr-10' : 'pr-4'}
                        ${error
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-slate-200 focus:border-primary/50'
                        }
                        ${className}
                    `}
                />
                {rightIcon && (
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg select-none">
                        {rightIcon}
                    </span>
                )}
            </div>
            {error && (
                <span className="ml-1 text-[11px] font-medium text-red-400">
                    {error.message}
                </span>
            )}
        </div>
    );
};

export default FormInput;
