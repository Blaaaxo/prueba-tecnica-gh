import type { ProcessedProduct } from '../types/product';
import { formatCOP } from '../lib/format';
import { TrendingUp, Package, Percent, Receipt } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    hint?: string;
    emphasis?: boolean;
}

function KpiCard({ label, value, icon: Icon, hint, emphasis }: KpiCardProps) {
    return (
        <div className="rounded-xl bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                </p>
                <div className={`size-7 rounded-md flex items-center justify-center ${
                    emphasis ? 'bg-blue/15 text-blue' : 'bg-muted text-muted-foreground'
                }`}>
                    <Icon className="size-4" />
                </div>
            </div>
            <p className={`font-heading tabular-nums leading-none ${
                emphasis
                    ? 'text-3xl md:text-4xl font-bold text-blue'
                    : 'text-2xl md:text-3xl font-semibold text-foreground'
            }`}>
                {value}
            </p>
            {hint && (
                <p className="text-xs text-muted-foreground leading-snug">{hint}</p>
            )}
        </div>
    );
}

interface KpiGridProps {
    products: ProcessedProduct[];
    markup: number;
}

export function KpiGrid({ products, markup }: KpiGridProps) {
    const utilidadTotal = products.reduce((acc, p) => acc + p.utilidadCOP, 0);
    const precioPromedio =
        products.length > 0
            ? products.reduce((acc, p) => acc + p.precioVentaCOP, 0) / products.length
            : 0;
    const margenSobreCosto =
        products.length > 0
            ? products.reduce((acc, p) => acc + p.costoCOP, 0)
            : 0;
    const margenPromedio =
        margenSobreCosto > 0 ? (utilidadTotal / margenSobreCosto) * 100 : markup * 100;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
                label="Utilidad proyectada"
                value={formatCOP(utilidadTotal)}
                icon={TrendingUp}
                emphasis
                hint="Suma de la utilidad de todo el catálogo al markup actual."
            />
            <KpiCard
                label="Productos analizados"
                value={String(products.length)}
                icon={Package}
                hint="SKUs vivos en el catálogo procesado."
            />
            <KpiCard
                label="Precio promedio de venta"
                value={formatCOP(precioPromedio)}
                icon={Receipt}
                hint="Promedio del precio de venta sugerido."
            />
            <KpiCard
                label="Markup efectivo"
                value={`${Math.round(markup * 100)}%`}
                icon={Percent}
                hint={`Margen real ponderado sobre costo: ${margenPromedio.toFixed(1)}%.`}
            />
        </div>
    );
}