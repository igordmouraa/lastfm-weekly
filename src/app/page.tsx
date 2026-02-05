'use client';

import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
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
  const [error, setError] = useState<string | null>(null); // <--- 2. Novo State de Erro

  const cardRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError(null);
    setData(null);

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
        await new Promise(resolve => setTimeout(resolve, 100));
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 3,
          style: { transform: 'scale(1)' }
        });
        download(dataUrl, `weekly-capsule-${username}.png`);
      } catch (err) {
        console.error("Erro no download", err);
        setError('Falha ao gerar a imagem. Tente novamente.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
      <main className="min-h-screen bg-neutral-950 text-white relative overflow-hidden selection:bg-red-500/30 flex flex-col">

        {/* Camada de Fundo */}
        <NoiseBackground />
        <GradientBlobs />

        <div className="absolute top-20 w-[120%] -left-[10%] -rotate-3 z-0 mix-blend-overlay">
          <Marquee items={GENRES} speed={40} />
        </div>
        <div className="absolute bottom-20 w-[120%] -left-[10%] rotate-2 z-0 mix-blend-overlay">
          <Marquee items={VIBES} direction="right" speed={50} />
        </div>

        {/* Camada de Conteúdo Principal */}
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
      </main>
  );
}