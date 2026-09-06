import type { CatalogSource } from '../types/product';

interface SourceBadgeProps {
    source: CatalogSource;
    tone?: 'light' | 'dark';
}

const SOURCE_LABELS: Record<CatalogSource, string> = {
    'live': 'En vivo',
    'memory-cache': 'Caché en memoria',
    'disk-fallback': 'Modo contingencia',
};

const SOURCE_DOT: Record<CatalogSource, string> = {
    'live': 'bg-blue',
    'memory-cache': 'bg-muted-foreground',
    'disk-fallback': 'bg-red',
};

export function SourceBadge({ source, tone = 'light' }: SourceBadgeProps) {
    const label = SOURCE_LABELS[source];
    const dotClass = SOURCE_DOT[source];

    const toneClasses =
        tone === 'dark'
            ? 'ring-1 ring-slate-border bg-slate-foreground/5 text-slate-foreground'
            : 'ring-1 ring-foreground/5 bg-card text-foreground shadow-sm';

    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${toneClasses}`}
        >
            <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotClass}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${dotClass}`} />
            </span>
            <span className="text-xs font-medium tracking-wide">{label}</span>
        </div>
    );
}