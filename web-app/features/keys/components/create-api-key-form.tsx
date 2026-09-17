"use client";

import React, { useState } from 'react';
import Modal from '@/shared/components/modal';
import Button from '@/shared/components/Button';
import { Text } from '@/shared/components/Typography';
import { useCreateApiKey } from '../hooks';

interface CreateApiKeyFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateApiKeyForm: React.FC<CreateApiKeyFormProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [fullKey, setFullKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { mutate: createKey, isPending } = useCreateApiKey();

    const handleClose = () => {
        setName('');
        setExpiresAt('');
        setFullKey(null);
        setCopied(false);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        createKey(
            { name, expires_at: expiresAt || undefined },
            {
                onSuccess: (response: any) => {
                    const key = response?.data?.data?.full_key;
                    if (key) {
                        setFullKey(key);
                    } else {
                        handleClose();
                    }
                }
            }
        );
    };

    const handleCopy = async () => {
        if (fullKey) {
            await navigator.clipboard.writeText(fullKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (fullKey) {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title="API Key Created">
                <div className="px-6 pb-4 space-y-4">
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm mt-2">
                        <p className="font-semibold mb-1">Please copy this key now.</p>
                        <p>For security reasons, you will <strong>not be able to see it again</strong> after you close this window.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-4">
                        <label className="text-sm font-semibold text-slate-700">Your Full API Key</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={fullKey}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 px-4 py-2.5 text-sm outline-none font-mono"
                            />
                            <Button type="button" variant="primary" size="sm" onClick={handleCopy} className="shrink-0 h-10">
                                {copied ? 'Copied!' : 'Copy Key'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 border-t border-slate-100">
                    <Button type="button" variant="primary" size="sm" onClick={handleClose}>
                        I've copied it
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New API Key">
            <form onSubmit={handleSubmit}>
                <div className="px-6 pb-4 space-y-4">
                    <Text variant="sm">Give your key a descriptive name to identify it later.</Text>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="key-name">
                            Key Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="key-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Production App"
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-4 py-2.5 text-sm outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="expires-at">
                            Expires At <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <input
                            id="expires-at"
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value ? new Date(e.target.value).toISOString() : '')}
                            className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all px-4 py-2.5 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 border-t border-slate-100">
                    <Button type="button" variant="white" size="sm" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" disabled={isPending || !name.trim()}>
                        {isPending ? 'Creating...' : 'Create Key'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
