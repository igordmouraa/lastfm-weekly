'use client';

import { useRef, useState, ReactNode } from 'react';
import Image from 'next/image';
import { domToPng } from 'modern-screenshot';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function useExportPng() {
    const exportRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const exportPng = async (filename: string) => {
        if (!exportRef.current) return null;
        setIsExporting(true);
        try {
            await document.fonts.ready;
            await new Promise((r) => setTimeout(r, 800));
            const dataUrl = await domToPng(exportRef.current, {
                scale: 2,
                quality: 0.95,
                backgroundColor: '#0a0a0a',
                filter: (node) => !(node instanceof HTMLElement && node.classList.contains('noise-bg')),
            });

            const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
            if (isMobile) {
                setPreviewUrl(dataUrl);
            } else {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = filename;
                a.click();
            }
            return dataUrl;
        } finally {
            setIsExporting(false);
        }
    };

    return { exportRef, exportPng, isExporting, previewUrl, clearPreview: () => setPreviewUrl(null) };
}

interface ExportPreviewOverlayProps {
    previewUrl: string | null;
    onClose: () => void;
}

export function ExportPreviewOverlay({ previewUrl, onClose }: ExportPreviewOverlayProps) {
    const t = useTranslations('export');

    return (
        <AnimatePresence>
            {previewUrl && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
                    onClick={onClose}
                >
                    <div
                        className="bg-neutral-900 p-4 rounded-2xl max-w-sm w-full border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-sm text-neutral-400 mb-3 text-center">
                            <span className="text-red-500 font-bold">{t('holdToSave')}</span> {t('holdToSaveSuffix')}
                        </p>
                        <div className="relative w-full aspect-[9/16] bg-neutral-950 rounded-lg overflow-hidden">
                            <Image src={previewUrl} alt={t('previewAlt')} fill unoptimized className="object-contain" />
                        </div>
                        <Button onClick={onClose} variant="secondary" className="w-full mt-3">
                            {t('close')}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface ExportPanelProps {
    filename: string;
    children: ReactNode;
    label?: string;
}

export function ExportPanel({ filename, children, label }: ExportPanelProps) {
    const t = useTranslations('export');
    const { exportRef, exportPng, isExporting, previewUrl, clearPreview } = useExportPng();
    const buttonLabel = label ?? t('downloadPng');

    return (
        <>
            <div className="space-y-4">
                <div ref={exportRef}>{children}</div>
                <Button
                    onClick={() => exportPng(filename)}
                    disabled={isExporting}
                    className="w-full bg-red-600 hover:bg-red-700 font-bold"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? t('generating') : buttonLabel}
                </Button>
            </div>

            <ExportPreviewOverlay previewUrl={previewUrl} onClose={clearPreview} />
        </>
    );
}
