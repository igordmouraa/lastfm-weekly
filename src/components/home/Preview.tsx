'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Loader2 } from 'lucide-react';
import { WeeklyStories } from "@/components/wrapped/WeeklyStories";
import { WeeklyData } from "@/types/lastfm";
import { RefObject } from 'react';

interface PreviewProps {
    data: WeeklyData | null;
    isDownloading: boolean;
    onDownload: () => void;
    cardRef: RefObject<HTMLDivElement | null>;
}

export const Preview = ({ data, isDownloading, onDownload, cardRef }: PreviewProps) => {
    return (
        <div className="flex-1 w-full flex flex-col items-center lg:items-end justify-center perspective-1000 min-h-[600px]">
            <AnimatePresence mode="wait">
                {!data ? (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="relative w-[300px] h-[533px] bg-neutral-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-neutral-700 gap-4 rotate-3 lg:rotate-6 shadow-2xl backdrop-blur-sm"
                    >
                        <Sparkles className="w-12 h-12 opacity-20" />
                        <p className="font-mono text-sm uppercase tracking-widest text-center px-4">
                            Digite seu usuário<br/>para começar
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="flex flex-col gap-6 items-center lg:items-end"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition duration-500"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                                <WeeklyStories ref={cardRef} data={data} />
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                size="lg"
                                onClick={onDownload}
                                disabled={isDownloading}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-10 h-14 shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_-10px_rgba(220,38,38,0.7)] transition-all transform hover:-translate-y-1 gap-2 text-lg"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Gerando...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        Baixar Stories
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};