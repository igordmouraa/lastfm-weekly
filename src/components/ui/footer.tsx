'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            className="w-full py-8 mt-auto border-t border-white/5 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="flex flex-col items-center gap-2 text-xs sm:text-sm font-mono text-neutral-500">
                <div className="flex items-center gap-1.5">
                    <span>Feito com</span>

                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 0.5
                        }}
                    >
                        <Heart size={14} className="text-red-600 fill-red-600" />
                    </motion.div>

                    <span>por</span>

                    <a
                        href="https://github.com/igordmouraa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-neutral-300 hover:text-red-500 transition-colors decoration-red-900/50 underline-offset-4 hover:underline"
                    >
                        Igor Moura
                    </a>
                </div>
                <span className="opacity-50">© {currentYear} Todos os direitos reservados.</span>
            </div>
        </motion.footer>
    );
};