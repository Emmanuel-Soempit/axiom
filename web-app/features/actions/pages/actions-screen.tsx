'use client';
import React from 'react';
import { ActionsHeader, ActionsTable } from '../components';
import { useActions } from '../hooks';

export const ActionsScreen: React.FC = () => {
    const { data: response, isLoading } = useActions();
    const actions = response?.data?.data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <ActionsHeader />
            <ActionsTable data={actions} isLoading={isLoading} />
        </div>
    );
};
