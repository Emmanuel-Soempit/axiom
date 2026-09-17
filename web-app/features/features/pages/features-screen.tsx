'use client';
import React from 'react';
import { FeaturesHeader, FeaturesTable } from '../components';
import { useFeatures } from '../hooks';

export const FeaturesScreen: React.FC = () => {
    const { data: response, isLoading } = useFeatures();
    const features = response?.data?.data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <FeaturesHeader />
            <FeaturesTable data={features} isLoading={isLoading} />
        </div>
    );
};
