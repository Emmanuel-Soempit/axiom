'use client';

import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { Control, Controller } from 'react-hook-form';

interface FormSwitchProps {
    label?: string;
    name: string;
    control: Control<any>;
    className?: string;
}

const FormSwitch: React.FC<FormSwitchProps> = ({
    label,
    name,
    control,
    className = ""
}) => {
    return (
        <div className={`flex items-center gap-2 scale-90 ${className}`}>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Switch.Root
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-10 h-5 bg-slate-200 rounded-full relative focus:outline-none data-[state=checked]:bg-primary transition-colors cursor-pointer"
                    >
                        <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                    </Switch.Root>
                )}
            />
            {label && (
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap select-none">
                    {label}
                </span>
            )}
        </div>
    );
};

export default FormSwitch;
