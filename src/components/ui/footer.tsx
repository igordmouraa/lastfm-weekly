'use client';

import Link from 'next/link';
import { Disc3 } from 'lucide-react';

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative z-10 mt-auto border-t border-white/[0.06]">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-600/90 flex items-center justify-center shrink-0">
                            <Disc3 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-sm font-display font-bold tracking-tight">Weekster Hub</p>
                            <p className="text-[11px] text-neutral-600 mt-0.5">
                                Dados via{' '}
                                <a
                                    href="https://www.last.fm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-500 hover:text-red-400 transition-colors"
                                >
                                    Last.fm API
                                </a>
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
                        <Link href="/charts" className="hover:text-white transition-colors">
                            Charts
                        </Link>
                        <Link href="/tags" className="hover:text-white transition-colors">
                            Tags
                        </Link>
                        <span className="hidden sm:inline text-neutral-800">|</span>
                        <a
                            href="https://github.com/igordmouraa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-400 transition-colors"
                        >
                            Igor Moura
                        </a>
                    </nav>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-neutral-600">
                    <p>Não afiliado ao Last.fm. Scrobbles e marcas pertencem aos seus respectivos donos.</p>
                    <p className="shrink-0 tabular-nums">© {year}</p>
                </div>
            </div>
        </footer>
    );
}
