"use client";

import ReactModal from 'react-modal';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

// Bind modal to your appElement for accessibility (typically the root div id)
// Since Next.js uses standard body, we can bind to body or let standard app elements apply
if (typeof window !== "undefined") {
    ReactModal.setAppElement("body");
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            overlayClassName="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            {/* Content */}
            <div>{children}</div>
        </ReactModal>
    );
};

export default Modal;
