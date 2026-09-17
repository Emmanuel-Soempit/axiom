import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
    const baseStyles = "rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300";
    const hoverStyles = hoverable ? "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5" : "";

    return (
        <div className={`${baseStyles} ${hoverStyles} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
