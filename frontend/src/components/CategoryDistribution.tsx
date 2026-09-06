import { useMemo } from 'react';
import type { CategoryAnalytics } from '../types/product';

interface CategoryDistributionProps {
    categories: CategoryAnalytics[];
}

const SLICE_COLORS = ['#2d2dd3', '#385469', '#e6342a', '#3f3f40', '#000000'];

export function CategoryDistribution({ categories }: CategoryDistributionProps) {
    const total = useMemo(
        () => categories.reduce((acc, c) => acc + c.cantidadProductos, 0),
        [categories]
    );

    const slices = useMemo(() => {
        if (total === 0) return [];
        const sorted = [...categories].sort((a, b) => b.cantidadProductos - a.cantidadProductos);
        let acc = 0;
        return sorted.map((cat, idx) => {
            const value = cat.cantidadProductos;
            const startAngle = (acc / total) * 2 * Math.PI;
            acc += value;
            const endAngle = (acc / total) * 2 * Math.PI;
            return {
                category: cat.category,
                value,
                pct: (value / total) * 100,
                color: SLICE_COLORS[idx % SLICE_COLORS.length],
                path: describeDonutSlice(100, 60, startAngle, endAngle),
            };
        });
    }, [categories, total]);

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-none">
                <svg viewBox="0 0 200 200" className="w-44 h-44 -rotate-90">
                    {total === 0 ? (
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#f5f5f5" strokeWidth="40" />
                    ) : (
                        slices.map((slice) => (
                            <path
                                key={slice.category}
                                d={slice.path}
                                fill={slice.color}
                                className="transition-all duration-300 hover:opacity-80"
                            >
                                <title>
                                    {slice.category}: {slice.value} ({slice.pct.toFixed(1)}%)
                                </title>
                            </path>
                        ))
                    )}
                    <circle cx="100" cy="100" r="55" fill="white" />
                </svg>
            </div>

            <ul className="flex-1 space-y-2 w-full">
                {slices.map((slice) => (
                    <li
                        key={slice.category}
                        className="flex items-center justify-between gap-3 text-sm"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <span
                                className="flex-none h-3 w-3 rounded-sm"
                                style={{ backgroundColor: slice.color }}
                            />
                            <span className="text-foreground truncate capitalize">
                                {slice.category}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 tabular-nums">
                            <span className="text-muted-foreground text-xs">{slice.value} SKU</span>
                            <span className="font-semibold text-foreground w-12 text-right">
                                {slice.pct.toFixed(1)}%
                            </span>
                        </div>
                    </li>
                ))}
                {slices.length === 0 && (
                    <li className="text-sm text-muted-foreground">Sin datos.</li>
                )}
            </ul>
        </div>
    );
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
    };
}

function describeDonutSlice(
    outer: number,
    inner: number,
    startAngle: number,
    endAngle: number
): string {
    const cx = 100;
    const cy = 100;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const outerStart = polarToCartesian(cx, cy, outer, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outer, endAngle);
    const innerStart = polarToCartesian(cx, cy, inner, endAngle);
    const innerEnd = polarToCartesian(cx, cy, inner, startAngle);

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${inner} ${inner} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
        'Z',
    ].join(' ');
}