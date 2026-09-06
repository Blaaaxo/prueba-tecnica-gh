import type { CatalogSource } from '../types/product';

interface TopBarProps {
    fuenteDatos: CatalogSource | null;
}

export function TopBar({ fuenteDatos }: TopBarProps) {
    return (
        <header className="bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-none size-9 rounded-md bg-blue text-primary-foreground flex items-center justify-center">
                        <span className="font-heading text-base font-bold">
                            GH
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue leading-none">
                            El Gigante del Hogar
                        </p>
                        <h1 className="font-heading text-base md:text-lg font-semibold leading-tight truncate">
                            Simulador de Rentabilidad
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {fuenteDatos && <StatusPill fuenteDatos={fuenteDatos} />}
                </div>
            </div>
        </header>
    );
}

function StatusPill({ fuenteDatos }: { fuenteDatos: CatalogSource }) {
    const styles: Record<CatalogSource, { dot: string; text: string; label: string }> = {
        'live': { dot: 'bg-blue', text: 'text-blue', label: 'En vivo' },
        'memory-cache': { dot: 'bg-muted-foreground', text: 'text-muted-foreground', label: 'Caché' },
        'disk-fallback': { dot: 'bg-red', text: 'text-red', label: 'Contingencia' },
    };

    const s = styles[fuenteDatos];

    return (
        <div className="inline-flex items-center gap-2 rounded-full bg-muted/50 ring-1 ring-foreground/5 px-3 py-1.5 shadow-sm">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
        </div>
    );
}