'use client';

import { motion } from 'framer-motion';
import { RankedList } from '@/components/discovery/RankedList';
import { formatTagName } from '@/lib/tags';

interface TagViewProps {
    tag: string;
    artists: { name: string; playcount?: string; imageUrl: string | null }[];
    albums: { name: string; playcount?: string; imageUrl: string | null; artist: string }[];
}

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function TagView({ tag, artists, albums }: TagViewProps) {
    const artistItems = artists.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.imageUrl,
    }));

    const albumItems = albums.map((a) => ({
        name: a.name,
        playcount: a.playcount,
        image: a.imageUrl,
        sub: a.artist,
    }));

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-10 -mt-2"
        >
            <motion.header variants={fadeUp}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-1">Tag</p>
                <h1 className="text-3xl font-display font-bold tracking-tight">{formatTagName(tag)}</h1>
                <p className="text-sm text-neutral-500 mt-1">Artistas e álbuns mais ouvidos com essa tag</p>
            </motion.header>

            <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-x-14 gap-y-10">
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">Artistas</h2>
                    </div>
                    <RankedList items={artistItems} accent="#a78bfa" linkPrefix="/artist" />
                </section>
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Álbuns</h2>
                    </div>
                    {albumItems.length > 0 ? (
                        <RankedList items={albumItems} accent="#34d399" />
                    ) : (
                        <p className="text-sm text-neutral-600">Nenhum álbum encontrado para esta tag.</p>
                    )}
                </section>
            </motion.div>
        </motion.div>
    );
}
