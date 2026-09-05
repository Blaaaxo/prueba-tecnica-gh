import { Request, Response } from 'express';
import { getRawProducts } from '../services/fakeStore.service.js';
import {
    resolveMarkup,
    processCatalog,
    buildAnalyticsByCategory,
} from '../services/analytics.service.js';

/**
 * GET /api/analytics?markup=0.35
 * Devuelve métricas agregadas por categoría (precio promedio, utilidad, rating).
 */
export async function getAnalytics(req: Request, res: Response) {
    try {
        const markup = resolveMarkup(req.query.markup as string | undefined);
        const { products: rawProducts, source } = await getRawProducts();

        const processed = processCatalog(rawProducts, markup);
        const analytics = buildAnalyticsByCategory(processed);

        res.json({
            meta: {
                markupAplicado: markup,
                fuenteDatos: source,
                totalProductos: processed.length,
            },
            analytics,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Error al calcular la analítica.',
            detail: (err as Error).message,
        });
    }
}