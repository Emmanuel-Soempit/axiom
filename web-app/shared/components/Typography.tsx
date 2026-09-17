import React from 'react';

interface TypographyProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export const Heading: React.FC<TypographyProps & { variant?: 'hero' | 'section' | 'card' }> = ({
    children,
    className = '',
    as = 'h2',
    variant = 'section'
}) => {
    const variants = {
        hero: "text-5xl font-black leading-[1.1] tracking-tight lg:text-7xl text-black",
        section: "text-3xl font-black tracking-tight lg:text-4xl text-black",
        card: "text-xl font-bold text-black"
    };

    const Component = as as any;
    const variantStyle = variants[variant] || variants.section;

    return (
        <Component className={`${variantStyle} ${className}`}>
            {children}
        </Component>
    );
};

export const Text: React.FC<TypographyProps & { variant?: 'lg' | 'md' | 'sm' | 'xs' }> = ({
    children,
    className = '',
    as = 'p',
    variant = 'md'
}) => {
    const variants = {
        lg: "text-lg leading-relaxed text-gray-700",
        md: "text-base text-gray-600",
        sm: "text-sm text-gray-400",
        xs: "text-xs font-bold uppercase tracking-wider text-gray-700"
    };

    const Component = as as any;
    const variantStyle = variants[variant] || variants.md;

    return (
        <Component className={`${variantStyle} ${className}`}>
            {children}
        </Component>
    );
};
