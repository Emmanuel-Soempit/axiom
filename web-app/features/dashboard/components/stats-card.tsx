import React from 'react';
import { Heading, Text } from '@/shared/components/Typography';

interface StatsCardProps {
    title: React.ReactNode;
    value: React.ReactNode;
    icon: string;
    trendLabel?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    variant?: 'primary' | 'secondary' | 'accent' | 'default';
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    trendLabel,
    trendType = 'neutral',
    variant = 'default',
    className = ''
}) => {

    // Style mappings for icon containers based on variant
    const variantStyles = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-blue-500/10 text-blue-500",
        accent: "bg-orange-500/10 text-orange-500",
        default: "bg-slate-500/10 text-slate-500",
    };

    // Trend text colors
    const trendStyles = {
        positive: "text-green-600",
        negative: "text-red-600",
        neutral: "text-slate-500"
    };

    return (
        <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {trendLabel && (
                    <Text as="span" variant="sm" className={`font-medium ${trendStyles[trendType]}`}>
                        {trendLabel}
                    </Text>
                )}
            </div>
            {typeof title === 'string' ? (
                <Text variant="sm" className="font-medium text-slate-500">
                    {title}
                </Text>
            ) : (
                title
            )}
            {typeof value === 'string' || typeof value === 'number' ? (
                <Heading as="h3" variant="card" className="mt-1">
                    {value}
                </Heading>
            ) : (
                <div className="mt-1">{value}</div>
            )}
        </div>
    );
};
