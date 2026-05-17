'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CreateActionScreen } from '@/features/actions/pages';

export default function CreateFeatureActionPage() {
    const { featureId } = useParams();
    return (
        <React.Fragment>
            <CreateActionScreen featureId={featureId as string} />
        </React.Fragment>
    );
}
