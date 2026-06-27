const KEY = 'sidebar-collapsed';

const listeners = new Set<() => void>();

export function subscribeSidebarCollapsed(callback: () => void): () => void {
    listeners.add(callback);
    return () => {
        listeners.delete(callback);
    };
}

export function getSidebarCollapsedSnapshot(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(KEY) === 'true';
}

export function setSidebarCollapsed(value: boolean): void {
    localStorage.setItem(KEY, String(value));
    listeners.forEach((listener) => listener());
}
