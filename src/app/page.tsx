'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { domToPng } from 'modern-screenshot';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { getUserWeeklyWrapped } from '@/lib/lastfm';
import { WeeklyData } from "@/types/lastfm";
import { Footer } from "@/components/ui/footer";
import { NoiseBackground, GradientBlobs, Marquee } from "@/components/ui/background-elements";
import { Hero } from "@/components/home/Hero";
import { Preview } from "@/components/home/Preview";
import { ErrorToast } from "@/components/ui/error-toast";

const GENRES = ["ROCK", "INDIE", "POP", "JAZZ", "MPB", "HIP HOP", "SOUL", "METAL"];
const VIBES = ["WEEKLY", "WRAPPED", "CAPSULE", "MUSIC", "LAST.FM", "STATS", "SCROBBLE"];

export default function Home() {
    const [username, setUsername] = useState('');
    const [data, setData] = useState<WeeklyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) return;
        setLoading(true);
        setError(null);
        setData(null);
        setGeneratedImage(null);
        setShowModal(false);

        try {
            const result = await getUserWeeklyWrapped(username);
            setData(result);
        } catch (err) {
            console.error(err);
            setError('Usuário não encontrado.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setIsDownloading(true);

        try {
            await document.fonts.ready;

            await new Promise(resolve => setTimeout(resolve, 800));

            const dataUrl = await domToPng(cardRef.current, {
                scale: 2,
                quality: 0.95,
                backgroundColor: '#0a0a0a',
                filter: (node) => {
                    if (node instanceof HTMLElement) {
                        return !node.classList.contains('noise-bg');
                    }
                    return true;
                },
                features: {
                    removeControlCharacter: true,
                }
            });

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

            if (isMobile) {
                setGeneratedImage(dataUrl);
                setShowModal(true);
            } else {
                const link = document.createElement('a');
                link.download = `weekly-capsule-${username}.png`;
                link.href = dataUrl;
                link.click();
            }

        } catch (e) {
            console.error("Erro ao gerar imagem:", e);
            setError('Erro ao gerar imagem. Tente novamente.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white relative overflow-hidden selection:bg-red-500/30 flex flex-col">
            <NoiseBackground />
            <GradientBlobs />
            <div className="absolute top-20 w-[120%] -left-[10%] -rotate-3 z-0 mix-blend-overlay">
                <Marquee items={GENRES} speed={40} />
            </div>
            <div className="absolute bottom-20 w-[120%] -left-[10%] rotate-2 z-0 mix-blend-overlay">
                <Marquee items={VIBES} direction="right" speed={50} />
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10 grow flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12">
                <Hero
                    username={username}
                    setUsername={setUsername}
                    onSearch={handleSearch}
                    loading={loading}
                />

                <Preview
                    data={data}
                    isDownloading={isDownloading}
                    onDownload={handleDownload}
                    cardRef={cardRef}
                />
            </div>

            <Footer />
            <ErrorToast message={error} onClose={() => setError(null)} />

            {/* Modal Mobile */}
            <AnimatePresence>
                {showModal && generatedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="bg-neutral-900 p-4 rounded-2xl w-full max-w-sm flex flex-col gap-3 text-center border border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto scrollbar-hide"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-1 shrink-0">
                                <h3 className="text-lg font-bold text-white">Prontinho! 🎉</h3>
                                <p className="text-xs text-neutral-400 px-2">
                                    <span className="text-red-500 font-bold">Segure na imagem</span> para salvar no Fotos.
                                </p>
                            </div>
                            <div className="relative w-full h-auto min-h-75 max-h-[55vh] shrink-0 bg-neutral-950 rounded-lg overflow-hidden border border-white/5">
                                <Image
                                    src={generatedImage}
                                    alt="Seu resumo semanal"
                                    fill
                                    unoptimized
                                    className="object-contain"
                                />
                            </div>
                            <Button
                                onClick={() => setShowModal(false)}
                                variant="secondary"
                                className="w-full font-bold shrink-0"
                            >
                                Fechar
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}