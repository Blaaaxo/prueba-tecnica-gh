import { Request, Response } from 'express';
import { getRawProducts } from '../services/fakeStore.service.js';
import {
  resolveMarkup,
  processCatalog,
  getTopOpportunities,
} from '../services/analytics.service.js';

/**
 * GET /api/products/opportunities?markup=0.35
 * Devuelve el catálogo completo procesado y el Top 3 de Oportunidad.
 */
export async function getOpportunities(req: Request, res: Response) {
    try {
        const markup = resolveMarkup(req.query.markup as string | undefined);
        const { products: rawProducts, source } = await getRawProducts();

        const processed = processCatalog(rawProducts, markup);
        const top3Opportunities = getTopOpportunities(processed);

        res.json({
            meta: {
                markupAplicado: markup,
                fuenteDatos: source,
                totalProductos: processed.length,
            },
            catalogo: processed,
            top3Oportunidad: top3Opportunities,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Error al procesar el catálogo de oportunidades.',
            detail: (err as Error).message,
        });
    }
}