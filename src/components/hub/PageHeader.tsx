interface PageHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
    return (
        <div className="space-y-3 mb-8">
            {badge && (
                <span className="text-red-500 font-bold tracking-widest uppercase text-sm">{badge}</span>
            )}
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{title}</h1>
            {subtitle && <p className="text-neutral-400 text-lg max-w-2xl">{subtitle}</p>}
        </div>
    );
}
