'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError(null);
    setData(null);
    setGeneratedImage(null);

    try {
      const result = await getUserWeeklyWrapped(username);
      setData(result);
    } catch (err) {
      console.error(err);
      setError('Usuário não encontrado ou sem dados recentes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      setIsDownloading(true);
      setError(null);

      try {
        await document.fonts.ready;

        const images = Array.from(cardRef.current.getElementsByTagName('img'));
        const imagePromises = images.map(img => {
          if (img.complete && img.src.startsWith('data:')) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3000);
          });
        });
        await Promise.all(imagePromises);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: window.devicePixelRatio > 2 ? 2 : 3,
          quality: 0.95,
          filter: (node) => {
            const el = node as HTMLElement;
            return !(el.classList && el.classList.contains('noise-bg'));
          },
          style: {
            transform: 'scale(1)',
            backgroundColor: '#0a0a0a',
            fontFamily: 'var(--font-geist-sans), sans-serif',
          }
        });

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

        if (isIOS) {
          setGeneratedImage(dataUrl);
        } else {
          download(dataUrl, `weekly-capsule-${username}.png`);
        }

      } catch (err) {
        console.error("Erro no download", err);
        setError('Erro ao gerar imagem. Tente novamente.');
      } finally {
        setIsDownloading(false);
      }
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

        <AnimatePresence>
          {generatedImage && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-100 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
                  onClick={() => setGeneratedImage(null)}
              >
                {/* Container com scroll */}
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

                  {/* Wrapper da imagem */}
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
                      onClick={() => setGeneratedImage(null)}
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