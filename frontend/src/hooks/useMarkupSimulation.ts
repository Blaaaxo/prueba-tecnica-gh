import { useState, useMemo } from 'react';
import type { ProcessedProduct } from '../types/product';

interface UseMarkupSimulationResult {
    markup: number;
    setMarkup: (value: number) => void;
    catalogoRecalculado: ProcessedProduct[];
}

/**
 * Recibe el catálogo base (con costoCOP fijo) y expone un markup ajustable.
 * Cada vez que el markup cambia, recalcula precioVentaCOP y utilidadCOP
 * de TODOS los productos, en el cliente, sin tocar el backend.
 * @param catalogoBase - el catálogo base de productos, obtenido del backend con un markup inicial fijo (0.35)
 * @returns UseMarkupSimulationResult - el markup actual, la función para actualizarlo y el catálogo recalculado con los nuevos precios y utilidades
 */
export function useMarkupSimulation(catalogoBase: ProcessedProduct[] = []): UseMarkupSimulationResult {
    const [markup, setMarkup] = useState(0.35);

    const catalogoRecalculado = useMemo(() => {
        return catalogoBase.map((producto) => {
            const precioVentaCOP = producto.costoCOP * (1 + markup);
            const utilidadCOP = precioVentaCOP - producto.costoCOP;
            return {
                ...producto,
                markupAplicado: markup,
                precioVentaCOP: Math.round(precioVentaCOP),
                utilidadCOP: Math.round(utilidadCOP),
            };
        });
    }, [catalogoBase, markup]);

    return { markup, setMarkup, catalogoRecalculado };
}