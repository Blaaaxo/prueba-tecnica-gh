import type { ProcessedProduct, CategoryAnalytics } from '../types/product';
import { formatCOP } from '../lib/format';

interface Insight {
    title: string;
    value: string;
    description: string;
    tone: 'positive' | 'neutral' | 'premium';
}

interface InsightsGridProps {
    products: ProcessedProduct[];
    categories: CategoryAnalytics[];
    markup: number;
}

export function InsightsGrid({ products, categories, markup }: InsightsGridProps) {
    const insights = buildInsights(products, categories, markup);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} index={idx + 1} />
            ))}
        </div>
    );
}

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
    const toneStyles: Record<Insight['tone'], { card: string; value: string; description: string; eyebrow: string; badge: string }> = {
        positive: {
            card: 'bg-blue/5 text-foreground shadow-[0_1px_3px_rgba(45,45,211,0.05),0_4px_12px_rgba(45,45,211,0.06)]',
            value: 'text-blue',
            description: 'text-muted-foreground',
            eyebrow: 'text-blue',
            badge: 'bg-blue text-primary-foreground',
        },
        premium: {
            card: 'bg-slate text-slate-foreground shadow-[0_1px_3px_rgba(56,84,105,0.10),0_8px_20px_rgba(56,84,105,0.12)]',
            value: 'text-slate-foreground',
            description: 'text-slate-muted',
            eyebrow: 'text-slate-muted',
            badge: 'bg-slate-foreground text-slate',
        },
        neutral: {
            card: 'bg-card text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]',
            value: 'text-foreground',
            description: 'text-muted-foreground',
            eyebrow: 'text-muted-foreground',
            badge: 'bg-foreground text-background',
        },
    };

    const s = toneStyles[insight.tone];

    return (
        <div className={`relative rounded-xl p-5 ${s.card}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${s.badge}`}>
                    {index.toString().padStart(2, '0')}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${s.eyebrow}`}>
                    {insight.title}
                </span>
            </div>
            <p className={`font-heading text-xl md:text-2xl font-semibold leading-tight ${s.value}`}>
                {insight.value}
            </p>
            <p className={`text-xs mt-2 leading-relaxed ${s.description}`}>
                {insight.description}
            </p>
        </div>
    );
}

function buildInsights(
    products: ProcessedProduct[],
    categories: CategoryAnalytics[],
    markup: number
): Insight[] {
    if (products.length === 0 || categories.length === 0) {
        return [
            { title: 'Catálogo', value: '—', description: 'Sin datos suficientes.', tone: 'neutral' },
            { title: 'Categoría líder', value: '—', description: 'Sin datos suficientes.', tone: 'neutral' },
            { title: 'Producto destacado', value: '—', description: 'Sin datos suficientes.', tone: 'neutral' },
        ];
    }

    const sortedByUtility = [...products].sort((a, b) => b.utilidadCOP - a.utilidadCOP);
    const topProduct = sortedByUtility[0];

    const topCategory = [...categories].sort(
        (a, b) => b.utilidadTotalCategoriaCOP - a.utilidadTotalCategoriaCOP
    )[0];

    const ratingPromedio =
        products.reduce((acc, p) => acc + p.rating.rate, 0) / products.length;
    const calidad =
        ratingPromedio >= 4
            ? 'alta calidad agregada'
            : ratingPromedio >= 3.5
              ? 'calidad aceptable'
              : 'calidad mixta';

    const margenCalificacion =
        markup >= 0.4
          ? 'margen agresivo'
          : markup >= 0.3
            ? 'margen saludable'
            : 'margen conservador';

    return [
        {
            title: 'Categoría líder',
            value: capitalize(topCategory.category),
            description: `Aporta ${formatCOP(topCategory.utilidadTotalCategoriaCOP)} en utilidad con ${topCategory.cantidadProductos} productos. Mejor línea para profundizar.`,
            tone: 'premium',
        },
        {
            title: 'Producto destacado',
            value: truncate(topProduct.title, 38),
            description: `Utilidad proyectada de ${formatCOP(topProduct.utilidadCOP)} · ★ ${topProduct.rating.rate} (${topProduct.rating.count} reseñas).`,
            tone: 'positive',
        },
        {
            title: 'Lectura del catálogo',
            value: `★ ${ratingPromedio.toFixed(2)} promedio`,
            description: `${products.length} SKUs analizados con ${margenCalificacion} (${Math.round(markup * 100)}%). Catálogo de ${calidad}.`,
            tone: 'neutral',
        },
    ];
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function truncate(s: string, n: number): string {
    return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}