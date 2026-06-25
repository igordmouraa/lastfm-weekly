export default function UsernameLoading() {
    return (
        <div className="space-y-6 animate-pulse px-4 md:px-6 py-6 max-w-[var(--content-max-width)] mx-auto">
            <div className="h-8 w-48 bg-neutral-800 rounded" />
            <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-neutral-800" />
                <div className="space-y-2 flex-1">
                    <div className="h-6 w-40 bg-neutral-800 rounded" />
                    <div className="h-4 w-32 bg-neutral-800 rounded" />
                </div>
            </div>
            <div className="h-20 bg-neutral-800 rounded-xl" />
            <div className="grid md:grid-cols-2 gap-4">
                <div className="aspect-square max-w-[200px] bg-neutral-800 rounded-xl" />
                <div className="h-64 bg-neutral-800 rounded-xl" />
            </div>
        </div>
    );
}
