'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Feature } from '@/features/features/types';

interface MultiSelectFeaturesProps {
    features: Feature[];
    selectedIds: number[];
    onChange: (selectedIds: number[]) => void;
    error?: { message?: string };
}

export const MultiSelectFeatures: React.FC<MultiSelectFeaturesProps> = ({
    features,
    selectedIds,
    onChange,
    error,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredFeatures = features.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const allFilteredSelected =
        filteredFeatures.length > 0 && filteredFeatures.every((f) => selectedIds.includes(Number(f.id)));

    const handleSelectAll = () => {
        const filteredIds = filteredFeatures.map((f) => Number(f.id));
        if (allFilteredSelected) {
            onChange(selectedIds.filter((id) => !filteredIds.includes(id)));
        } else {
            const newSelected = new Set([...selectedIds, ...filteredIds]);
            onChange(Array.from(newSelected));
        }
    };

    const handleToggle = (id: number) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((sid) => sid !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedFeatures = features.filter((f) => selectedIds.includes(Number(f.id)));
    const displayText =
        selectedFeatures.length === 0
            ? 'Select features...'
            : selectedFeatures.length === 1
                ? selectedFeatures[0].name
                : `${selectedFeatures.length} features selected`;

    return (
        <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                Associated Features
            </label>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full rounded-lg border bg-slate-100 py-2.5 px-4 text-sm text-gray-700 transition-all 
                    focus:bg-slate-200 focus:outline-none text-left
                    ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-slate-200 focus:border-primary/50'
                    }
                `}
            >
                <span className={selectedFeatures.length === 0 ? 'text-slate-400' : ''}>
                    {displayText}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-lg transition-transform">
                    {isOpen ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="z-50 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100 mt-1">
                    {/* Search */}
                    <div className="p-3 border-b border-slate-100">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for features..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-gray-700 focus:bg-slate-100 focus:outline-none focus:border-primary/50 placeholder:text-slate-400"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Select All */}
                    {filteredFeatures.length > 0 && (
                        <div
                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 border-b border-slate-100 transition-colors"
                            onClick={handleSelectAll}
                        >
                            <div
                                className={`
                                    w-4 h-4 rounded border flex items-center justify-center transition-colors
                                    ${allFilteredSelected
                                        ? 'bg-primary border-primary'
                                        : 'border-slate-300 bg-white'
                                    }
                                `}
                            >
                                {allFilteredSelected && (
                                    <span className="material-symbols-outlined text-white text-sm">check</span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-slate-700">Select All</span>
                        </div>
                    )}

                    {/* Feature List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredFeatures.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-slate-400">
                                No features found
                            </div>
                        ) : (
                            filteredFeatures.map((feature) => {
                                const isSelected = selectedIds.includes(Number(feature.id));
                                return (
                                    <div
                                        key={feature.id}
                                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => handleToggle(Number(feature.id))}
                                    >
                                        <div
                                            className={`
                                                w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0
                                                ${isSelected
                                                    ? 'bg-primary border-primary'
                                                    : 'border-slate-300 bg-white'
                                                }
                                            `}
                                        >
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{feature.name}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {error && (
                <span className="ml-1 text-[11px] font-medium text-red-400">
                    {error.message}
                </span>
            )}
        </div>
    );
};
