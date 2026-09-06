import type { ProcessedProduct } from '../types/product';
import { formatCOP } from '../lib/format';

interface Top3ChartProps {
    products: ProcessedProduct[];
    max?: number;
}

export function Top3Chart({ products, max }: Top3ChartProps) {
    if (products.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                Ningún producto cumple los criterios de oportunidad todavía.
            </p>
        );
    }

    const ceiling = max ?? Math.max(...products.map((p) => p.utilidadCOP));

    return (
        <div>
            <div className="flex items-baseline justify-between mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red">
                    Comparativa visual · Utilidad proyectada
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                    Escala: {formatCOP(ceiling)}
                </p>
            </div>

            <ul className="space-y-4">
                {products.map((product, idx) => {
                    const pct = Math.max(2, (product.utilidadCOP / ceiling) * 100);
                    return (
                        <li key={product.id} className="space-y-1.5">
                            <div className="flex items-baseline justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="flex-none w-5 h-5 rounded-full bg-red text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm font-medium text-foreground truncate">
                                        {product.title}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold tabular-nums text-foreground whitespace-nowrap">
                                    {formatCOP(product.utilidadCOP)}
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-red transition-[width] duration-500 ease-out"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}