'use client';

import { useState, useRef, FormEvent } from 'react';
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

  const handleSearch = async (e: FormEvent) => {
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
        await new Promise(resolve => setTimeout(resolve, 500));

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
          }
        });

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

        if (isIOS) {
          setGeneratedImage(dataUrl);
          try {
            download(dataUrl, `weekly-capsule-${username}.png`);
          } catch {
            // Ignore
          }
        } else {
          download(dataUrl, `weekly-capsule-${username}.png`);
        }

      } catch (err) {
        console.error("Erro no download", err);
        setError('Erro ao gerar imagem. Se estiver no iPhone, tente tirar print.');
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
                  className="fixed inset-0 z-100 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
                  onClick={() => setGeneratedImage(null)}
              >
                <div
                    className="bg-neutral-900 p-4 rounded-2xl max-w-sm w-full flex flex-col gap-4 text-center border border-white/10 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Imagem Pronta! 🎉</h3>
                    <p className="text-sm text-neutral-400">
                      Se o download não iniciou, <span className="text-red-500 font-bold">segure na imagem</span> e escolha &quot;Salvar no Fotos&quot;.
                    </p>
                  </div>

                  <div className="relative w-full aspect-9/16">
                    <Image
                        src={generatedImage}
                        alt="Seu resumo semanal"
                        fill
                        unoptimized
                        className="rounded-xl shadow-lg border border-white/5 object-contain select-none pointer-events-auto"
                    />
                  </div>

                  <Button
                      onClick={() => setGeneratedImage(null)}
                      variant="secondary"
                      className="w-full font-bold"
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