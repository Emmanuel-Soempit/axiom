import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'white' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    href?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    href,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        outline: "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20",
        ghost: "bg-transparent text-slate-400 hover:text-primary hover:bg-white/5",
        white: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base"
    };

    const variantStyle = variants[variant] || variants.primary;
    const sizeStyle = sizes[size] || sizes.md;

    const combinedClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClassName} {...(props as any)}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
