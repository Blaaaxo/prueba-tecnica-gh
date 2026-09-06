import type { OpportunitiesResponse } from '../types/product';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * fetch a el endpoint /api/products/opportunities del backend, pasando el markup como query param.
 * @param markup - el markup a aplicar para calcular el precio de venta y utilidad de los productos
 * @returns Promise<OpportunitiesResponse> - la respuesta del backend con el catalogo de productos procesados y las oportunidades de negocio
 * @throws Error - si la respuesta del backend no es ok, lanza un error con el status y statusText
 */
export async function fetchOpportunities(markup: number): Promise<OpportunitiesResponse> {
    const response = await fetch(`${API_BASE}/products/opportunities?markup=${markup}`);

    if (!response.ok) {
        throw new Error(`Error al consultar el backend: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as OpportunitiesResponse;
    return data;
}