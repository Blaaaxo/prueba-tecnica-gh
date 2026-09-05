import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import NodeCache from 'node-cache';
import { RawProduct } from "../types/product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTERNAL_API_URL = 'https://fakestoreapi.com/products';
const FALLBACK_SNAPSHOT_PATH = path.join(__dirname, '../data/fallback-snapshot.json');
const CACHE_KEY = 'products';

// TTL de 10 minutos: el catálogo no cambia cada minuto, así que es suficiente
// para evitar golpear la API externa en cada request del dashboard.
const cache = new NodeCache({ stdTTL: 600 });

export type CatalogSource = 'live' | 'memory-cache' | 'disk-fallback';

export interface CatalogResult {
    products: RawProduct[];
    source: CatalogSource;
}

function persistSnapshot(products: RawProduct[]): void {
    try {
        const payload = { savedAt: new Date().toISOString(), products };
        fs.writeFileSync(FALLBACK_SNAPSHOT_PATH, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
        console.error('No se pudo guardar el snapshot de respaldo:', (err as Error).message);
    }
}

function readDiskFallback(): RawProduct[] {
    const raw = fs.readFileSync(FALLBACK_SNAPSHOT_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.products as RawProduct[];
}

/**
 * Trae el catalogo de productos desde la api externa fakestoreapi.com
 * se implementa un cache en memoria para no golpear la api externa en cada request
 * esto lo hacemos en 3 niveles:
 * 1. cache en memoria (si esta vigente)
 * 2. llamada en vivo a fakestorageapi.com (y se persiste a disco si funciona)
 * 3. lectura de snapshot de respaldo en disco
 * @returns CatalogResult - un objeto con los productos y la fuente de los mismos
 * @throws Error si no se puede obtener el catalogo de productos desde ninguna fuente
 */
export async function getRawProducts(): Promise<CatalogResult> {
    const cached = cache.get<RawProduct[]>(CACHE_KEY);
    if (cached) {
        return { products: cached, source: 'memory-cache' };
    }

    try {
        const response = await fetch(EXTERNAL_API_URL);

        if (!response.ok) {
            throw new Error(`Error al consultar fakestoreapi.com: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as RawProduct[];
        cache.set(CACHE_KEY, data);
        persistSnapshot(data);

        return { products: data, source: 'live' };
    } catch (err) {
        console.error('Fallo al consultar la API externa, usando snapshot de respaldo:', (err as Error).message);
        const fallbackProducts = readDiskFallback();
        return { products: fallbackProducts, source: 'disk-fallback' };
    }
}