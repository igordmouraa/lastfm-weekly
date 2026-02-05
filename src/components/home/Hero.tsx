'use client';

import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Music2, Disc3 } from 'lucide-react';

interface HeroProps {
    username: string;
    setUsername: (val: string) => void;
    onSearch: (e: React.FormEvent) => void;
    loading: boolean;
}

export const Hero = ({ username, setUsername, onSearch, loading }: HeroProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full max-w-xl space-y-8"
        >
            <div className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-red-500 font-bold tracking-widest uppercase text-sm"
                >
                    <Disc3 className="animate-spin-slow w-4 h-4" />
                    Last.fm Weekly
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                    Sua semana <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                        em música.
                    </span>
                </h1>

                <p className="text-neutral-400 text-lg md:text-xl max-w-md leading-relaxed">
                    Transforme seus scrobbles em uma cápsula visual. Descubra seus top artistas e faixas dos últimos 7 dias.
                </p>
            </div>

            {/* Form de Busca */}
            <form onSubmit={onSearch} className="relative group z-20">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex gap-2 p-2 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-lg">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                        <Input
                            placeholder="Seu usuário do Last.fm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent border-none pl-10 h-12 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-neutral-600 text-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="bg-white text-black hover:bg-neutral-200 font-bold px-8 h-12 transition-transform active:scale-95"
                    >
                        {loading ? <Music2 className="animate-bounce w-5 h-5" /> : 'Gerar'}
                    </Button>
                </div>
            </form>

            <div className="flex flex-wrap gap-3 text-xs font-medium text-neutral-500">
                <span className="px-3 py-1 rounded-full border border-white/5 bg-white/5">Stories 9:16</span>
                <span className="px-3 py-1 rounded-full border border-white/5 bg-white/5">Auto-capas</span>
                <span className="px-3 py-1 rounded-full border border-white/5 bg-white/5">HD Download</span>
            </div>
        </motion.div>
    );
};