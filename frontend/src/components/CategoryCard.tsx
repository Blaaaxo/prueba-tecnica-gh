import type { CategoryAnalytics } from '../types/product';
import { formatCOP } from '../lib/format';

interface CategoryCardProps {
    category: CategoryAnalytics;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <div className="rounded-xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue capitalize">
                {category.category}
            </p>

            <div className="space-y-2 divide-y divide-foreground/5">
                <Metric label="Productos" value={String(category.cantidadProductos)} />
                <Metric label="Precio prom." value={formatCOP(category.precioPromedioVentaCOP)} emphasis />
                <Metric label="Utilidad prom." value={formatCOP(category.utilidadPromedioCOP)} />
                <Metric label="Rating" value={category.ratingPromedio.toFixed(2)} />
            </div>
        </div>
    );
}

function Metric({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
    return (
        <div className="flex items-baseline justify-between gap-2 pt-2 first:pt-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
            <span className={`tabular-nums text-right ${emphasis ? 'text-base font-bold text-foreground' : 'text-sm font-medium'}`}>
                {value}
            </span>
        </div>
    );
}