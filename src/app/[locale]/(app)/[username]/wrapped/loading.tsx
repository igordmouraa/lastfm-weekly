export default function WrappedLoading() {
    return (
        <div className="space-y-6 animate-pulse px-4 md:px-6 py-6 max-w-[var(--content-max-width)] mx-auto">
            <div className="h-8 w-48 bg-neutral-800 rounded" />
            <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-9 w-20 bg-neutral-800 rounded-full" />
                ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-64 bg-neutral-800 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
