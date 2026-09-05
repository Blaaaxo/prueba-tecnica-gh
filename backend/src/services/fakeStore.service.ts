import { RawProduct } from "../types/product.js";

const EXTERNAL_API_URL = 'https://fakestoreapi.com/products';

/**
 * Trae el catalogo de productos desde la api externa fakestoreapi.com
 * @returns RawProduct[] - un array de productos tal como los devuelve la api externa
 */
export async function getRawProducts(): Promise<RawProduct[]> {

    const response = await fetch(EXTERNAL_API_URL);

    if (!response.ok) {
        throw new Error(`Error al consultar fakestoreapi.com: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as RawProduct[];
    return data;
}