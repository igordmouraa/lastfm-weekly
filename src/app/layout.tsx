import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Last.fm Weekly Capsule | Seus stories musicais",
    description: "Transforme seus scrobbles da semana em um visual incrível para compartilhar no Instagram. Gere sua cápsula musical agora.",
    icons: {
        icon: '/icon.svg',
    },
    openGraph: {
        title: "Last.fm Weekly Capsule",
        description: "Gere seus stories do Last.fm com visual profissional.",
        type: "website",
        locale: "pt_BR",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark scroll-smooth">
        <body
            className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-neutral-950 
          text-white 
          min-h-screen 
          selection:bg-red-600/30 
          selection:text-red-100
        `}
        >
        {children}
        </body>
        </html>
    );
}