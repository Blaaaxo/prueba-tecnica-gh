import type { ProcessedProduct } from '../types/product';
import { OPPORTUNITY_MIN_RATING, OPPORTUNITY_MIN_REVIEWS } from './constants';

/**
 * Obtiene las 3 mejores oportunidades de acuerdo a criterios de calidad y volumen.
 * Top 3 de Oportunidad: rating.rate >= 4.0 y rating.count > 100,
 * ordenado por utilidad proyectada de mayor a menor.
 * Misma lógica que getTopOpportunities del backend, corriendo en el cliente
 * sobre el catálogo ya recalculado con el markup actual.
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