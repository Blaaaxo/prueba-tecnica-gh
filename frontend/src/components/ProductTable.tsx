import { useMemo, useState } from 'react';
import type { ProcessedProduct } from '../types/product';
import { formatCOP } from '../lib/format';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface ProductTableProps {
    products: ProcessedProduct[];
}

type SortKey = 'utilidad' | 'venta' | 'costo' | 'rating' | 'titulo';
type SortDir = 'asc' | 'desc';

const DEFAULT_SORT: { key: SortKey; dir: SortDir } = { key: 'utilidad', dir: 'desc' };

const SORT_LABELS: Record<SortKey, string> = {
    utilidad: 'Utilidad',
    venta: 'Venta',
    costo: 'Costo',
    rating: 'Rating',
    titulo: 'Producto',
};

export function ProductTable({ products }: ProductTableProps) {
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>(DEFAULT_SORT);
    const [query, setQuery] = useState('');

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = q
            ? products.filter(
                  (p) =>
                      p.title.toLowerCase().includes(q) ||
                      p.category.toLowerCase().includes(q)
              )
            : products;

        const sorted = [...filtered].sort((a, b) => {
            const sign = sort.dir === 'asc' ? 1 : -1;
            switch (sort.key) {
                case 'utilidad':
                    return sign * (a.utilidadCOP - b.utilidadCOP);
                case 'venta':
                    return sign * (a.precioVentaCOP - b.precioVentaCOP);
                case 'costo':
                    return sign * (a.costoCOP - b.costoCOP);
                case 'rating':
                    return sign * (a.rating.rate - b.rating.rate);
                case 'titulo':
                    return sign * a.title.localeCompare(b.title);
            }
        });

        return sorted;
    }, [products, sort, query]);

    function toggleSort(key: SortKey) {
        setSort((prev) => {
            if (prev.key === key) {
                return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
            }
            return { key, dir: key === 'titulo' ? 'asc' : 'desc' };
        });
    }

    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue mb-2">
                        Detalle
                    </p>
                    <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                        Catálogo completo
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                        Todos los productos analizados con precio de venta, utilidad y rating. Ordenable por cualquier columna.
                    </p>
                </div>
                <div className="w-full md:w-72">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="product-search">
                        Buscar
                    </label>
                    <input
                        id="product-search"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Producto o categoría…"
                        className="w-full rounded-lg bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-foreground/5 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-blue/30 transition-shadow"
                    />
                </div>
            </div>

            <div className="rounded-xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-foreground/5">
                            <SortableHead label={SORT_LABELS.titulo} active={sort.key === 'titulo'} dir={sort.dir} onClick={() => toggleSort('titulo')} />
                            <TableHead className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Categoría</TableHead>
                            <SortableHead label={SORT_LABELS.costo} active={sort.key === 'costo'} dir={sort.dir} onClick={() => toggleSort('costo')} align="right" />
                            <SortableHead label={SORT_LABELS.venta} active={sort.key === 'venta'} dir={sort.dir} onClick={() => toggleSort('venta')} align="right" />
                            <SortableHead label={SORT_LABELS.utilidad} active={sort.key === 'utilidad'} dir={sort.dir} onClick={() => toggleSort('utilidad')} align="right" />
                            <SortableHead label={SORT_LABELS.rating} active={sort.key === 'rating'} dir={sort.dir} onClick={() => toggleSort('rating')} align="right" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                                    No se encontraron productos que coincidan con la búsqueda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            visible.map((product) => (
                                <TableRow key={product.id} className="border-b border-foreground/5 last:border-b-0">
                                    <TableCell className="max-w-[320px]">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt=""
                                                className="h-8 w-8 rounded-md bg-muted object-contain flex-none"
                                            />
                                            <span className="truncate font-medium text-foreground">{product.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                                            {product.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                                        {formatCOP(product.costoCOP)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-sm text-foreground font-medium">
                                        {formatCOP(product.precioVentaCOP)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-sm font-semibold text-blue">
                                        {formatCOP(product.utilidadCOP)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-sm text-foreground whitespace-nowrap">
                                        <span className="font-semibold">{product.rating.rate.toFixed(1)}</span>
                                        <span className="text-muted-foreground ml-1">({product.rating.count})</span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <p className="text-xs text-muted-foreground text-right tabular-nums">
                Mostrando {visible.length} de {products.length} productos
            </p>
        </section>
    );
}

interface SortableHeadProps {
    label: string;
    active: boolean;
    dir: SortDir;
    onClick: () => void;
    align?: 'left' | 'right';
}

function SortableHead({ label, active, dir, onClick, align = 'left' }: SortableHeadProps) {
    return (
        <TableHead className={`text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ${align === 'right' ? 'text-right' : ''}`}>
            <button
                type="button"
                onClick={onClick}
                className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${align === 'right' ? 'flex-row-reverse' : ''}`}
            >
                <span>{label}</span>
                <span aria-hidden className={`text-[10px] ${active ? 'text-gold' : 'text-muted-foreground/40'}`}>
                    {active ? (dir === 'asc' ? '▲' : '▼') : '↕'}
                </span>
            </button>
        </TableHead>
    );
}