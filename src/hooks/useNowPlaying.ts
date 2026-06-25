'use client';

import { useEffect, useState, useCallback } from 'react';
import { NowPlayingData } from '@/lib/lastfm/aggregators/now-playing';

const POLL_INTERVAL = 45_000;

export function useNowPlaying(username: string | null, initial: NowPlayingData | null) {
    const [data, setData] = useState<NowPlayingData | null>(initial);

    const fetchNowPlaying = useCallback(async () => {
        if (!username) return;
        try {
            const res = await fetch(`/api/lastfm/user/${encodeURIComponent(username)}/now-playing`);
            if (res.ok) {
                const json = await res.json();
                setData({
                    ...json,
                    lastPlayedAt: json.lastPlayedAt ? new Date(json.lastPlayedAt) : null,
                });
            }
        } catch {
            /* keep current */
        }
    }, [username]);

    useEffect(() => {
        setData(initial);
    }, [initial]);

    useEffect(() => {
        if (!username) return;
        fetchNowPlaying();
    }, [username, fetchNowPlaying]);

    useEffect(() => {
        if (!username) return;

        const tick = () => {
            if (document.visibilityState === 'visible') fetchNowPlaying();
        };

        const id = setInterval(tick, POLL_INTERVAL);
        return () => clearInterval(id);
    }, [username, fetchNowPlaying]);

    return data;
}
