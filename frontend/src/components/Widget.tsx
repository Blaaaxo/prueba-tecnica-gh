import type { ReactNode } from 'react';

interface WidgetProps {
    title: string;
    eyebrow?: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function Widget({ title, eyebrow, description, action, children, className = '' }: WidgetProps) {
    return (
        <section
            className={`rounded-xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col ${className}`}
        >
            <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-foreground/5">
                <div className="min-w-0">
                    {eyebrow && (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue mb-1">
                            {eyebrow}
                        </p>
                    )}
                    <h3 className="font-heading text-base font-semibold text-foreground leading-tight truncate">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>
                {action && <div className="flex-none">{action}</div>}
            </header>
            <div className="flex-1 px-5 py-5">{children}</div>
        </section>
    );
}