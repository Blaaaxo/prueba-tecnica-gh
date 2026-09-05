import { RawProduct, ProcessedProduct } from '../types/product.js';
import {
    TRM_USD_COP,
    DEFAULT_MARKUP,
    MARKUP_MIN,
    MARKUP_MAX,
    OPPORTUNITY_MIN_RATING,
    OPPORTUNITY_MIN_REVIEWS,
} from '../config/constants.js';

/**
 * Valida y normaliza el markup recibido por query param.
 * Si viene vacío o inválido, usa el default. Si está fuera de rango, se ajusta al rango valido.
 */
export function resolveMarkup(raw: string | undefined): number {
    if (raw === undefined || raw === '') {
        return DEFAULT_MARKUP;
    }
    const value = Number(raw);
    if (Number.isNaN(value)) {
        return DEFAULT_MARKUP;
    }
    return Math.min(Math.max(value, MARKUP_MIN), MARKUP_MAX);
}

/**
 * Procesa un producto y le aplica la formula de calculo de precio y utilidad basada en un markup
 * costoCOP = precioUSD * TRM
 * precioVentaCOP = costoCOP * (1 + markup)
 * utilidadCOP = precioVentaCOP - costoCOP
 * @param product raw product traido desde fakestoreapi.com
 * @param markup  markup a aplicar al producto, ya validado y normalizado
 * @returns ProcessedProduct - producto con los calculos de precio y utilidad aplicados
 */
export function processProduct(product: RawProduct, markup: number): ProcessedProduct {
    const costoCOP = product.price * TRM_USD_COP;
    const precioVentaCOP = costoCOP * (1 + markup);
    const utilidadCOP = precioVentaCOP - costoCOP;

    return {
        id: product.id,
        title: product.title,
        category: product.category,
        image: product.image,
        rating: product.rating,
        priceUSD: product.price,
        costoCOP: Math.round(costoCOP),
        markupAplicado: markup,
        precioVentaCOP: Math.round(precioVentaCOP),
        utilidadCOP: Math.round(utilidadCOP),
    };
}
/**
 * Procesa un catálogo de productos y les aplica la formula de calculo de precio y utilidad basada en un markup.
 * @param rawProducts array de productos raw traidos desde fakestoreapi.com
 * @param markup  markup a aplicar a los productos, ya validado y normalizado
 * @returns ProcessedProduct[] - array de productos con los calculos de precio y utilidad aplicados
 */
export function processCatalog(rawProducts: RawProduct[], markup: number): ProcessedProduct[] {
    return rawProducts.map((product) => processProduct(product, markup));
}

export interface CategoryAnalytics {
    category: string;
    cantidadProductos: number;
    precioPromedioVentaCOP: number;
    utilidadPromedioCOP: number;
    utilidadTotalCategoriaCOP: number;
    ratingPromedio: number;
}

/**
 * Agrupa los productos por categoria y calcula el precio promedio de venta, utilidad promedio, utilidad total y rating promedio por categoria.
 * @param products array de productos procesados
 * @returns CategoryAnalytics[] - array de objetos con los calculos por categoria
 */
export function buildAnalyticsByCategory(products: ProcessedProduct[]): CategoryAnalytics[] {
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
            ratingPromedio: parseFloat((totalRating / items.length).toFixed(2)),
        };
    });

}

/**
 * 
 * @param products 
 * @param limit 
 * @returns 
 */
export function getTopOpportunities(products: ProcessedProduct[], limit = 3): ProcessedProduct[] {
    const eligible = products.filter(
        (p) => p.rating.rate >= OPPORTUNITY_MIN_RATING && p.rating.count > OPPORTUNITY_MIN_REVIEWS
    );

    return eligible
        .slice()
        .sort((a, b) => b.utilidadCOP - a.utilidadCOP)
        .slice(0, limit);
}