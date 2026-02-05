'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorToastProps {
    message: string | null;
    onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-red-600 text-white shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] border border-red-500/50 backdrop-blur-md"
                >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-bold pr-2">{message}</span>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};