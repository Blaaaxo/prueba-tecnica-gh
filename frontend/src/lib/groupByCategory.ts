import type { ProcessedProduct, CategoryAnalytics } from '../types/product';

/**
 * Agrupa el catálogo (ya recalculado con el markup actual) por categoría
 * y calcula los promedios. Misma lógica que buildAnalyticsByCategory del
 * backend, pero corriendo en el cliente para que el slider no dependa
 * de una nueva llamada de red.
 */
export function groupByCategory(products: ProcessedProduct[]): CategoryAnalytics[] {
    const groups: Record<string, ProcessedProduct[]> = {};

    for (const product of products) {
        if (!groups[product.category]) {
            groups[product.category] = [];
        }
        groups[product.category].push(product);
    }

    return Object.entries(groups).map(([category, items]) => {
        const totalVenta = items.reduce((acc, p) => acc + p.precioVentaCOP, 0);
        const totalUtilidad = items.reduce((acc, p) => acc + p.utilidadCOP, 0);
        const totalRating = items.reduce((acc, p) => acc + p.rating.rate, 0);

        return {
            category,
            cantidadProductos: items.length,
            precioPromedioVentaCOP: Math.round(totalVenta / items.length),
            utilidadPromedioCOP: Math.round(totalUtilidad / items.length),
            utilidadTotalCategoriaCOP: Math.round(totalUtilidad),
            ratingPromedio: Number((totalRating / items.length).toFixed(2)),
        };
    });
}