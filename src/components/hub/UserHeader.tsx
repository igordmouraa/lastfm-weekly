import { ProxyImage } from '@/components/ProxyImage';
import { LastFmUser } from '@/types/lastfm';
import { getImageUrl } from '@/lib/images';

interface UserHeaderProps {
    user: LastFmUser;
}

export function UserHeader({ user }: UserHeaderProps) {
    const avatar = getImageUrl(user.image);

    return (
        <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-neutral-800 border-2 border-red-500/30 shrink-0">
                {avatar ? (
                    <ProxyImage src={avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-red-500">
                        {user.name[0]?.toUpperCase()}
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">{user.name}</h2>
                <p className="text-neutral-400 text-sm">
                    {parseInt(user.playcount, 10).toLocaleString('pt-BR')} scrobbles
                    {user.country && user.country !== 'Unknown' && ` · ${user.country}`}
                </p>
                {user.url && (
                    <a href={user.url} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400 hover:underline">
                        Ver no Last.fm
                    </a>
                )}
            </div>
        </div>
    );
}
