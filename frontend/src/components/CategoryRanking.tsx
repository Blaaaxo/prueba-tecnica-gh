import type { CategoryAnalytics } from '../types/product';
import { formatCOP } from '../lib/format';

interface CategoryRankingProps {
    categories: CategoryAnalytics[];
}

export function CategoryRanking({ categories }: CategoryRankingProps) {
    const sorted = [...categories].sort((a, b) => b.utilidadTotalCategoriaCOP - a.utilidadTotalCategoriaCOP);
    const max = Math.max(...sorted.map((c) => c.utilidadTotalCategoriaCOP), 1);

    return (
        <div className="space-y-3">
            {sorted.map((cat, idx) => {
                const pct = Math.max(2, (cat.utilidadTotalCategoriaCOP / max) * 100);
                const rank = idx + 1;
                return (
                    <div key={cat.category} className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="flex-none w-5 h-5 rounded bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center tabular-nums">
                                    {rank}
                                </span>
                                <span className="text-sm font-medium text-foreground capitalize truncate">
                                    {cat.category}
                                </span>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    · {cat.cantidadProductos} SKU{cat.cantidadProductos !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-foreground tabular-nums whitespace-nowrap">
                                {formatCOP(cat.utilidadTotalCategoriaCOP)}
                            </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                                    rank === 1 ? 'bg-blue' : 'bg-blue/40'
                                }`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}