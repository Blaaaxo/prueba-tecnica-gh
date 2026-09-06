import { useState, useEffect } from 'react';
import { fetchOpportunities } from '../services/products.service';
import type { ProcessedProduct, CatalogSource } from '../types/product';

interface UseCatalogResult {
    catalogoBase: ProcessedProduct[];
    loading: boolean;
    error: string | null;
    fuenteDatos: CatalogSource | null;
}

/**
 * Trae el catálogo UNA sola vez al montar el componente, con un markup
 * inicial fijo (0.35). El costoCOP de cada producto no depende del markup,
 * así que este catálogo "base" sirve para recalcular localmente después,
 * sin volver a llamar al backend cada vez que el usuario mueve el slider.
 * @returns UseCatalogResult - el catálogo base, el estado de carga, el error y la fuente de datos
 */
export function useCatalog(): UseCatalogResult {
    const [catalogoBase, setCatalogoBase] = useState<ProcessedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fuenteDatos, setFuenteDatos] = useState<CatalogSource | null>(null);

    useEffect(() => {
        fetchOpportunities(0.35)
            .then((data) => {
                setCatalogoBase(data.catalogo);
                setFuenteDatos(data.meta.fuenteDatos);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return { catalogoBase, loading, error, fuenteDatos };
}