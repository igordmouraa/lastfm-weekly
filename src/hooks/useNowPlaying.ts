'use client';

import { useSyncExternalStore } from 'react';
import { NowPlayingData } from '@/lib/lastfm/aggregators/now-playing';

const POLL_INTERVAL = 45_000;

type Subscriber = () => void;

interface UsernameEntry {
    data: NowPlayingData | null;
    subscribers: Set<Subscriber>;
    intervalId: ReturnType<typeof setInterval> | null;
    refCount: number;
    fetching: boolean;
}

const store = new Map<string, UsernameEntry>();

function parseNowPlaying(json: Record<string, unknown>): NowPlayingData {
    return {
        isLive: Boolean(json.isLive),
        track: json.track as NowPlayingData['track'],
        lastPlayedAt: json.lastPlayedAt ? new Date(json.lastPlayedAt as string) : null,
    };
}

async function fetchNowPlaying(username: string): Promise<NowPlayingData | null> {
    const res = await fetch(`/api/lastfm/user/${encodeURIComponent(username)}/now-playing`);
    if (!res.ok) return null;
    const json = await res.json();
    return parseNowPlaying(json);
}

function getOrCreateEntry(username: string): UsernameEntry {
    let entry = store.get(username);
    if (!entry) {
        entry = {
            data: null,
            subscribers: new Set(),
            intervalId: null,
            refCount: 0,
            fetching: false,
        };
        store.set(username, entry);
    }
    return entry;
}

function notify(entry: UsernameEntry) {
    entry.subscribers.forEach((fn) => fn());
}

async function refreshEntry(username: string) {
    const entry = getOrCreateEntry(username);
    if (entry.fetching) return;
    entry.fetching = true;
    try {
        const data = await fetchNowPlaying(username);
        entry.data = data;
        notify(entry);
    } finally {
        entry.fetching = false;
    }
}

function startPolling(username: string) {
    const entry = getOrCreateEntry(username);
    if (entry.intervalId) return;

    void refreshEntry(username);

    entry.intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
            void refreshEntry(username);
        }
    }, POLL_INTERVAL);
}

function stopPolling(username: string) {
    const entry = store.get(username);
    if (!entry || entry.refCount > 0) return;
    if (entry.intervalId) {
        clearInterval(entry.intervalId);
        entry.intervalId = null;
    }
    store.delete(username);
}

function subscribe(username: string | null, onChange: Subscriber): () => void {
    if (!username) return () => {};

    const entry = getOrCreateEntry(username);
    entry.refCount += 1;
    entry.subscribers.add(onChange);
    startPolling(username);

    return () => {
        entry.subscribers.delete(onChange);
        entry.refCount -= 1;
        stopPolling(username);
    };
}

function getSnapshot(username: string | null): NowPlayingData | null {
    if (!username) return null;
    return store.get(username)?.data ?? null;
}

export function useNowPlaying(username: string | null) {
    return useSyncExternalStore(
        (onChange) => subscribe(username, onChange),
        () => getSnapshot(username),
        () => null
    );
}
