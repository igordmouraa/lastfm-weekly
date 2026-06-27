export default function WeekLoading() {
    return (
        <div className="space-y-6 animate-pulse px-4 md:px-6 py-6 max-w-[var(--content-max-width)] mx-auto">
            <div className="h-8 w-56 bg-neutral-800 rounded" />
            <div className="flex gap-2">
                <div className="h-9 w-24 bg-neutral-800 rounded-full" />
                <div className="h-9 w-24 bg-neutral-800 rounded-full" />
            </div>
            <div className="mx-auto w-full max-w-sm aspect-[9/16] bg-neutral-800 rounded-2xl" />
        </div>
    );
}
