import type { ProcessedProduct } from '../types/product';
import { formatCOP } from '../lib/format';

interface Top3CardProps {
    product: ProcessedProduct;
    rank: number;
}

export function Top3Card({ product, rank }: Top3CardProps) {
    return (
        <div className="rounded-xl bg-card shadow-[0_1px_3px_rgba(230,52,42,0.06),0_8px_24px_rgba(230,52,42,0.08)] ring-1 ring-red/15 overflow-hidden">
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                    <span className="flex-none w-7 h-7 rounded-full bg-red text-primary-foreground font-bold text-sm flex items-center justify-center shadow-sm">
                        {rank}
                    </span>
                    <span className="text-xs font-semibold text-red uppercase tracking-[0.14em]">
                        Oportunidad
                    </span>
                </div>

                <div className="aspect-square w-full bg-muted/40 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>

                <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem] leading-snug">
                    {product.title}
                </h3>

                <div className="space-y-1 pt-1 divide-y divide-foreground/5">
                    <div className="flex items-baseline justify-between py-1.5">
                        <span className="text-xs text-muted-foreground">Costo</span>
                        <span className="text-sm tabular-nums">{formatCOP(product.costoCOP)}</span>
                    </div>
                    <div className="flex items-baseline justify-between py-1.5">
                        <span className="text-xs text-muted-foreground">Venta sugerida</span>
                        <span className="text-sm tabular-nums">{formatCOP(product.precioVentaCOP)}</span>
                    </div>
                    <div className="flex items-baseline justify-between py-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">Utilidad</span>
                        <span className="text-base font-bold tabular-nums text-red">
                            {formatCOP(product.utilidadCOP)}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground pt-1">
                    ★ {product.rating.rate} · {product.rating.count} reseñas
                </p>
            </div>
        </div>
    );
}