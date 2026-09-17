'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { Control, Controller, FieldError } from 'react-hook-form';

interface FormSelectProps {
    label?: string;
    name: string;
    control: Control<any>;
    options: { label: string; value: string }[];
    error?: FieldError;
    placeholder?: string;
    className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
    label,
    name,
    control,
    options,
    error,
    placeholder = "Select an option...",
    className = ""
}) => {
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                    {label}
                </label>
            )}
            
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select.Root
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <Select.Trigger
                            className={`
                                flex items-center justify-between w-full rounded-lg border bg-slate-100 py-2.5 px-4 text-sm text-gray-700 transition-all 
                                focus:bg-slate-200 focus:outline-none 
                                ${error
                                    ? 'border-red-500/50 focus:border-red-500'
                                    : 'border-slate-200 focus:border-primary/50'
                                }
                            `}
                        >
                            <Select.Value placeholder={placeholder} />
                            <Select.Icon>
                                <span className="material-symbols-outlined text-slate-400 text-lg">unfold_more</span>
                            </Select.Icon>
                        </Select.Trigger>

                        <Select.Portal>
                            <Select.Content
                                className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-100"
                                position="popper"
                                sideOffset={5}
                            >
                                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-slate-500 cursor-default">
                                    <span className="material-symbols-outlined">expand_less</span>
                                </Select.ScrollUpButton>
                                
                                <Select.Viewport className="p-1">
                                    {options.map((option) => (
                                        <Select.Item
                                            key={option.value}
                                            value={option.value}
                                            className="relative flex items-center px-8 py-2.5 text-sm text-slate-700 font-medium rounded-lg cursor-pointer outline-none hover:bg-slate-50 focus:bg-primary/5 focus:text-primary transition-colors data-[disabled]:opacity-50 data-[disabled]:pointer-events-none select-none"
                                        >
                                            <Select.ItemText>{option.label}</Select.ItemText>
                                            <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-xl">check</span>
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>

                                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-slate-500 cursor-default">
                                    <span className="material-symbols-outlined">expand_more</span>
                                </Select.ScrollDownButton>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                )}
            />
            
            {error && (
                <span className="ml-1 text-[11px] font-medium text-red-400">
                    {error.message}
                </span>
            )}
        </div>
    );
};

export default FormSelect;
