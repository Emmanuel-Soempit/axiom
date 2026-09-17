import React, { useState } from 'react';
import Modal from '../modal';
import Button from '../Button';
import FormInput from '../forms/FormInput';

interface InputConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: React.ReactNode;
    value: string;
    onConfirm: () => void;
    isLoading?: boolean;
    confirmText?: string;
    confirmVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
}

export const InputConfirmationModal: React.FC<InputConfirmationModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    value,
    onConfirm,
    isLoading = false,
    confirmText = 'Confirm',
    confirmVariant = 'primary'
}) => {
    const [inputValue, setInputValue] = useState('');
    const isMatched = inputValue === value;

    const handleConfirm = () => {
        if (isMatched) {
            onConfirm();
            setInputValue(''); // Reset on successful confirm init
        }
    };

    const handleClose = () => {
        setInputValue('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={title}>
            <div className="p-6">
                <div className="mb-4 text-sm text-slate-600">
                    {description}
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6 font-mono text-center select-all text-slate-800">
                    {value}
                </div>

                <div className="space-y-2 mb-6 text-center">
                    <label className="text-sm font-medium text-slate-700 block mb-4">
                        To {title.toLowerCase().includes('delete') ? 'delete' : 'revoke'} type in the API KEY name <strong>{value}</strong>
                    </label>
                    <div className="text-left">
                        <FormInput
                            label="API Key Name"
                            value={inputValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                            placeholder={value}
                            className="font-mono mt-1 w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={handleConfirm}
                        disabled={!isMatched || isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
