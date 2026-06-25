interface StatCardProps {
    label: string;
    value: string | number;
    sub?: string;
    accent?: string;
}

export function StatCard({ label, value, sub, accent = '#ef4444' }: StatCardProps) {
    return (
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 space-y-1">
            <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
            <p className="text-3xl font-black" style={{ color: accent }}>{value}</p>
            {sub && <p className="text-xs text-neutral-500">{sub}</p>}
        </div>
    );
}

export function MiniSparkBars({ values, color }: { values: number[]; color: string }) {
    const max = Math.max(...values, 1);
    return (
        <div className="flex items-end gap-[3px] h-8">
            {values.map((v, i) => (
                <div
                    key={i}
                    className="w-[5px] rounded-sm"
                    style={{
                        height: `${Math.max((v / max) * 100, 10)}%`,
                        backgroundColor: color,
                        opacity: 0.6 + (v / max) * 0.4,
                    }}
                />
            ))}
        </div>
    );
}
