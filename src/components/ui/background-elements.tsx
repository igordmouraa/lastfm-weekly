'use client';

import { motion } from 'framer-motion';

export const NoiseBackground = () => (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-[0.05] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
    </div>
);

export const GradientBlobs = () => (
    <>
        <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none z-0" />
    </>
);

export const Marquee = ({ items, direction = "left", speed = 25 }: { items: string[], direction?: "left" | "right", speed?: number }) => {
    return (
        <div className="flex overflow-hidden whitespace-nowrap select-none absolute inset-x-0 z-0 pointer-events-none opacity-10">
            <motion.div
                className="flex gap-12 py-4"
                animate={{ x: direction === "left" ? [0, -1000] : [-1000, 0] }}
                transition={{ ease: "linear", duration: speed, repeat: Infinity }}
            >
                {[...items, ...items, ...items, ...items, ...items].map((item, i) => (
                    <span key={i} className="text-8xl font-black text-white uppercase tracking-tighter">
                {item}
              </span>
                ))}
            </motion.div>
        </div>
    );
};