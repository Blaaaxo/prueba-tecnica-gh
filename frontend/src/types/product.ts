
export interface Rating {
  rate: number;
  count: number;
}

// Lo que devuelve tu backend en /api/products/opportunities y /api/analytics
// (coincide con ProcessedProduct del backend, pero vive aquí por separado
// porque frontend y backend son proyectos independientes)
export interface ProcessedProduct {
  id: number;
  title: string;
  category: string;
  image: string;
  rating: Rating;
  priceUSD: number;
  costoCOP: number;
  markupAplicado: number;
  precioVentaCOP: number;
  utilidadCOP: number;
}

export interface CategoryAnalytics {
  category: string;
  cantidadProductos: number;
  precioPromedioVentaCOP: number;
  utilidadPromedioCOP: number;
  utilidadTotalCategoriaCOP: number;
  ratingPromedio: number;
}

export type CatalogSource = 'live' | 'memory-cache' | 'disk-fallback';

export interface OpportunitiesResponse {
  meta: {
    markupAplicado: number;
    fuenteDatos: CatalogSource;
    totalProductos: number;
  };
  catalogo: ProcessedProduct[];
  top3Oportunidad: ProcessedProduct[];
}