export function ExecutiveFooter() {
    const now = new Date();
    const formatted = now.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <footer className="bg-[#2d2dd3] text-slate-foreground mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
                <div>
                    <p className="font-heading text-base font-semibold">
                        El Gigante del Hogar
                    </p>
                    <p className="text-xs text-slate-muted mt-0.5">
                        Simulador de Rentabilidad e-Commerce · MVP
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-muted">
                    <span>
                        Generado el <span className="text-slate-foreground font-medium">{formatted}</span>
                    </span>
                    <span>
                        TRM ref. <span className="text-slate-foreground font-medium tabular-nums">$4.000 COP / USD</span>
                    </span>
                    <span>
                        Fuente: <span className="text-slate-foreground font-medium">fakestoreapi.com</span>
                    </span>
                </div>
            </div>
            <div className="border-t border-slate-border/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 text-[11px] text-slate-muted leading-relaxed">
                    Documento generado con fines demostrativos. Las cifras son proyecciones basadas en el catálogo público
                    de fakestoreapi.com y una TRM fija; no constituyen asesoría financiera ni comercial.
                </div>
            </div>
        </footer>
    );
}