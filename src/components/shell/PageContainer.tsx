import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface PageContainerProps {
    title?: string;
    description?: string;
    actions?: ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
    children: ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function PageContainer({
    title,
    description,
    actions,
    breadcrumbs,
    children,
    className,
    fullWidth,
}: PageContainerProps) {
    return (
        <>
            <TopBar breadcrumbs={breadcrumbs} actions={actions} />
            <div
                className={cn(
                    'px-4 md:px-6 py-6',
                    !fullWidth && 'max-w-[var(--content-max-width)] mx-auto w-full',
                    className
                )}
            >
                {(title || description) && (
                    <div className="mb-6">
                        {title && <h1 className="text-2xl font-display font-bold tracking-tight">{title}</h1>}
                        {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
                    </div>
                )}
                {children}
            </div>
        </>
    );
}
