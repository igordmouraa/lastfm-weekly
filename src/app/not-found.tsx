import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
            <h1 className="text-2xl font-display font-bold mb-2">Página não encontrada</h1>
            <p className="text-neutral-400 mb-6">Usuário ou rota não existe no Weekster Hub.</p>
            <Link href="/" className="text-red-400 hover:text-red-300 text-sm font-medium">
                ← Voltar ao início
            </Link>
        </div>
    );
}
